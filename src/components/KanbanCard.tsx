import { KanbanCard as KanbanCardType, Priority, IssueType, ViewMode } from '../types/kanban';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Calendar, User, AlertCircle, Bug, BookOpen, CheckSquare, Zap, Clock, GitBranch } from 'lucide-react';
import { motion } from 'motion/react';

interface KanbanCardProps {
  card: KanbanCardType;
  onClick?: () => void;
  isDragging?: boolean;
  viewMode?: ViewMode;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const issueTypeIcons: Record<IssueType, React.ReactNode> = {
  story: <BookOpen className="w-4 h-4 text-blue-500" />,
  bug: <Bug className="w-4 h-4 text-red-500" />,
  task: <CheckSquare className="w-4 h-4 text-green-500" />,
  epic: <Zap className="w-4 h-4 text-purple-500" />
};

export function KanbanCard({ card, onClick, isDragging = false, viewMode = 'expanded' }: KanbanCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit'
    }).format(date);
  };

  const isOverdue = (date: Date) => {
    return new Date() > date;
  };

  const getCompletionPercentage = (checklist: any[]) => {
    if (checklist.length === 0) return 0;
    const completed = checklist.filter(item => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  const acceptanceCriteriaProgress = getCompletionPercentage(card.acceptanceCriteria);
  const dorProgress = getCompletionPercentage(card.definitionOfReady);
  const dodProgress = getCompletionPercentage(card.definitionOfDone);

  if (viewMode === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: isDragging ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div 
          className={`bg-white border border-slate-200 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:border-slate-300 ${
            isDragging ? 'opacity-50 rotate-2' : ''
          } ${card.priority === 'critical' ? 'border-l-4 border-l-red-500' : ''} ${card.priority === 'high' ? 'border-l-4 border-l-orange-500' : ''}`}
          onClick={onClick}
        >
          <div className="p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {issueTypeIcons[card.issueType]}
                <span className="text-xs font-medium text-slate-500 shrink-0">#{card.cardNumber}</span>
                <span className="truncate text-sm font-medium text-slate-800">{card.title}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${priorityColors[card.priority]} border-0`}
                >
                  {card.priority[0].toUpperCase()}
                </Badge>
                <Avatar className="w-5 h-5 border border-slate-200">
                  <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                    {getInitials(card.assignee)}
                  </AvatarFallback>
                </Avatar>
                {card.storyPoints && (
                  <div className="w-5 h-5 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
                    {card.storyPoints}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div 
        className={`bg-white border border-slate-200 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-slate-300 ${
          isDragging ? 'opacity-50 rotate-2' : ''
        } ${card.priority === 'critical' ? 'border-l-4 border-l-red-500' : ''} ${card.priority === 'high' ? 'border-l-4 border-l-orange-500' : ''}`}
        onClick={onClick}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              {issueTypeIcons[card.issueType]}
              <span className="text-xs font-medium text-slate-500 shrink-0">#{card.cardNumber}</span>
              <h4 className="truncate text-sm font-medium text-slate-800">{card.title}</h4>
            </div>
            <Badge 
              variant="outline" 
              className={`shrink-0 ${priorityColors[card.priority]} border-0 text-xs`}
            >
              {card.priority.toUpperCase()}
            </Badge>
          </div>
        
          <div className="space-y-3">
            {card.description && (
              <p className="text-slate-600 line-clamp-2 text-sm">
                {card.description}
              </p>
            )}
            
            {/* Progress Indicators */}
            <div className="space-y-2">
              {card.acceptanceCriteria.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Critérios de Aceitação</span>
                    <span>{acceptanceCriteriaProgress}%</span>
                  </div>
                  <Progress value={acceptanceCriteriaProgress} className="h-1.5" />
                </div>
              )}
              
              {card.definitionOfReady.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>DoR</span>
                    <span>{dorProgress}%</span>
                  </div>
                  <Progress value={dorProgress} className="h-1.5" />
                </div>
              )}
              
              {card.definitionOfDone.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>DoD</span>
                    <span>{dodProgress}%</span>
                  </div>
                  <Progress value={dodProgress} className="h-1.5" />
                </div>
              )}
            </div>
            
            {/* Test Status */}
            {card.testScenarios.length > 0 && (
              <div className="flex gap-1">
                {card.testScenarios.map((test, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      test.status === 'passed' ? 'bg-green-500' :
                      test.status === 'failed' ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                    title={`${test.title}: ${test.status}`}
                  />
                ))}
              </div>
            )}
            
            <div className="flex flex-wrap gap-1">
              {card.labels.slice(0, 3).map((label, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-0">
                  {label}
                </Badge>
              ))}
              {card.labels.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-0">
                  +{card.labels.length - 3}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Avatar className="w-6 h-6 border border-slate-200">
                    <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                      {getInitials(card.assignee)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {card.storyPoints && (
                  <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
                    {card.storyPoints}
                  </div>
                )}

                {card.developmentLinks.branch && (
                  <GitBranch className="w-3 h-3 text-slate-400" />
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {card.plannedDueDate && (
                  <div className={`flex items-center gap-1 text-xs ${
                    isOverdue(card.plannedDueDate) ? 'text-red-600' : 'text-slate-500'
                  }`}>
                    {isOverdue(card.plannedDueDate) && <AlertCircle className="w-3 h-3" />}
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(card.plannedDueDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}