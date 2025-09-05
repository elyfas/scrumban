import { KanbanCard, Priority, IssueType } from '../types/kanban';
import { Badge } from './ui/badge';
import { GripVertical } from 'lucide-react';

interface SprintCardItemProps {
  card: KanbanCard;
  onDragStart: (e: React.DragEvent, cardId: string, fromSprint: string | undefined) => void;
}

export function SprintCardItem({ card, onDragStart }: SprintCardItemProps) {
  const getPriorityColor = (priority: Priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const getIssueTypeIcon = (type: IssueType) => {
    const icons = {
      story: '📖',
      bug: '🐛',
      task: '✓',
      epic: '⚡'
    };
    return icons[type];
  };

  return (
    <div
      key={card.id}
      draggable
      onDragStart={(e) => onDragStart(e, card.id, card.sprint)}
      className="grid grid-cols-[2fr_1fr_100px] gap-4 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-move group"
    >
      {/* Coluna 1: ID, Título e Descrição */}
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-xs text-gray-500 border border-gray-300 rounded px-1.5 py-0.5">
            #{card.cardNumber}
          </span>
          <span className="text-sm">{getIssueTypeIcon(card.type)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
            {card.title}
          </h4>
          {card.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {card.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              className={`text-xs px-2 py-1 ${getPriorityColor(card.priority)}`}
            >
              {card.priority.toUpperCase()}
            </Badge>
            {card.labels.map((label, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-2 py-1"
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Coluna 2: Responsável */}
      <div className="flex items-center justify-center">
        {card.assignee ? (
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-1">
              <span className="text-xs font-medium text-blue-800">
                {card.assignee.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <span className="text-xs text-gray-600 truncate block max-w-[80px]">
              {card.assignee}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Não atribuído</span>
        )}
      </div>

      {/* Coluna 3: Story Points */}
      <div className="flex items-center justify-center">
        {card.storyPoints ? (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {card.storyPoints}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </div>
    </div>
  );
}