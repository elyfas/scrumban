import { useState, useEffect, useMemo } from 'react';
import { Plus, Target, MoreHorizontal, Edit, Trash2, Archive, Play, RefreshCw, TrendingUp, BarChart3, Users, ArrowRight, CheckSquare, Square, AlertTriangle, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { KanbanCard, Sprint } from '../types/kanban';
import { mockCards, mockSprints } from '../constants/kanban';
import { BacklogFilters, BacklogFilterOptions } from './BacklogFilters';
import { SprintCardItem } from './SprintCardItem';
import { CreateCardDialog } from './CreateCardDialog';
import { CardDetailsPanel } from './CardDetailsPanel';

export function BacklogView() {
  const [allCards, setAllCards] = useState<KanbanCard[]>(mockCards);
  const [allSprints, setAllSprints] = useState<Sprint[]>(mockSprints);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [filters, setFilters] = useState<BacklogFilterOptions>({
    searchText: '',
    status: [],
    priority: [],
    type: [],
    assignee: []
  });
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [targetSprintId, setTargetSprintId] = useState<string>('');
  const [moveValidationAlert, setMoveValidationAlert] = useState<{
    open: boolean;
    title: string;
    description: string;
    type: 'error' | 'warning';
  }>({ open: false, title: '', description: '', type: 'error' });

  // Get all cards that are not in any sprint (backlog cards)
  const backlogCards = useMemo(() => {
    return allCards.filter(card => !card.sprint);
  }, [allCards]);

  // Get available assignees for filter
  const availableAssignees = useMemo(() => {
    const assignees = new Set<string>();
    backlogCards.forEach(card => {
      if (card.assignee) {
        assignees.add(card.assignee);
      }
    });
    return Array.from(assignees).sort();
  }, [backlogCards]);

  // Apply filters to backlog cards
  const filteredCards = useMemo(() => {
    let filtered = [...backlogCards];

    // Search filter
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(card =>
        card.title.toLowerCase().includes(searchLower) ||
        card.description.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(card => {
        if (filters.status.includes('backlog') && card.status === 'backlog') return true;
        if (filters.status.includes('planned') && card.status !== 'cancelled' && card.status !== 'backlog') return true;
        if (filters.status.includes('cancelled') && card.status === 'cancelled') return true;
        return false;
      });
    }

    // Priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(card => filters.priority.includes(card.priority));
    }

    // Type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter(card => filters.type.includes(card.issueType));
    }

    // Assignee filter
    if (filters.assignee.length > 0) {
      filtered = filtered.filter(card => 
        card.assignee && filters.assignee.includes(card.assignee)
      );
    }

    return filtered;
  }, [backlogCards, filters]);

  // Get available sprints for moving cards (only active and planning sprints)
  const availableSprints = useMemo(() => {
    return allSprints.filter(sprint => 
      sprint.status === 'active' || sprint.status === 'planning'
    );
  }, [allSprints]);

  // Calculate selected cards metrics
  const selectedCardsMetrics = useMemo(() => {
    const selectedCardsData = allCards.filter(card => selectedCards.includes(card.id));
    const totalStoryPoints = selectedCardsData.reduce((total, card) => total + (card.storyPoints || 0), 0);
    const cardsWithoutStoryPoints = selectedCardsData.filter(card => !card.storyPoints || card.storyPoints === 0);
    
    return {
      count: selectedCards.length,
      totalStoryPoints,
      cardsWithoutStoryPoints: cardsWithoutStoryPoints.length,
      hasCardsWithoutStoryPoints: cardsWithoutStoryPoints.length > 0
    };
  }, [selectedCards, allCards]);

  // Calculate backlog metrics
  const backlogMetrics = useMemo(() => {
    const totalStoryPoints = backlogCards.reduce((total, card) => total + (card.storyPoints || 0), 0);
    const plannedCards = backlogCards.filter(card => card.status !== 'cancelled');
    const cancelledCards = backlogCards.filter(card => card.status === 'cancelled');
    const assignedCards = backlogCards.filter(card => card.assignee);
    const unassignedCards = backlogCards.filter(card => !card.assignee);

    const priorityDistribution = {
      critical: backlogCards.filter(card => card.priority === 'critical').length,
      high: backlogCards.filter(card => card.priority === 'high').length,
      medium: backlogCards.filter(card => card.priority === 'medium').length,
      low: backlogCards.filter(card => card.priority === 'low').length
    };

    const typeDistribution = {
      story: backlogCards.filter(card => card.issueType === 'story').length,
      bug: backlogCards.filter(card => card.issueType === 'bug').length,
      task: backlogCards.filter(card => card.issueType === 'task').length,
      epic: backlogCards.filter(card => card.issueType === 'epic').length
    };

    return {
      totalCards: backlogCards.length,
      totalStoryPoints,
      plannedCards: plannedCards.length,
      cancelledCards: cancelledCards.length,
      assignedCards: assignedCards.length,
      unassignedCards: unassignedCards.length,
      priorityDistribution,
      typeDistribution
    };
  }, [backlogCards]);

  const handleCardDragStart = (e: React.DragEvent, cardId: string, fromSprint: string | undefined) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      cardId,
      fromSprint: undefined // Backlog cards don't have a sprint
    }));
  };

  const handleCardSelection = (cardId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCards(prev => [...prev, cardId]);
    } else {
      setSelectedCards(prev => prev.filter(id => id !== cardId));
    }
  };

  const handleSelectAll = () => {
    if (selectedCards.length === filteredCards.length) {
      setSelectedCards([]);
    } else {
      setSelectedCards(filteredCards.map(card => card.id));
    }
  };

  const handleCardEdit = (card: KanbanCard) => {
    setSelectedCard(card);
  };

  const validateMoveToSprint = (sprintId: string): { valid: boolean; message?: string; type?: 'error' | 'warning' } => {
    const selectedCardsData = allCards.filter(card => selectedCards.includes(card.id));
    const targetSprint = allSprints.find(sprint => sprint.id === sprintId);
    
    if (!targetSprint) {
      return { valid: false, message: 'Sprint não encontrada.' };
    }

    // Check if all selected cards have story points
    const cardsWithoutStoryPoints = selectedCardsData.filter(card => !card.storyPoints || card.storyPoints === 0);
    if (cardsWithoutStoryPoints.length > 0) {
      return { 
        valid: false, 
        message: `${cardsWithoutStoryPoints.length} história(s) não possuem story points definidos. Somente histórias com story points podem ser movidas para sprints.`,
        type: 'error'
      };
    }

    // Check sprint capacity
    const sprintCards = allCards.filter(card => card.sprint === sprintId);
    const currentSprintPoints = sprintCards.reduce((total, card) => total + (card.storyPoints || 0), 0);
    const selectedPoints = selectedCardsData.reduce((total, card) => total + (card.storyPoints || 0), 0);
    const totalAfterMove = currentSprintPoints + selectedPoints;

    if (totalAfterMove > targetSprint.capacity) {
      const exceedingPoints = totalAfterMove - targetSprint.capacity;
      return { 
        valid: false, 
        message: `A capacidade da sprint "${targetSprint.name}" será excedida em ${exceedingPoints} story points. Capacidade atual: ${currentSprintPoints}/${targetSprint.capacity}. Histórias selecionadas: ${selectedPoints} pontos.`,
        type: 'error'
      };
    }

    return { valid: true };
  };

  const handleMoveToSprint = () => {
    if (!targetSprintId) {
      toast.error('Selecione uma sprint de destino.');
      return;
    }

    const validation = validateMoveToSprint(targetSprintId);
    
    if (!validation.valid) {
      setMoveValidationAlert({
        open: true,
        title: validation.type === 'error' ? 'Erro na Movimentação' : 'Aviso',
        description: validation.message || '',
        type: validation.type || 'error'
      });
      return;
    }

    // Move cards to sprint
    const updatedCards = allCards.map(card => 
      selectedCards.includes(card.id) 
        ? { ...card, sprint: targetSprintId }
        : card
    );
    
    setAllCards(updatedCards);
    
    const targetSprint = allSprints.find(s => s.id === targetSprintId);
    toast.success(`${selectedCards.length} história(s) movida(s) para "${targetSprint?.name}".`);
    
    // Reset state
    setSelectedCards([]);
    setTargetSprintId('');
    setIsMoveDialogOpen(false);
  };

  const handleCreateCard = (cardData: Omit<KanbanCard, 'id' | 'cardNumber' | 'createdAt'>) => {
    const cardId = Date.now().toString();
    const newCard = {
      ...cardData,
      id: cardId,
      cardNumber: Math.max(...allCards.map(c => c.cardNumber), 0) + 1,
      createdAt: new Date()
    };
    
    setAllCards(prev => [...prev, newCard]);
    toast.success('Nova história criada com sucesso!');
  };

  const handleBulkAction = (action: string, selectedCards: string[]) => {
    switch (action) {
      case 'archive':
        // Archive selected cards
        const updatedCards = allCards.map(card =>
          selectedCards.includes(card.id) ? { ...card, status: 'archived' as const } : card
        );
        setAllCards(updatedCards);
        toast.success(`${selectedCards.length} histórias foram arquivadas.`);
        break;
      
      case 'cancel':
        // Cancel selected cards
        const cancelledCards = allCards.map(card =>
          selectedCards.includes(card.id) ? { ...card, status: 'cancelled' as const } : card
        );
        setAllCards(cancelledCards);
        toast.success(`${selectedCards.length} histórias foram canceladas.`);
        break;
        
      case 'reactivate':
        // Reactivate cancelled cards
        const reactivatedCards = allCards.map(card =>
          selectedCards.includes(card.id) ? { ...card, status: 'todo' as const } : card
        );
        setAllCards(reactivatedCards);
        toast.success(`${selectedCards.length} histórias foram reativadas.`);
        break;
    }
  };

  const handleSingleCardAction = (action: string, cardId: string) => {
    switch (action) {
      case 'edit':
        const cardToEdit = allCards.find(card => card.id === cardId);
        if (cardToEdit) {
          handleCardEdit(cardToEdit);
        }
        break;
      
      case 'archive':
        const updatedCards = allCards.map(card =>
          card.id === cardId ? { ...card, status: 'archived' as const } : card
        );
        setAllCards(updatedCards);
        toast.success('História arquivada com sucesso!');
        break;
        
      case 'delete':
        const filteredCards = allCards.filter(card => card.id !== cardId);
        setAllCards(filteredCards);
        toast.success('História excluída com sucesso!');
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backlog</h1>
          <p className="text-gray-600 mt-1">Gerencie suas histórias não planejadas</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Total de Histórias</p>
                <p className="text-2xl font-bold text-gray-900">{backlogMetrics.totalCards}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Story Points</p>
                <p className="text-2xl font-bold text-gray-900">{backlogMetrics.totalStoryPoints}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Planejadas</p>
                <p className="text-2xl font-bold text-green-700">{backlogMetrics.plannedCards}</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Sem Responsável</p>
                <p className="text-2xl font-bold text-orange-700">{backlogMetrics.unassignedCards}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <BacklogFilters
        filters={filters}
        onFiltersChange={setFilters}
        availableAssignees={availableAssignees}
      />

      {/* Selection Summary and Actions */}
      {selectedCards.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {selectedCards.length} história(s) selecionada(s)
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-blue-700">
                  <span>
                    <strong>{selectedCardsMetrics.totalStoryPoints}</strong> story points
                  </span>
                  
                  {selectedCardsMetrics.hasCardsWithoutStoryPoints && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{selectedCardsMetrics.cardsWithoutStoryPoints} sem story points</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedCards([])}
                >
                  Cancelar Seleção
                </Button>
                
                <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm"
                      disabled={selectedCards.length === 0}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Mover para Sprint
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mover Histórias para Sprint</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Histórias Selecionadas:</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span><strong>{selectedCards.length}</strong> histórias</span>
                          <span><strong>{selectedCardsMetrics.totalStoryPoints}</strong> story points</span>
                          {selectedCardsMetrics.hasCardsWithoutStoryPoints && (
                            <span className="text-orange-600">
                              <strong>{selectedCardsMetrics.cardsWithoutStoryPoints}</strong> sem story points
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Sprint de Destino
                        </label>
                        <Select value={targetSprintId} onValueChange={setTargetSprintId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma sprint" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSprints.map(sprint => {
                              const sprintCards = allCards.filter(card => card.sprint === sprint.id);
                              const currentPoints = sprintCards.reduce((total, card) => total + (card.storyPoints || 0), 0);
                              const remainingCapacity = sprint.capacity - currentPoints;
                              
                              return (
                                <SelectItem key={sprint.id} value={sprint.id}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{sprint.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">
                                      {currentPoints}/{sprint.capacity} pts ({remainingCapacity} livres)
                                    </span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedCardsMetrics.hasCardsWithoutStoryPoints && (
                        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                          <div className="flex items-center gap-2 text-orange-800">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-medium">Atenção</span>
                          </div>
                          <p className="text-sm text-orange-700 mt-1">
                            {selectedCardsMetrics.cardsWithoutStoryPoints} história(s) não possuem story points. 
                            Somente histórias com story points podem ser movidas.
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsMoveDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          onClick={handleMoveToSprint}
                          disabled={!targetSprintId || selectedCardsMetrics.hasCardsWithoutStoryPoints}
                          className="flex-1"
                        >
                          Mover Histórias
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Mostrando <strong>{filteredCards.length}</strong> de <strong>{backlogCards.length}</strong> histórias
          {filters.searchText && (
            <span> para "{filters.searchText}"</span>
          )}
        </div>

        {filteredCards.length > 0 && (
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="flex items-center gap-2"
            >
              {selectedCards.length === filteredCards.length ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              {selectedCards.length === filteredCards.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
            </Button>
            
            <Button
              size="sm"
              className="h-8 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Criar Issue
            </Button>
            
            <span>
              {filteredCards.reduce((total, card) => total + (card.storyPoints || 0), 0)} story points
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4 mr-1" />
                  Ações em Lote
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleBulkAction('archive', filteredCards.map(c => c.id))}>
                  <Archive className="w-4 h-4 mr-2" />
                  Arquivar Todas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('cancel', filteredCards.map(c => c.id))}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Todas
                </DropdownMenuItem>
                {filters.status.includes('cancelled') && (
                  <DropdownMenuItem onClick={() => handleBulkAction('reactivate', filteredCards.map(c => c.id))}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reativar Todas
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Cards List */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {backlogCards.length === 0 
              ? 'Backlog vazio' 
              : 'Nenhuma história encontrada'
            }
          </h3>
          <p className="text-gray-500">
            {backlogCards.length === 0
              ? 'Todas as histórias estão em sprints ou foram arquivadas'
              : 'Tente ajustar os filtros de busca'
            }
          </p>
          {backlogCards.length === 0 && (
            <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira História
            </Button>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Header das 5 colunas */}
              <div className="grid grid-cols-[auto_2fr_1fr_100px_120px] gap-4 px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600 uppercase tracking-wide">
                <div className="w-8 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                    className="p-1 h-6 w-6"
                  >
                    {selectedCards.length === filteredCards.length ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div>História de Usuário</div>
                <div className="text-center">Responsável</div>
                <div className="text-center">Story Points</div>
                <div className="text-center">Ações</div>
              </div>
              
              {/* Lista de cards */}
              <div className="space-y-1 p-2">
                {filteredCards.map((card) => (
                  <div
                    key={card.id}
                    className={`grid grid-cols-[auto_2fr_1fr_100px_120px] gap-4 px-3 py-2 border border-transparent rounded-lg hover:bg-gray-50 hover:border-gray-200 transition-colors ${
                      selectedCards.includes(card.id) ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="w-8 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCardSelection(card.id, !selectedCards.includes(card.id))}
                        className="p-1 h-6 w-6"
                      >
                        {selectedCards.includes(card.id) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    
                    <div 
                      className="min-w-0 cursor-pointer"
                      onClick={() => handleCardEdit(card)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500 font-mono">#{card.cardNumber}</span>
                            
                            {card.issueType === 'story' && <span className="text-sm">📖</span>}
                            {card.issueType === 'bug' && <span className="text-sm">🐛</span>}
                            {card.issueType === 'task' && <span className="text-sm">✓</span>}
                            {card.issueType === 'epic' && <span className="text-sm">⚡</span>}
                            
                            <div className={`w-2 h-2 rounded-full ${
                              card.priority === 'critical' ? 'bg-red-500' :
                              card.priority === 'high' ? 'bg-orange-500' :
                              card.priority === 'medium' ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`}></div>
                          </div>
                          
                          <h3 className="font-medium text-gray-900 line-clamp-2">{card.title}</h3>
                          
                          {card.description && (
                            <p className="text-sm text-gray-600 line-clamp-1 mt-1">{card.description}</p>
                          )}
                          
                          {card.labels && card.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {card.labels.slice(0, 3).map((label, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {label}
                                </Badge>
                              ))}
                              {card.labels.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{card.labels.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Responsável */}
                    <div className="text-center flex items-center justify-center">
                      <span className="text-sm text-gray-700">
                        {card.assignee || 'Não atribuído'}
                      </span>
                    </div>
                    
                    {/* Story Points */}
                    <div className="text-center flex items-center justify-center">
                      {card.storyPoints ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {card.storyPoints}
                        </Badge>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                    
                    {/* Ações */}
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSingleCardAction('edit', card.id);
                        }}
                        className="p-1 h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="Editar"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSingleCardAction('archive', card.id);
                        }}
                        className="p-1 h-7 w-7 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        title="Arquivar"
                      >
                        <Archive className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Tem certeza que deseja excluir esta história? Esta ação não pode ser desfeita.')) {
                            handleSingleCardAction('delete', card.id);
                          }
                        }}
                        className="p-1 h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Excluir"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <CreateCardDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateCard}
        initialStatus="backlog"
      />

      <CardDetailsPanel
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onSave={(updatedCard) => {
          setAllCards(prev => prev.map(card => 
            card.id === updatedCard.id ? updatedCard : card
          ));
          setSelectedCard(null);
          toast.success('Card atualizado com sucesso!');
        }}
      />

      {/* Move validation alert */}
      <AlertDialog 
        open={moveValidationAlert.open} 
        onOpenChange={(open) => setMoveValidationAlert(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{moveValidationAlert.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {moveValidationAlert.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Entendi</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}