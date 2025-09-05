import { useState } from 'react';
import * as React from 'react';
import { KanbanCard, ChecklistItem, TestScenario, Attachment, Priority, IssueType, Comment, HistoryEntry } from '../types/kanban';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Calendar, 
  User, 
  Bug, 
  BookOpen, 
  CheckSquare, 
  Zap, 
  GitBranch, 
  GitPullRequest,
  GitCommit,
  Plus,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  Paperclip,
  Upload,
  File,
  Download,
  ExternalLink,
  Edit,
  Save,
  X,
  MessageCircle,
  History,
  Clock,
  TestTube
} from 'lucide-react';

interface CardDetailsPanelProps {
  card: KanbanCard | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (card: KanbanCard) => void;
  onDelete: (cardId: string) => void;
}

const issueTypeIcons = {
  story: <BookOpen className="w-4 h-4 text-blue-500" />,
  bug: <Bug className="w-4 h-4 text-red-500" />,
  task: <CheckSquare className="w-4 h-4 text-green-500" />,
  epic: <Zap className="w-4 h-4 text-purple-500" />
};

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const testStatusColors = {
  pending: 'bg-gray-100 text-gray-800',
  passed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800'
};

export function CardDetailsPanel({ card, isOpen, onClose, onUpdate, onDelete }: CardDetailsPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<KanbanCard | null>(null);
  const [newCriteriaText, setNewCriteriaText] = useState('');
  const [newTestScenario, setNewTestScenario] = useState({
    title: '',
    description: '',
    expectedResult: ''
  });
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  // Reset editing state when panel opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setEditedCard(null);
    }
  }, [isOpen]);

  if (!card) return null;

  const currentUser = 'Usuário Atual'; // Em um app real, isso viria do contexto de autenticação

  const startEditing = () => {
    setIsEditing(true);
    setEditedCard({ ...card });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedCard(null);
  };

  const saveChanges = () => {
    if (editedCard) {
      // Basic validation
      if (!editedCard.title.trim()) {
        alert('O título do card é obrigatório.');
        return;
      }
      if (!editedCard.assignee.trim()) {
        alert('O responsável é obrigatório.');
        return;
      }
      if (!editedCard.reporter.trim()) {
        alert('O solicitante é obrigatório.');
        return;
      }

      // Confirmation alert before saving
      const confirmMessage = `Deseja salvar todas as alterações realizadas no card #${card.cardNumber} - "${editedCard.title}"?\n\nAs seguintes informações serão atualizadas conforme suas modificações.`;
      
      if (confirm(confirmMessage)) {
        onUpdate(editedCard);
        setIsEditing(false);
        setEditedCard(null);
      }
      // Se o usuário cancelar, permanece no modo de edição
    }
  };

  const handleDelete = () => {
    const confirmMessage = `Tem certeza que deseja excluir o card #${card.cardNumber} - "${card.title}"?\n\nEsta ação não pode ser desfeita.`;
    if (confirm(confirmMessage)) {
      onDelete(card.id);
      onClose();
    }
  };

  const currentCard = isEditing && editedCard ? editedCard : card;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const isOverdue = (date: Date) => {
    return new Date() > date;
  };

  const getCompletionPercentage = (checklist: ChecklistItem[]) => {
    if (checklist.length === 0) return 0;
    const completed = checklist.filter(item => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  const toggleChecklistItem = (checklistType: 'acceptanceCriteria' | 'definitionOfReady' | 'definitionOfDone', itemId: string) => {
    const updatedCard = {
      ...card,
      [checklistType]: card[checklistType].map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    };
    onUpdate(updatedCard);
  };

  const addCriteriaItem = (checklistType: 'acceptanceCriteria' | 'definitionOfReady' | 'definitionOfDone') => {
    if (!newCriteriaText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newCriteriaText.trim(),
      completed: false
    };

    const updatedCard = {
      ...card,
      [checklistType]: [...card[checklistType], newItem]
    };
    
    onUpdate(updatedCard);
    setNewCriteriaText('');
  };

  const addTestScenario = () => {
    if (!newTestScenario.title.trim()) return;
    
    const scenario: TestScenario = {
      id: Date.now().toString(),
      title: newTestScenario.title.trim(),
      description: newTestScenario.description.trim(),
      expectedResult: newTestScenario.expectedResult.trim(),
      status: 'pending'
    };

    const updatedCard = {
      ...card,
      testScenarios: [...card.testScenarios, scenario]
    };
    
    onUpdate(updatedCard);
    setNewTestScenario({ title: '', description: '', expectedResult: '' });
  };

  const updateTestScenarioStatus = (scenarioId: string, status: 'pending' | 'passed' | 'failed') => {
    const updatedCard = {
      ...card,
      testScenarios: card.testScenarios.map(scenario =>
        scenario.id === scenarioId ? { ...scenario, status } : scenario
      )
    };
    onUpdate(updatedCard);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
      uploadedBy: 'Usuário Atual'
    }));

    const updatedCard = {
      ...card,
      attachments: [...card.attachments, ...newAttachments]
    };
    
    onUpdate(updatedCard);
    e.target.value = '';
  };

  const removeAttachment = (attachmentId: string) => {
    const updatedCard = {
      ...card,
      attachments: card.attachments.filter(att => att.id !== attachmentId)
    };
    onUpdate(updatedCard);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadAttachment = (attachment: Attachment) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Funções para comentários
  const addComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: currentUser,
      createdAt: new Date(),
      isEdited: false
    };

    const newHistoryEntry: HistoryEntry = {
      id: Date.now().toString() + '_history',
      action: 'comentario',
      description: 'Comentário adicionado',
      author: currentUser,
      timestamp: new Date()
    };

    const updatedCard = {
      ...card,
      comments: [...card.comments, comment],
      history: [...card.history, newHistoryEntry]
    };
    
    onUpdate(updatedCard);
    setNewComment('');
  };

  const startEditingComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text);
  };

  const saveCommentEdit = () => {
    if (!editingCommentText.trim() || !editingCommentId) return;

    const newHistoryEntry: HistoryEntry = {
      id: Date.now().toString() + '_history',
      action: 'edicao_comentario',
      description: 'Comentário editado',
      author: currentUser,
      timestamp: new Date()
    };

    const updatedCard = {
      ...card,
      comments: card.comments.map(comment =>
        comment.id === editingCommentId 
          ? { ...comment, text: editingCommentText.trim(), updatedAt: new Date(), isEdited: true }
          : comment
      ),
      history: [...card.history, newHistoryEntry]
    };
    
    onUpdate(updatedCard);
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const cancelCommentEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const deleteComment = (commentId: string) => {
    if (confirm('Tem certeza que deseja excluir este comentário?')) {
      const newHistoryEntry: HistoryEntry = {
        id: Date.now().toString() + '_history',
        action: 'exclusao_comentario',
        description: 'Comentário excluído',
        author: currentUser,
        timestamp: new Date()
      };

      const updatedCard = {
        ...card,
        comments: card.comments.filter(comment => comment.id !== commentId),
        history: [...card.history, newHistoryEntry]
      };
      
      onUpdate(updatedCard);
    }
  };

  const canEditComment = (comment: Comment) => {
    return comment.author === currentUser;
  };

  const getActionDescription = (entry: HistoryEntry) => {
    switch (entry.action) {
      case 'criacao':
        return '🎯 Card criado';
      case 'mudanca_status':
        return `📋 Status alterado${entry.oldValue ? ` de "${entry.oldValue}"` : ''} para "${entry.newValue}"`;
      case 'atualizacao':
        return `✏️ ${entry.description}`;
      case 'comentario':
        return '💬 Comentário adicionado';
      case 'edicao_comentario':
        return '✏️ Comentário editado';
      case 'exclusao_comentario':
        return '🗑️ Comentário excluído';
      default:
        return entry.description;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto p-[10px]">
        <SheetHeader className="px-2">
          <div className="flex items-center gap-2">
            {issueTypeIcons[currentCard.issueType]}
            <span className="text-sm font-medium text-slate-500">#{currentCard.cardNumber}</span>
            {isEditing ? (
              <Input
                value={editedCard?.title || ''}
                onChange={(e) => setEditedCard(prev => prev ? { ...prev, title: e.target.value } : null)}
                className="flex-1"
              />
            ) : (
              <SheetTitle className="flex-1">{currentCard.title}</SheetTitle>
            )}
            <Badge variant="outline" className={priorityColors[currentCard.priority]}>
              {currentCard.priority.toUpperCase()}
            </Badge>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={saveChanges}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    title="Salvar alterações"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={cancelEditing}
                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                    title="Cancelar edição"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={startEditing}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    title="Editar card"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDelete} 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Excluir card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <div>
            {isEditing ? (
              <Textarea
                value={editedCard?.description || ''}
                onChange={(e) => setEditedCard(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="Descrição do card..."
                rows={2}
              />
            ) : (
              <SheetDescription>
                {currentCard.description || 'Sem descrição'}
              </SheetDescription>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-2">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-2">ID Card (Quadro Cliente)</div>
              {isEditing ? (
                <Input
                  value={editedCard?.clientCardId || ''}
                  onChange={(e) => setEditedCard(prev => prev ? { ...prev, clientCardId: e.target.value } : null)}
                  placeholder="ID do cliente (opcional)"
                />
              ) : currentCard.clientCardId ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {currentCard.clientCardId}
                  </Badge>
                  <span className="text-xs text-muted-foreground">ID externo opcional</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground italic">Não informado (opcional)</span>
                </div>
              )}
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Tipo de Issue</div>
              {isEditing ? (
                <Select 
                  value={editedCard?.issueType || ''} 
                  onValueChange={(value: IssueType) => setEditedCard(prev => prev ? { ...prev, issueType: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  {issueTypeIcons[currentCard.issueType]}
                  <span className="text-sm capitalize">{currentCard.issueType}</span>
                </div>
              )}
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Prioridade</div>
              {isEditing ? (
                <Select 
                  value={editedCard?.priority || ''} 
                  onValueChange={(value: Priority) => setEditedCard(prev => prev ? { ...prev, priority: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className={priorityColors[currentCard.priority]}>
                  {currentCard.priority.toUpperCase()}
                </Badge>
              )}
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Responsável</div>
              {isEditing ? (
                <Input
                  value={editedCard?.assignee || ''}
                  onChange={(e) => setEditedCard(prev => prev ? { ...prev, assignee: e.target.value } : null)}
                  placeholder="Nome do responsável"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                    {getInitials(currentCard.assignee)}
                  </div>
                  <span className="text-sm">{currentCard.assignee}</span>
                </div>
              )}
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Solicitante</div>
              {isEditing ? (
                <Input
                  value={editedCard?.reporter || ''}
                  onChange={(e) => setEditedCard(prev => prev ? { ...prev, reporter: e.target.value } : null)}
                  placeholder="Nome do solicitante"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{currentCard.reporter}</span>
                </div>
              )}
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Story Points</div>
              {isEditing ? (
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={editedCard?.storyPoints || ''}
                  onChange={(e) => setEditedCard(prev => prev ? { ...prev, storyPoints: e.target.value ? Number(e.target.value) : undefined } : null)}
                  placeholder="1, 2, 3, 5, 8..."
                />
              ) : currentCard.storyPoints ? (
                <div className="w-8 h-8 rounded bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-medium">
                  {currentCard.storyPoints}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">Não definido</span>
              )}
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Criado em</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {formatDate(currentCard.createdAt)}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-2">Data de Planejado - Entrega</div>
              {isEditing ? (
                <Input
                  type="date"
                  value={editedCard?.plannedDueDate ? editedCard.plannedDueDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditedCard(prev => prev ? { 
                    ...prev, 
                    plannedDueDate: e.target.value ? new Date(e.target.value) : undefined 
                  } : null)}
                />
              ) : currentCard.plannedDueDate ? (
                <div className={`flex items-center gap-2 text-sm ${
                  isOverdue(currentCard.plannedDueDate) ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  <Calendar className="w-4 h-4" />
                  {formatDate(currentCard.plannedDueDate)}
                  {isOverdue(currentCard.plannedDueDate) && <span className="text-red-600">(Atrasado)</span>}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">Não definida</span>
              )}
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Data de Conclusão</div>
              {currentCard.actualDueDate ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatDate(currentCard.actualDueDate)}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="italic">Será preenchida quando finalizado</span>
                </div>
              )}
            </div>
          </div>

          {/* Sprint Info */}
          <div>
            <div className="text-sm font-medium mb-2">Sprint</div>
            {isEditing ? (
              <Input
                value={editedCard?.sprint || ''}
                onChange={(e) => setEditedCard(prev => prev ? { ...prev, sprint: e.target.value } : null)}
                placeholder="Nome da sprint (opcional)"
              />
            ) : currentCard.sprint ? (
              <Badge variant="outline" className="text-xs">
                {currentCard.sprint}
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground italic">Nenhuma sprint</span>
            )}
          </div>

          {/* Labels */}
          <div>
            <div className="text-sm font-medium mb-2">Labels</div>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {(editedCard?.labels || []).map((label, index) => (
                    <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-xs">
                      <span>{label}</span>
                      <button
                        onClick={() => setEditedCard(prev => prev ? {
                          ...prev,
                          labels: prev.labels.filter((_, i) => i !== index)
                        } : null)}
                        className="hover:bg-red-100 hover:text-red-700 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nova label..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const newLabel = input.value.trim();
                        if (newLabel && editedCard && !editedCard.labels.includes(newLabel)) {
                          setEditedCard(prev => prev ? {
                            ...prev,
                            labels: [...prev.labels, newLabel]
                          } : null);
                          input.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            ) : currentCard.labels.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {currentCard.labels.map((label, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">Nenhuma label</span>
            )}
          </div>

          {/* Attachments */}
          <div>
            <div className="text-sm font-medium mb-2 flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              Anexos ({card.attachments.length})
            </div>
            
            {card.attachments.length > 0 && (
              <div className="space-y-2 mb-3">
                {card.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <div className="flex items-center gap-2 flex-1">
                      <File className="w-4 h-4 text-gray-500" />
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-medium">{attachment.name}</span>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(attachment.size)} • {attachment.uploadedBy} • {formatDate(attachment.uploadedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => downloadAttachment(attachment)}
                        className="h-6 w-6 p-0"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeAttachment(attachment.id)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
              <label className="flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Upload className="w-4 h-4" />
                  <span>Adicionar anexos</span>
                </div>
              </label>
            </div>
          </div>

          {/* Development Links */}
          <div>
            <div className="text-sm font-medium mb-2">Desenvolvimento</div>
            <div className="space-y-2">
              {card.developmentLinks.branch && (
                <div className="flex items-center gap-2 text-sm">
                  <GitBranch className="w-4 h-4 text-muted-foreground" />
                  <span>Branch: </span>
                  <code className="bg-muted px-1 rounded text-xs">{card.developmentLinks.branch}</code>
                </div>
              )}
              {card.developmentLinks.pullRequest && (
                <div className="flex items-center gap-2 text-sm">
                  <GitPullRequest className="w-4 h-4 text-muted-foreground" />
                  <span>PR: </span>
                  <code className="bg-muted px-1 rounded text-xs">{card.developmentLinks.pullRequest}</code>
                </div>
              )}
              {card.developmentLinks.commits.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <GitCommit className="w-4 h-4 text-muted-foreground" />
                    <span>Commits:</span>
                  </div>
                  {card.developmentLinks.commits.map((commit, index) => (
                    <code key={index} className="block bg-muted px-2 py-1 rounded text-xs ml-6">
                      {commit}
                    </code>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Tabs for detailed sections (apenas 3 abas) */}
          <Tabs defaultValue="acceptance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="acceptance">
                Critérios ({getCompletionPercentage(card.acceptanceCriteria)}%)
              </TabsTrigger>
              <TabsTrigger value="dor">
                DoR ({getCompletionPercentage(card.definitionOfReady)}%)
              </TabsTrigger>
              <TabsTrigger value="dod">
                DoD ({getCompletionPercentage(card.definitionOfDone)}%)
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="acceptance" className="space-y-4">
              <div className="text-sm font-medium">Critérios de Aceitação</div>
              <div className="space-y-2">
                {card.acceptanceCriteria.map((item) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleChecklistItem('acceptanceCriteria', item.id)}
                      className="mt-1"
                    />
                    <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar critério..."
                  value={newCriteriaText}
                  onChange={(e) => setNewCriteriaText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCriteriaItem('acceptanceCriteria')}
                />
                <Button 
                  onClick={() => addCriteriaItem('acceptanceCriteria')}
                  size="sm"
                  disabled={!newCriteriaText.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="dor" className="space-y-4">
              <div className="text-sm font-medium">Definition of Ready (DoR)</div>
              <div className="space-y-2">
                {card.definitionOfReady.map((item) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleChecklistItem('definitionOfReady', item.id)}
                      className="mt-1"
                    />
                    <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar item DoR..."
                  value={newCriteriaText}
                  onChange={(e) => setNewCriteriaText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCriteriaItem('definitionOfReady')}
                />
                <Button 
                  onClick={() => addCriteriaItem('definitionOfReady')}
                  size="sm"
                  disabled={!newCriteriaText.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="dod" className="space-y-4">
              <div className="text-sm font-medium">Definition of Done (DoD)</div>
              <div className="space-y-2">
                {card.definitionOfDone.map((item) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleChecklistItem('definitionOfDone', item.id)}
                      className="mt-1"
                    />
                    <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar item DoD..."
                  value={newCriteriaText}
                  onChange={(e) => setNewCriteriaText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCriteriaItem('definitionOfDone')}
                />
                <Button 
                  onClick={() => addCriteriaItem('definitionOfDone')}
                  size="sm"
                  disabled={!newCriteriaText.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>


          </Tabs>

          <Separator />

          {/* Seção de Testes (independente) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-green-600" />
              <h3 className="text-base font-semibold">Cenários de Teste ({card.testScenarios.length})</h3>
            </div>
            
            {/* Lista de Cenários de Teste */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {card.testScenarios.map((scenario) => (
                <div key={scenario.id} className="border rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{scenario.title}</div>
                    <div className="flex gap-1">
                      <Button
                        variant={scenario.status === 'pending' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateTestScenarioStatus(scenario.id, 'pending')}
                        className="h-6 px-2 text-xs"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Pendente
                      </Button>
                      <Button
                        variant={scenario.status === 'passed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateTestScenarioStatus(scenario.id, 'passed')}
                        className="h-6 px-2 text-xs"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Passou
                      </Button>
                      <Button
                        variant={scenario.status === 'failed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateTestScenarioStatus(scenario.id, 'failed')}
                        className="h-6 px-2 text-xs"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Falhou
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{scenario.description}</div>
                  <div className="text-sm">
                    <span className="font-medium">Resultado esperado: </span>
                    {scenario.expectedResult}
                  </div>
                  <Badge variant="outline" className={testStatusColors[scenario.status]}>
                    {scenario.status === 'pending' && 'Pendente'}
                    {scenario.status === 'passed' && 'Passou'}
                    {scenario.status === 'failed' && 'Falhou'}
                  </Badge>
                </div>
              ))}
              {card.testScenarios.length === 0 && (
                <div className="text-sm text-muted-foreground italic text-center py-4">
                  Nenhum cenário de teste cadastrado.
                </div>
              )}
            </div>

            {/* Formulário para Adicionar Cenário de Teste */}
            <div className="border rounded p-3 space-y-3">
              <div className="text-sm font-medium">Adicionar Cenário de Teste</div>
              <Input
                placeholder="Título do cenário..."
                value={newTestScenario.title}
                onChange={(e) => setNewTestScenario(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Descrição do cenário..."
                value={newTestScenario.description}
                onChange={(e) => setNewTestScenario(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
              <Textarea
                placeholder="Resultado esperado..."
                value={newTestScenario.expectedResult}
                onChange={(e) => setNewTestScenario(prev => ({ ...prev, expectedResult: e.target.value }))}
                rows={2}
              />
              <Button 
                onClick={addTestScenario}
                className="w-full"
                disabled={!newTestScenario.title.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Cenário
              </Button>
            </div>
          </div>

          <Separator />

          {/* Seção de Comentários (fora das tabs) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-semibold">Comentários ({card.comments.length})</h3>
            </div>
            
            {/* Lista de Comentários */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {card.comments.map((comment) => (
                <div key={comment.id} className="border rounded p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                        {getInitials(comment.author)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{comment.author}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDateTime(comment.createdAt)}
                          {comment.isEdited && comment.updatedAt && (
                            <span> • Editado em {formatDateTime(comment.updatedAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {canEditComment(comment) && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingComment(comment)}
                          className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteComment(comment.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {editingCommentId === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveCommentEdit}>
                          <Save className="w-3 h-3 mr-1" />
                          Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelCommentEdit}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm whitespace-pre-wrap">{comment.text}</div>
                  )}
                </div>
              ))}
              {card.comments.length === 0 && (
                <div className="text-sm text-muted-foreground italic text-center py-4">
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </div>
              )}
            </div>

            {/* Formulário para Novo Comentário */}
            <div className="border rounded p-3 space-y-3">
              <div className="text-sm font-medium">Adicionar Comentário</div>
              <Textarea
                placeholder="Escreva seu comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={addComment}
                disabled={!newComment.trim()}
                className="w-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Adicionar Comentário
              </Button>
            </div>
          </div>

          <Separator />

          {/* Seção de Histórico (fora das tabs) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-semibold">Histórico do Card</h3>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {card.history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((entry) => (
                <div key={entry.id} className="border-l-2 border-muted pl-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="text-sm">{getActionDescription(entry)}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {entry.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(entry.timestamp)}
                        </div>
                      </div>
                      {entry.field && (entry.oldValue || entry.newValue) && (
                        <div className="text-xs text-muted-foreground">
                          Campo: {entry.field}
                          {entry.oldValue && entry.newValue && (
                            <span> • "{entry.oldValue}" → "{entry.newValue}"</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {card.history.length === 0 && (
                <div className="text-sm text-muted-foreground italic text-center py-4">
                  Nenhuma atividade registrada.
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}