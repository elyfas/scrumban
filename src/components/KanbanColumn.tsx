import { KanbanColumn as KanbanColumnType, KanbanCard as KanbanCardType, Status, ViewMode } from '../types/kanban';
import { KanbanCard } from './KanbanCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onCardClick: (card: KanbanCardType) => void;
  onAddCard: (status: Status) => void;
  onDrop: (cardId: string, targetStatus: Status) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
  viewMode: ViewMode;
}

export function KanbanColumn({ 
  column, 
  onCardClick, 
  onAddCard, 
  onDrop, 
  onDragOver, 
  onDragStart,
  viewMode
}: KanbanColumnProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    onDrop(cardId, column.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);
  };

  const getTotalStoryPoints = () => {
    return column.cards.reduce((total, card) => total + (card.storyPoints || 0), 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 h-fit min-h-[200px]">
      <div className="p-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-slate-700 uppercase tracking-wide">
              {column.title}
            </h3>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-0">
                {column.cards.length}
              </Badge>
              {getTotalStoryPoints() > 0 && (
                <Badge variant="outline" className="text-xs border-slate-300 text-slate-600">
                  {getTotalStoryPoints()} SP
                </Badge>
              )}
            </div>
          </div>
          {column.id === 'backlog' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onAddCard(column.id)}
              className="h-6 w-6 p-0 hover:bg-slate-100 text-slate-500"
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
      
      <div 
        className={`p-3 space-y-2 min-h-[150px] ${viewMode === 'compact' ? 'space-y-1' : 'space-y-2'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {column.cards.map((card) => (
          <div
            key={card.id}
            draggable
            onDragStart={(e) => onDragStart(e, card.id)}
          >
            <KanbanCard
              card={card}
              onClick={() => onCardClick(card)}
              viewMode={viewMode}
            />
          </div>
        ))}
        
        {column.cards.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            <p className="text-sm">Nenhuma issue</p>
            {column.id === 'backlog' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onAddCard(column.id)}
                className="mt-2 text-slate-600 hover:bg-slate-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar issue
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}