import { useState, useEffect } from 'react';
import { Plus, Calendar, Target, MoreHorizontal, Edit, Trash2, Play, Square, CheckCircle, GripVertical, AlertTriangle, Ban, Users, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Sprint, KanbanCard, Priority, IssueType, SprintFilterOptions } from '../types/kanban';
import { mockCards } from '../constants/kanban';
import { SprintFilters } from './SprintFilters';
import { SprintCardItem } from './SprintCardItem';
import { AddIssuesToSprintDialog } from './AddIssuesToSprintDialog';

const initialSprints: Sprint[] = [
  {
    id: '1',
    name: 'Sprint 1 - Funcionalidades Básicas',
    goal: 'Implementar as funcionalidades principais do sistema de autenticação e navegação',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-29'),
    status: 'completed',
    cards: [],
    teamMembers: ['João Silva', 'Maria Santos', 'Pedro Costa'],
    storyPointsPerDeveloper: 8,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-29')
  },
  {
    id: '2',
    name: 'Sprint 2 - Dashboard e Relatórios',
    goal: 'Desenvolver dashboard principal e sistema de relatórios básicos',
    startDate: new Date('2024-01-30'),
    endDate: new Date('2024-02-13'),
    status: 'active',
    cards: [],
    teamMembers: ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira'],
    storyPointsPerDeveloper: 8,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '3',
    name: 'Sprint 3 - Integração de APIs',
    goal: 'Integrar APIs externas e melhorar performance do sistema',
    startDate: new Date('2024-02-14'),
    endDate: new Date('2024-02-28'),
    status: 'planning',
    cards: [],
    teamMembers: ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira', 'Carlos Lima'],
    storyPointsPerDeveloper: 8,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: '4',
    name: 'Sprint 4 - Refatoração (Cancelada)',
    goal: 'Refatorar código legado e melhorar arquitetura do sistema',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-15'),
    status: 'cancelled',
    cards: [],
    teamMembers: ['João Silva', 'Maria Santos'],
    storyPointsPerDeveloper: 8,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-25')
  }
];

