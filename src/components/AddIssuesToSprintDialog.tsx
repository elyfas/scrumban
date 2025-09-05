import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Search, AlertTriangle, Plus, Target } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { KanbanCard, Sprint } from '../types/kanban';

interface AddIssuesToSprintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sprint: Sprint | null;
  allCards: KanbanCard[];
  allSprints: Sprint[];
  onAddIssues: (cardIds: string[], sprintId: string) => void;
}

interface ReplanningIssue {
  card: KanbanCard;
  fromSprintName: string;
}

export function AddIssuesToSprintDialog({
  isOpen,
  onClose,
  sprint,
  allCards,
  allSprints,
  onAddIssues
}: AddIssuesToSprintDialogProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [replanningAlert, setReplanningAlert] = useState<{
    open: boolean;
    issues: ReplanningIssue[];
  }>({ open: false, issues: [] });

  // Get available cards (backlog + planned cards from other sprints, excluding 'finalizado' status)
  const availableCards = useMemo(() => {
    if (!sprint || !allCards || !allSprints) return [];
    
    return allCards.filter(card => {
      // Exclude cards that are already in the current sprint
      if (card.sprint === sprint.id) return false;
      
      // Exclude cards with status 'finalizado'
      if (card.status === 'finalizado') return false;
      
      // Include backlog cards (no sprint assigned)
      if (!card.sprint) return true;
      
      // Include cards from other sprints that are not completed or cancelled
      const cardSprint = allSprints.find(s => s.id === card.sprint);
      return cardSprint && (cardSprint.status === 'planning' || cardSprint.status === 'active');
    });
  }, [allCards, allSprints, sprint]);

  // Filter cards based on search (ID and Title only as requested)
  const filteredCards = useMemo(() => {
    if (!availableCards || !searchText.trim()) return availableCards || [];

    const searchLower = searchText.toLowerCase();
    return availableCards.filter(card => 
      // Filter by ID (card number)
      (card && card.cardNumber && card.cardNumber.toString().includes(searchLower)) ||
      // Filter by Title
      (card && card.title && card.title.toLowerCase().includes(searchLower))
    );
  }, [availableCards, searchText]);

  // Early return if sprint is null (after all hooks are called)
  if (!sprint) {
    return null;
  }

  const handleCardSelection = (cardId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCardIds(prev => [...prev, cardId]);
    } else {
      setSelectedCardIds(prev => prev.filter(id => id !== cardId));
    }
  };

  const handleSelectAll = () => {
    if (!filteredCards || selectedCardIds.length === filteredCards.length) {
      setSelectedCardIds([]);
    } else {
      setSelectedCardIds(filteredCards.map(card => card.id));
    }
  };

  const handleAddIssues = () => {
    if (selectedCardIds.length === 0) {
      toast.error('Selecione pelo menos uma história para adicionar à sprint.');
      return;
    }

    // Check for replanning issues
    const replanningIssues: ReplanningIssue[] = [];
    
    selectedCardIds.forEach(cardId => {
      const card = allCards && allCards.find(c => c.id === cardId);
      if (card && card.sprint && allSprints) {
        const fromSprint = allSprints.find(s => s.id === card.sprint);
        if (fromSprint) {
          replanningIssues.push({
            card,
            fromSprintName: fromSprint.name
          });
        }
      }
    });

    if (replanningIssues.length > 0) {
      // Show replanning confirmation dialog
      setReplanningAlert({
        open: true,
        issues: replanningIssues
      });
    } else {
      // No replanning needed, add issues directly
      onAddIssues(selectedCardIds, sprint.id);
      handleClose();
    }
  };

  const handleConfirmReplanning = () => {
    onAddIssues(selectedCardIds, sprint.id);
    setReplanningAlert({ open: false, issues: [] });
    handleClose();
  };

  const handleClose = () => {
    setSearchText('');
    setSelectedCardIds([]);
    setReplanningAlert({ open: false, issues: [] });
    onClose();
  };

  const getCardSprintInfo = (card: KanbanCard) => {
    if (!card || !card.sprint || !allSprints) return null;
    const cardSprint = allSprints.find(s => s.id === card.sprint);
    return cardSprint ? { name: cardSprint.name, status: cardSprint.status } : null;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Adicionar Issues à Sprint: {sprint.name}
            </DialogTitle>
            <DialogDescription>
              Selecione histórias de usuário disponíveis (exceto finalizadas) para adicionar à esta sprint. Use a busca por ID ou título para encontrar histórias específicas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-hidden">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por ID (#1001) ou título"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selection summary */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {selectedCardIds.length} de {filteredCards.length} histórias selecionadas
                </span>
                {selectedCardIds.length > 0 && allCards && (
                  <span className="text-sm text-blue-600">
                    {allCards
                      .filter(card => card && selectedCardIds.includes(card.id))
                      .reduce((total, card) => total + (card.storyPoints || 0), 0)} story points
                  </span>
                )}
              </div>
              
              {filteredCards.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedCardIds.length === filteredCards.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
                </Button>
              )}
            </div>

            {/* Cards list */}
            <ScrollArea className="h-96">
              <div className="space-y-2 pt-[5px] pb-0 pl-[6px] pr-[8px] mx-[1px]">
                {!filteredCards || filteredCards.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      {availableCards.length === 0 ? (
                        <>
                          <Target className="w-8 h-8 mx-auto mb-2" />
                          <p>Nenhuma história disponível</p>
                          <p className="text-sm">Todas as histórias já estão em sprints ou foram finalizadas</p>
                        </>
                      ) : (
                        <>
                          <Search className="w-8 h-8 mx-auto mb-2" />
                          <p>Nenhuma história encontrada</p>
                          <p className="text-sm">Tente alterar os termos de busca por ID ou título</p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  filteredCards.map(card => {
                    const sprintInfo = getCardSprintInfo(card);
                    const isSelected = selectedCardIds.includes(card.id);
                    
                    return (
                      <Card 
                        key={card.id}
                        className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => handleCardSelection(card.id, !isSelected)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleCardSelection(card.id, !isSelected)}
                              className="mt-1"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-gray-500 font-mono">#{card.cardNumber}</span>
                                
                                {/* Issue type icon */}
                                {card.issueType === 'story' && <span className="text-sm">📖</span>}
                                {card.issueType === 'bug' && <span className="text-sm">🐛</span>}
                                {card.issueType === 'task' && <span className="text-sm">✓</span>}
                                {card.issueType === 'epic' && <span className="text-sm">⚡</span>}
                                
                                {/* Priority indicator */}
                                <div className={`w-2 h-2 rounded-full ${
                                  card.priority === 'critical' ? 'bg-red-500' :
                                  card.priority === 'high' ? 'bg-orange-500' :
                                  card.priority === 'medium' ? 'bg-yellow-500' :
                                  'bg-gray-400'
                                }`}></div>

                                {/* Story points */}
                                {card.storyPoints && (
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {card.storyPoints}
                                  </Badge>
                                )}
                              </div>
                              
                              <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">{card.title}</h3>
                              
                              {card.description && (
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{card.description}</p>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {card.assignee && (
                                    <span className="text-xs text-gray-600">
                                      👤 {card.assignee}
                                    </span>
                                  )}
                                </div>

                                {sprintInfo && (
                                  <div className="flex items-center gap-1 text-orange-600">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span className="text-xs">
                                      Em: {sprintInfo.name}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={handleAddIssues}
                disabled={selectedCardIds.length === 0}
                className="flex-1"
              >
                Adicionar {selectedCardIds.length > 0 ? `${selectedCardIds.length} ` : ''}Issues
              </Button>
              
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Replanning confirmation dialog */}
      <AlertDialog 
        open={replanningAlert.open} 
        onOpenChange={(open) => setReplanningAlert(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Confirmar Replanejamento
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3">
                <p>
                  {replanningAlert.issues.length === 1 
                    ? 'A seguinte história será movida de sua sprint atual:'
                    : `${replanningAlert.issues.length} histórias serão movidas de suas sprints atuais:`
                  }
                </p>
                
                <div className="bg-orange-50 p-3 rounded-lg space-y-2">
                  {replanningAlert.issues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="font-medium">#{issue.card.cardNumber} - {issue.card.title}</span>
                      <span className="text-orange-700 bg-orange-100 px-2 py-1 rounded text-xs">
                        De: {issue.fromSprintName}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-sm">
                  Esta ação irá mover {replanningAlert.issues.length === 1 ? 'esta história' : 'estas histórias'} para 
                  a sprint <strong>"{sprint.name}"</strong>. Deseja continuar?
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReplanning}>
              Confirmar Replanejamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}