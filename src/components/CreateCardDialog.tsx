import { useState } from 'react';
import { KanbanCard, Priority, IssueType, Status, ChecklistItem, TestScenario, SprintOption, Attachment, Comment, HistoryEntry } from '../types/kanban';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { X, Paperclip, Upload, File, Trash2, Plus, CheckSquare, TestTube, CheckCircle2 } from 'lucide-react';

interface CreateCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Omit<KanbanCard, 'id' | 'cardNumber' | 'createdAt'>) => void;
  initialStatus: Status;
  editCard?: KanbanCard;
}

// Mock sprints data - seria obtido de contexto/props em uma aplicação real
const availableSprints: SprintOption[] = [
  { id: 'backlog', name: 'Backlog', isActive: false },
  { id: 'sprint-1', name: 'Sprint 1 - Jan 2024', isActive: true },
  { id: 'sprint-2', name: 'Sprint 2 - Fev 2024', isActive: false },
  { id: 'sprint-3', name: 'Sprint 3 - Mar 2024', isActive: false },
];

export function CreateCardDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  initialStatus,
  editCard 
}: CreateCardDialogProps) {
  const [formData, setFormData] = useState({
    clientCardId: editCard?.clientCardId || '',
    title: editCard?.title || '',
    description: editCard?.description || '',
    storyPoints: editCard?.storyPoints || '',
    priority: editCard?.priority || 'medium' as Priority,
    assignee: editCard?.assignee || '',
    reporter: editCard?.reporter || '',
    issueType: editCard?.issueType || 'story' as IssueType,
    sprint: editCard?.sprint || 'Backlog',
    status: editCard?.status || initialStatus,
    plannedDueDate: editCard?.plannedDueDate ? editCard.plannedDueDate.toISOString().split('T')[0] : '',
    actualDueDate: editCard?.actualDueDate ? editCard.actualDueDate.toISOString().split('T')[0] : '',
    labels: editCard?.labels || [] as string[],
    newLabel: '',
    attachments: editCard?.attachments || [] as Attachment[],
    acceptanceCriteria: editCard?.acceptanceCriteria || [] as ChecklistItem[],
    definitionOfReady: editCard?.definitionOfReady || [] as ChecklistItem[],
    definitionOfDone: editCard?.definitionOfDone || [] as ChecklistItem[],
    testScenarios: editCard?.testScenarios || [] as TestScenario[]
  });

  // Estados para os novos campos de checklist
  const [newCriteriaText, setNewCriteriaText] = useState('');
  const [newTestScenario, setNewTestScenario] = useState({
    title: '',
    description: '',
    expectedResult: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação adicional para campos obrigatórios
    if (!formData.title.trim()) {
      alert('O campo Título é obrigatório.');
      return;
    }
    
    if (!formData.assignee.trim()) {
      alert('O campo Responsável é obrigatório.');
      return;
    }
    
    if (!formData.reporter.trim()) {
      alert('O campo Solicitante é obrigatório.');
      return;
    }
    
    if (!formData.sprint || formData.sprint.trim() === '') {
      alert('O campo Sprint é obrigatório.');
      return;
    }
    
    const cardData: Omit<KanbanCard, 'id' | 'cardNumber' | 'createdAt'> = {
      clientCardId: formData.clientCardId || undefined,
      title: formData.title,
      description: formData.description,
      storyPoints: formData.storyPoints ? Number(formData.storyPoints) : undefined,
      priority: formData.priority,
      assignee: formData.assignee,
      reporter: formData.reporter,
      issueType: formData.issueType,
      sprint: formData.sprint,
      status: formData.status,
      labels: formData.labels,
      plannedDueDate: formData.plannedDueDate ? new Date(formData.plannedDueDate) : undefined,
      actualDueDate: formData.actualDueDate ? new Date(formData.actualDueDate) : undefined,
      attachments: formData.attachments,
      acceptanceCriteria: formData.acceptanceCriteria,
      definitionOfReady: formData.definitionOfReady,
      definitionOfDone: formData.definitionOfDone,
      testScenarios: formData.testScenarios,
      developmentLinks: editCard?.developmentLinks || { commits: [] },
      comments: editCard?.comments || [],
      history: editCard?.history || []
    };
    
    onSave(cardData);
    onClose();
    
    // Reset form if not editing
    if (!editCard) {
      setFormData({
        clientCardId: '',
        title: '',
        description: '',
        storyPoints: '',
        priority: 'medium',
        assignee: '',
        reporter: '',
        issueType: 'story',
        sprint: 'Backlog',
        status: initialStatus,
        plannedDueDate: '',
        actualDueDate: '',
        labels: [],
        newLabel: '',
        attachments: [],
        acceptanceCriteria: [],
        definitionOfReady: [],
        definitionOfDone: [],
        testScenarios: []
      });
      setNewCriteriaText('');
      setNewTestScenario({ title: '', description: '', expectedResult: '' });
    }
  };

  const addLabel = () => {
    if (formData.newLabel.trim() && !formData.labels.includes(formData.newLabel.trim())) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, prev.newLabel.trim()],
        newLabel: ''
      }));
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      addLabel();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Simular upload - em um sistema real, você faria upload para servidor
      const mockAttachment: Attachment = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file), // URL temporária para preview
        uploadedAt: new Date(),
        uploadedBy: 'Usuário Atual' // seria obtido do contexto de autenticação
      };

      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, mockAttachment]
      }));
    });

    // Reset input
    e.target.value = '';
  };

  const removeAttachment = (attachmentId: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Funções para gerenciar checklists
  const addCriteriaItem = (checklistType: 'acceptanceCriteria' | 'definitionOfReady' | 'definitionOfDone') => {
    if (!newCriteriaText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newCriteriaText.trim(),
      completed: false
    };

    setFormData(prev => ({
      ...prev,
      [checklistType]: [...prev[checklistType], newItem]
    }));
    
    setNewCriteriaText('');
  };

  const removeCriteriaItem = (checklistType: 'acceptanceCriteria' | 'definitionOfReady' | 'definitionOfDone', itemId: string) => {
    setFormData(prev => ({
      ...prev,
      [checklistType]: prev[checklistType].filter(item => item.id !== itemId)
    }));
  };

  const toggleChecklistItem = (checklistType: 'acceptanceCriteria' | 'definitionOfReady' | 'definitionOfDone', itemId: string) => {
    setFormData(prev => ({
      ...prev,
      [checklistType]: prev[checklistType].map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
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

    setFormData(prev => ({
      ...prev,
      testScenarios: [...prev.testScenarios, scenario]
    }));
    
    setNewTestScenario({ title: '', description: '', expectedResult: '' });
  };

  const removeTestScenario = (scenarioId: string) => {
    setFormData(prev => ({
      ...prev,
      testScenarios: prev.testScenarios.filter(scenario => scenario.id !== scenarioId)
    }));
  };

  const getCompletionPercentage = (checklist: ChecklistItem[]) => {
    if (checklist.length === 0) return 0;
    const completed = checklist.filter(item => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  const renderChecklistSection = (
    title: string, 
    checklistType: 'acceptanceCriteria' | 'definitionOfReady' | 'definitionOfDone',
    description: string
  ) => {
    const checklist = formData[checklistType];
    const completionPercentage = getCompletionPercentage(checklist);

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {checklist.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {completionPercentage}% completo ({checklist.filter(item => item.completed).length}/{checklist.length})
            </div>
          )}
        </div>

        <div className="space-y-2">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-center gap-2 p-2 border rounded">
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => toggleChecklistItem(checklistType, item.id)}
              />
              <span className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                {item.text}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCriteriaItem(checklistType, item.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newCriteriaText}
            onChange={(e) => setNewCriteriaText(e.target.value)}
            placeholder={`Adicionar novo item de ${title.toLowerCase()}...`}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCriteriaItem(checklistType);
              }
            }}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => addCriteriaItem(checklistType)}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2 sm:mr-0" />
            <span className="sm:hidden">Adicionar</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[90vw] max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>
            {editCard ? `Editar Card #${editCard.cardNumber}` : 'Criar Novo Card'}
          </DialogTitle>
          <DialogDescription>
            {editCard 
              ? 'Faça as alterações necessárias nos campos abaixo e clique em \"Salvar Alterações\".'
              : 'Preencha os campos abaixo para criar um novo card no seu quadro Kanban. O card receberá automaticamente um número único de identificação.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="general" className="flex-1">
                Informações Gerais
              </TabsTrigger>
              <TabsTrigger value="checklists" className="flex-1">
                <CheckSquare className="w-4 h-4 mr-2" />
                Critérios & Definições
              </TabsTrigger>
              <TabsTrigger value="tests" className="flex-1">
                <TestTube className="w-4 h-4 mr-2" />
                Cenários de Teste
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editCard && (
                  <div>
                    <Label>Número do Card</Label>
                    <div className="flex items-center h-10 px-3 py-2 bg-muted rounded-md border border-input text-sm">
                      #{editCard.cardNumber}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Número único gerado automaticamente
                    </p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="sprint">Sprint *</Label>
                  <Select 
                    value={formData.sprint} 
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, sprint: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma sprint" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSprints.map((sprint) => (
                        <SelectItem key={sprint.id} value={sprint.name}>
                          {sprint.name} {sprint.isActive && '(Ativa)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className={editCard ? "" : "col-span-1"}>
                  <Label htmlFor="clientCardId">ID Card (Quadro Cliente)</Label>
                  <Input
                    id="clientCardId"
                    value={formData.clientCardId}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientCardId: e.target.value }))}
                    placeholder="ID do cliente (opcional)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Campo opcional para identificação externa
                  </p>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Digite o título do card"
                    required
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o card..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="issueType">Tipo de Issue *</Label>
                  <Select 
                    value={formData.issueType} 
                    onValueChange={(value: IssueType) => setFormData(prev => ({ ...prev, issueType: value }))}
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
                </div>
                
                <div>
                  <Label htmlFor="priority">Prioridade *</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: Priority) => setFormData(prev => ({ ...prev, priority: value }))}
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
                </div>
                
                <div>
                  <Label htmlFor="assignee">Responsável *</Label>
                  <Input
                    id="assignee"
                    value={formData.assignee}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                    placeholder="Nome do responsável"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="reporter">Solicitante *</Label>
                  <Input
                    id="reporter"
                    value={formData.reporter}
                    onChange={(e) => setFormData(prev => ({ ...prev, reporter: e.target.value }))}
                    placeholder="Nome do solicitante"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="storyPoints">Story Points</Label>
                  <Input
                    id="storyPoints"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.storyPoints}
                    onChange={(e) => setFormData(prev => ({ ...prev, storyPoints: e.target.value }))}
                    placeholder="1, 2, 3, 5, 8..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="plannedDueDate">Data de Planejado - Entrega</Label>
                  <Input
                    id="plannedDueDate"
                    type="date"
                    value={formData.plannedDueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, plannedDueDate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="actualDueDate">Data de Conclusão</Label>
                  <Input
                    id="actualDueDate"
                    type="date"
                    value={formData.actualDueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, actualDueDate: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    * Será preenchida automaticamente quando o card for movido para "Finalizado"
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: Status) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="planejado">Planejado</SelectItem>
                      <SelectItem value="em-execucao">Em execução</SelectItem>
                      <SelectItem value="em-espera">Em espera</SelectItem>
                      <SelectItem value="em-teste">Em teste</SelectItem>
                      <SelectItem value="aguardando-validacao-tecnica">Aguardando validação técnica</SelectItem>
                      <SelectItem value="aguardando-aceitacao">Aguardando aceitação</SelectItem>
                      <SelectItem value="aceito-aguardando-integracao">Aceito / Aguardando integração</SelectItem>
                      <SelectItem value="aguardando-homologacao">Aguardando homologação</SelectItem>
                      <SelectItem value="homologado-aguardando-publicacao">(Homologado) Aguardando publicação</SelectItem>
                      <SelectItem value="finalizado">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <Label htmlFor="labels">Labels</Label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <Input
                      value={formData.newLabel}
                      onChange={(e) => setFormData(prev => ({ ...prev, newLabel: e.target.value }))}
                      placeholder="Digite uma label e pressione Enter"
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addLabel} variant="outline" className="w-full sm:w-auto">
                      Adicionar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.labels.map((label, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {label}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-destructive" 
                          onClick={() => removeLabel(label)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Anexos Section */}
                <div className="col-span-1 md:col-span-2">
                  <Label>Anexar Arquivos</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-center">
                      <label className="flex flex-col items-center cursor-pointer">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                          <Upload className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-700">Selecionar arquivos</span>
                        </div>
                      </label>
                    </div>
                    
                    {formData.attachments.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Arquivos anexados:</div>
                        {formData.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4 text-gray-500" />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{attachment.name}</span>
                                <span className="text-xs text-gray-500">{formatFileSize(attachment.size)}</span>
                              </div>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeAttachment(attachment.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="checklists" className="space-y-6 mt-4">
              {renderChecklistSection(
                'Critérios de Aceitação',
                'acceptanceCriteria',
                'Condições que devem ser atendidas para que o card seja considerado aceito.'
              )}

              {renderChecklistSection(
                'Definition of Ready (DoR)',
                'definitionOfReady',
                'Critérios que definem quando um item está pronto para ser trabalhado.'
              )}

              {renderChecklistSection(
                'Definition of Done (DoD)',
                'definitionOfDone',
                'Critérios que definem quando um item de trabalho está completamente finalizado.'
              )}
            </TabsContent>

            <TabsContent value="tests" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cenários de Teste</h4>
                    <p className="text-sm text-muted-foreground">
                      Definir cenários de teste para validar o funcionamento do card.
                    </p>
                  </div>
                  {formData.testScenarios.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {formData.testScenarios.length} cenário{formData.testScenarios.length !== 1 ? 's' : ''} definido{formData.testScenarios.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {formData.testScenarios.map((scenario) => (
                    <div key={scenario.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{scenario.title}</h5>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTestScenario(scenario.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {scenario.description && (
                        <p className="text-sm text-muted-foreground">{scenario.description}</p>
                      )}
                      {scenario.expectedResult && (
                        <div className="text-sm">
                          <span className="font-medium">Resultado esperado:</span> {scenario.expectedResult}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-medium">Adicionar Novo Cenário de Teste</h5>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="testTitle">Título do Cenário *</Label>
                      <Input
                        id="testTitle"
                        value={newTestScenario.title}
                        onChange={(e) => setNewTestScenario(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Teste de login com credenciais válidas"
                      />
                    </div>
                    <div>
                      <Label htmlFor="testDescription">Descrição</Label>
                      <Textarea
                        id="testDescription"
                        value={newTestScenario.description}
                        onChange={(e) => setNewTestScenario(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva os passos do teste..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="testExpectedResult">Resultado Esperado</Label>
                      <Textarea
                        id="testExpectedResult"
                        value={newTestScenario.expectedResult}
                        onChange={(e) => setNewTestScenario(prev => ({ ...prev, expectedResult: e.target.value }))}
                        placeholder="Descreva o que deve acontecer quando o teste for executado..."
                        rows={2}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addTestScenario}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Cenário de Teste
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editCard ? 'Salvar Alterações' : 'Criar Card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}