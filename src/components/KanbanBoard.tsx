import { useState, useEffect, useMemo } from 'react';
import { KanbanCard, KanbanColumn as KanbanColumnType, Status, FilterOptions, ViewMode, HistoryEntry } from '../types/kanban';
import { KanbanColumn } from './KanbanColumn';
import { CreateCardDialog } from './CreateCardDialog';
import { CardDetailsPanel } from './CardDetailsPanel';
import { KanbanFilters } from './KanbanFilters';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Settings, LayoutGrid, List } from 'lucide-react';
import { toast } from '../utils/toast';
import { initialColumns, mockCards, availableSprints, currentUser } from '../constants/kanban';
import { 
  getUniqueAssignees, 
  getUniqueSprints, 
  getUniqueLabels, 
  filterCard, 
  initializeColumnsWithCards, 
  setCompletionDateIfFinalized,
  getNextCardNumber,
  canMoveCard
} from '../utils/kanban';





export function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumnType[]>(initialColumns);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status>('backlog');
  const [editingCard, setEditingCard] = useState<KanbanCard | undefined>();
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('expanded');
  
  const [filters, setFilters] = useState<FilterOptions>({
    priority: [],
    assignee: [],
    issueType: [],
    sprint: [],
    label: [],
    searchText: ''
  });

  const [selectedSprint, setSelectedSprint] = useState<string>('all');

  // Get unique values for filters
  const availableAssignees = useMemo(() => getUniqueAssignees(columns), [columns]);
  const availableSprintsForFilter = useMemo(() => getUniqueSprints(columns), [columns]);
  const availableLabels = useMemo(() => getUniqueLabels(columns), [columns]);

  // Filter cards based on current filters
  const filteredColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      cards: column.cards.filter(card => filterCard(card, filters, selectedSprint))
    }));
  }, [columns, filters, selectedSprint]);

  // Initialize with mock data
  useEffect(() => {
    setColumns(initializeColumnsWithCards(initialColumns, mockCards));
  }, []);

  const handleCreateCard = (status: Status) => {
    setSelectedStatus(status);
    setEditingCard(undefined);
    setIsCreateDialogOpen(true);
  };

  const handleEditCard = (card: KanbanCard) => {
    setEditingCard(card);
    setSelectedStatus(card.status);
    setIsCreateDialogOpen(true);
  };

  const handleCardClick = (card: KanbanCard) => {
    setSelectedCard(card);
    setIsPanelOpen(true);
  };

  const handleUpdateCard = (updatedCard: KanbanCard) => {
    const cardWithDate = setCompletionDateIfFinalized(updatedCard);
    
    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        cards: column.cards.map(card => 
          card.id === cardWithDate.id ? cardWithDate : card
        )
      }))
    );
    setSelectedCard(cardWithDate);
  };

  const handleDeleteCard = (cardId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(column => ({
        ...column,
        cards: column.cards.filter(card => card.id !== cardId)
      }))
    );
    setSelectedCard(null);
    setIsPanelOpen(false);
  };

  const handleSaveCard = (cardData: Omit<KanbanCard, 'id' | 'cardNumber' | 'createdAt'>) => {
    if (editingCard) {
      // Edit existing card
      const updatedCard = setCompletionDateIfFinalized({ 
        ...cardData, 
        id: editingCard.id, 
        cardNumber: editingCard.cardNumber,
        createdAt: editingCard.createdAt 
      });
      
      setColumns(prevColumns => 
        prevColumns.map(column => ({
          ...column,
          cards: column.cards.map(card => 
            card.id === editingCard.id ? updatedCard : card
          ).filter(card => card.status === column.id)
        })).map(column => ({
          ...column,
          cards: column.id === cardData.status 
            ? [...column.cards.filter(c => c.id !== editingCard.id), updatedCard]
            : column.cards
        }))
      );
    } else {
      // Create new card
      const cardId = Date.now().toString();
      const creationHistoryEntry: HistoryEntry = {
        id: cardId + '_creation',
        action: 'criacao',
        description: 'Card criado',
        author: currentUser.name,
        timestamp: new Date(),
        field: 'status',
        newValue: cardData.status
      };

      const newCard = setCompletionDateIfFinalized({
        ...cardData,
        id: cardId,
        cardNumber: getNextCardNumber(columns),
        createdAt: new Date(),
        comments: cardData.comments || [],
        history: [...(cardData.history || []), creationHistoryEntry]
      });

      setColumns(prevColumns => 
        prevColumns.map(column => 
          column.id === cardData.status 
            ? { ...column, cards: [...column.cards, newCard] }
            : column
        )
      );
    }
  };

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (cardId: string, targetStatus: Status) => {
    setColumns(prevColumns => {
      let cardToMove: KanbanCard | null = null;
      let originalStatus: Status | null = null;
      
      const updatedColumns = prevColumns.map(column => {
        const cardIndex = column.cards.findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
          const originalCard = column.cards[cardIndex];
          originalStatus = originalCard.status;
          
          // Validar se a movimentação é permitida baseada na função do usuário
          const validationResult = canMoveCard(originalCard, originalStatus, targetStatus, currentUser);
          
          if (!validationResult.canMove) {
            toast.error(`Movimentação não permitida: ${validationResult.reason}`);
            return column; // Retorna a coluna sem modificações
          }

          // Create history entry for status change
          const statusChangeHistoryEntry: HistoryEntry = {
            id: Date.now().toString() + '_status_change',
            action: 'mudanca_status',
            description: `Status alterado para ${targetStatus}`,
            author: currentUser.name,
            timestamp: new Date(),
            field: 'status',
            oldValue: originalStatus,
            newValue: targetStatus
          };

          cardToMove = setCompletionDateIfFinalized({
            ...originalCard, 
            status: targetStatus,
            history: [...originalCard.history, statusChangeHistoryEntry]
          });
          
          return {
            ...column,
            cards: column.cards.filter(card => card.id !== cardId)
          };
        }
        return column;
      });

      if (cardToMove) {
        return updatedColumns.map(column => 
          column.id === targetStatus 
            ? { ...column, cards: [...column.cards, cardToMove!] }
            : column
        );
      }

      return updatedColumns;
    });
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="mb-0 bg-white border-b border-border shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quadro Kanban</h1>
              <p className="text-gray-600 mt-1">
                Gestão de fluxo de trabalho ágil inspirado no Jira Software
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Current User Info */}
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-md border">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-slate-900">{currentUser.name}</span>
                  <span className="text-slate-600 ml-1">({currentUser.role})</span>
                </div>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-slate-100 rounded-md p-1">
                <Button
                  variant={viewMode === 'compact' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('compact')}
                  className="h-7 px-3 text-xs"
                >
                  <List className="w-3 h-3 mr-1" />
                  Compacto
                </Button>
                <Button
                  variant={viewMode === 'expanded' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('expanded')}
                  className="h-7 px-3 text-xs"
                >
                  <LayoutGrid className="w-3 h-3 mr-1" />
                  Expandido
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Button>

              </div>
            </div>
          </div>

          {/* Developer Restrictions Notice */}
          {currentUser.role === 'Desenvolvedor' && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 text-amber-600 mt-0.5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.345 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Regras para Desenvolvedores</p>
                  <p className="text-amber-700 mt-1">
                    Você pode mover apenas <strong>História de Usuário, Bug e Task</strong> seguindo este fluxo: 
                    Planejado → Em Execução → Em Espera → Em Execução → Em Teste → Aguardando Validação Técnica
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sprint Selector and Filters */}
          <div className="flex items-center gap-3 mb-4">
            {/* Sprint Selector */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-slate-700">Sprint:</Label>
              <Select value={selectedSprint} onValueChange={setSelectedSprint}>
                <SelectTrigger className="w-48 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Sprints</SelectItem>
                  {availableSprints.map((sprint) => (
                    <SelectItem key={sprint.id} value={sprint.name}>
                      {sprint.name} {sprint.isActive && '(Ativa)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filters */}
            <KanbanFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableAssignees={availableAssignees}
              availableSprints={availableSprintsForFilter}
              availableLabels={availableLabels}
            />
            
            {/* Create Issue Button */}
            <Button onClick={() => handleCreateCard('backlog')} size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Issue
            </Button>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="overflow-x-auto bg-slate-50 flex-1">
        <div className="px-6">
          <div className="flex gap-3 pb-6" style={{ minWidth: `${initialColumns.length * 260}px` }}>
            {filteredColumns.map((column) => (
              <div key={column.id} className="w-64 flex-shrink-0">
                <KanbanColumn
                  column={column}
                  onCardClick={handleCardClick}
                  onAddCard={handleCreateCard}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragStart={handleDragStart}
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialogs and Panels */}
      <CreateCardDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleSaveCard}
        initialStatus={selectedStatus}
        editCard={editingCard}
      />

      <CardDetailsPanel
        card={selectedCard}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onUpdate={handleUpdateCard}
        onDelete={handleDeleteCard}
      />
    </div>
  );
}