export function SprintView() {
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [allCards, setAllCards] = useState<KanbanCard[]>(mockCards);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [collapsedSprints, setCollapsedSprints] = useState<Set<string>>(new Set());
  const [selectedSprintForIssues, setSelectedSprintForIssues] = useState<Sprint | null>(null);

  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [filters, setFilters] = useState<SprintFilterOptions>({
    status: [],
    searchText: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    status: 'planning' as Sprint['status'],
    teamMembers: [] as string[],
    weeks: 2,
    storyPointsPerDeveloper: 8
  });

  useEffect(() => {
    // Assign cards to sprints for demonstration - simulating a real scenario
    const updatedCards = allCards.map(card => {
      // Sprint 1 (Concluída) - Cards relacionados a funcionalidades básicas
      if (card.id === '3' || card.id === '4') {
        return { ...card, sprint: '1' };
      }
      // Sprint 2 (Ativa) - Cards relacionados a dashboard e relatórios
      if (card.id === '1' || card.id === '2') {
        return { ...card, sprint: '2' };
      }
      // Sprint 3 (Planejamento) - Cards relacionados a APIs e integração
      if (card.id === '5' || card.id === '6') {
        return { ...card, sprint: '3' };
      }
      // Demais cards ficam no backlog
      return card;
    });
    setAllCards(updatedCards);

    // Update sprints with their cards
    const updatedSprints = sprints.map(sprint => ({
      ...sprint,
      cards: updatedCards.filter(card => card.sprint === sprint.id)
    }));
    setSprints(updatedSprints);

    // Set initial collapsed state: collapse completed and cancelled sprints
    const initialCollapsedSprints = new Set<string>();
    sprints.forEach(sprint => {
      if (sprint.status === 'completed' || sprint.status === 'cancelled') {
        initialCollapsedSprints.add(sprint.id);
      }
    });
    setCollapsedSprints(initialCollapsedSprints);
  }, []);

  // Filter sprints based on search and status filters
  const filteredSprints = sprints.filter(sprint => {
    // Search filter
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const matchesSearch = 
        sprint.name.toLowerCase().includes(searchLower) ||
        sprint.goal.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status.length > 0) {
      if (!filters.status.includes(sprint.status)) return false;
    }

    return true;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      goal: '',
      startDate: '',
      endDate: '',
      status: 'planning',
      teamMembers: [],
      weeks: 2,
      storyPointsPerDeveloper: 8
    });
  };

  // Function to calculate story points based on weeks
  const calculateStoryPointsByWeeks = (weeks: number) => {
    switch (weeks) {
      case 2:
        return 8;
      case 3:
        return 12;
      case 4:
        return 16;
      default:
        return 8;
    }
  };

  // Handle weeks change and update story points automatically
  const handleWeeksChange = (weeks: number) => {
    const storyPoints = calculateStoryPointsByWeeks(weeks);
    setFormData(prev => ({ 
      ...prev, 
      weeks, 
      storyPointsPerDeveloper: storyPoints 
    }));
  };

  const handleCreateSprint = () => {
    if (!formData.name.trim()) return;

    const newSprint: Sprint = {
      id: Date.now().toString(),
      name: formData.name,
      goal: formData.goal,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      status: formData.status,
      cards: [],
      teamMembers: formData.teamMembers,
      storyPointsPerDeveloper: formData.storyPointsPerDeveloper,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSprints(prev => [...prev, newSprint]);
    resetForm();
    setIsCreateDialogOpen(false);
    toast.success(`Sprint "${newSprint.name}" criada com sucesso!`);
  };

  const handleEditSprint = () => {
    if (!editingSprint || !formData.name.trim()) return;

    const updatedSprint: Sprint = {
      ...editingSprint,
      name: formData.name,
      goal: formData.goal,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      status: formData.status,
      teamMembers: formData.teamMembers,
      storyPointsPerDeveloper: formData.storyPointsPerDeveloper,
      updatedAt: new Date()
    };

    setSprints(prev => prev.map(sprint => 
      sprint.id === editingSprint.id ? updatedSprint : sprint
    ));
    
    setEditingSprint(null);
    resetForm();
    toast.success(`Sprint "${updatedSprint.name}" atualizada com sucesso!`);
  };

  const handleDeleteSprint = (sprintId: string) => {
    if (confirm('Tem certeza que deseja excluir esta sprint? Os cards serão movidos para o Backlog.')) {
      // Move cards back to backlog
      const updatedCards = allCards.map(card => 
        card.sprint === sprintId ? { ...card, sprint: undefined } : card
      );
      setAllCards(updatedCards);
      
      // Remove sprint
      const deletedSprint = sprints.find(s => s.id === sprintId);
      setSprints(prev => prev.filter(sprint => sprint.id !== sprintId));
      toast.success(`Sprint "${deletedSprint?.name}" excluída com sucesso!`);
    }
  };

  const openEditDialog = (sprint: Sprint) => {
    setEditingSprint(sprint);
    
    // Calculate weeks from story points for existing sprints
    const weeks = sprint.storyPointsPerDeveloper === 12 ? 3 : 
                  sprint.storyPointsPerDeveloper === 16 ? 4 : 2;
    
    setFormData({
      name: sprint.name,
      goal: sprint.goal,
      startDate: sprint.startDate.toISOString().split('T')[0],
      endDate: sprint.endDate.toISOString().split('T')[0],
      status: sprint.status,
      teamMembers: sprint.teamMembers || [],
      weeks: weeks,
      storyPointsPerDeveloper: sprint.storyPointsPerDeveloper || 8
    });
  };

  // Rest of the component methods would continue...
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sprints</h1>
          <p className="text-gray-600 mt-1">Gerencie suas sprints e backlog</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nova Sprint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Sprint</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Sprint</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Sprint 1 - Login e Cadastro"
                />
              </div>
              
              <div>
                <Label htmlFor="goal">Objetivo da Sprint</Label>
                <Textarea
                  id="goal"
                  value={formData.goal}
                  onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                  placeholder="Descreva o objetivo principal desta sprint"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: Sprint['status']) => 
                  setFormData(prev => ({ ...prev, status: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planejamento</SelectItem>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="teamMembers">Membros da Equipe</Label>
                <Textarea
                  id="teamMembers"
                  value={formData.teamMembers.join(', ')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    teamMembers: e.target.value.split(',').map(name => name.trim()).filter(name => name.length > 0)
                  }))}
                  placeholder="Ex: João Silva, Maria Santos, Pedro Costa"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">Separe os nomes com vírgula</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weeks">Semanas</Label>
                  <Select 
                    value={formData.weeks.toString()} 
                    onValueChange={(value) => handleWeeksChange(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 semanas</SelectItem>
                      <SelectItem value="3">3 semanas</SelectItem>
                      <SelectItem value="4">4 semanas</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Duração da sprint</p>
                </div>

                <div>
                  <Label htmlFor="storyPointsPerDeveloper">Story Points por Desenvolvedor</Label>
                  <Input
                    id="storyPointsPerDeveloper"
                    type="number"
                    value={formData.storyPointsPerDeveloper}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Calculado automaticamente: {formData.weeks} sem = {formData.storyPointsPerDeveloper} pts</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateSprint} className="flex-1">
                  Criar Sprint
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsCreateDialogOpen(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <SprintFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        <div className="text-sm text-gray-500">
          {filteredSprints.length} de {sprints.length} sprints
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingSprint} onOpenChange={(open) => {
        if (!open) {
          setEditingSprint(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Sprint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome da Sprint</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Sprint 1 - Login e Cadastro"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-goal">Objetivo da Sprint</Label>
              <Textarea
                id="edit-goal"
                value={formData.goal}
                onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                placeholder="Descreva o objetivo principal desta sprint"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-startDate">Data de Início</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-endDate">Data de Fim</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Sprint['status']) => 
                setFormData(prev => ({ ...prev, status: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planejamento</SelectItem>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-teamMembers">Membros da Equipe</Label>
              <Textarea
                id="edit-teamMembers"
                value={formData.teamMembers.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  teamMembers: e.target.value.split(',').map(name => name.trim()).filter(name => name.length > 0)
                }))}
                placeholder="Ex: João Silva, Maria Santos, Pedro Costa"
                rows={2}
              />
              <p className="text-xs text-gray-500 mt-1">Separe os nomes com vírgula</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-weeks">Semanas</Label>
                <Select 
                  value={formData.weeks.toString()} 
                  onValueChange={(value) => handleWeeksChange(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 semanas</SelectItem>
                    <SelectItem value="3">3 semanas</SelectItem>
                    <SelectItem value="4">4 semanas</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Duração da sprint</p>
              </div>

              <div>
                <Label htmlFor="edit-storyPointsPerDeveloper">Story Points por Desenvolvedor</Label>
                <Input
                  id="edit-storyPointsPerDeveloper"
                  type="number"
                  value={formData.storyPointsPerDeveloper}
                  readOnly
                  className="bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Calculado automaticamente: {formData.weeks} sem = {formData.storyPointsPerDeveloper} pts</p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEditSprint} className="flex-1">
                Salvar Alterações
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingSprint(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rest of the component rendering would continue... */}
      <div className="space-y-4">
        {filteredSprints.map(sprint => (
          <Card key={sprint.id} className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{sprint.name}</h3>
                  <Badge className={
                    sprint.status === 'active' ? 'bg-green-100 text-green-800' :
                    sprint.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    sprint.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {sprint.status === 'active' ? 'Ativa' :
                     sprint.status === 'completed' ? 'Concluída' :
                     sprint.status === 'cancelled' ? 'Cancelada' :
                     'Planejamento'}
                  </Badge>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(sprint)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteSprint(sprint.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <p className="text-gray-600 text-sm">{sprint.goal}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>📅 {sprint.startDate.toLocaleDateString('pt-BR')} - {sprint.endDate.toLocaleDateString('pt-BR')}</span>
                <span>👥 {sprint.teamMembers.length} membros</span>
                <span>📊 {sprint.storyPointsPerDeveloper} pts/dev</span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Add Issues Dialog */}
      {selectedSprintForIssues && (
        <AddIssuesToSprintDialog
          sprint={selectedSprintForIssues}
          allCards={allCards.filter(card => !card.sprint)}
          onAddIssues={() => {}}
          onClose={() => setSelectedSprintForIssues(null)}
        />
      )}
    </div>
  );
}