import { useState, useEffect } from 'react';
import { Plus, Calendar, Target, MoreHorizontal, Edit, Trash2, Play, Square, CheckCircle, GripVertical, AlertTriangle, Ban, Users, TrendingUp, Award, BarChart3, X, UserMinus, ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
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
import { toast } from '../utils/toast';
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
    absentMembers: [],
    storyPointsPerDeveloper: 8,
    capacity: 24, // 3 members * 8 points
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
    absentMembers: [{ name: 'Pedro Costa', type: 'partial' }],
    storyPointsPerDeveloper: 8,
    capacity: 32, // 4 members * 8 points (partial absence doesn't reduce capacity)
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
    absentMembers: [{ name: 'Carlos Lima', type: 'total' }],
    storyPointsPerDeveloper: 8,
    capacity: 32, // 5 members * 8 points - 8 points (total absence of Carlos Lima)
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
    absentMembers: [],
    storyPointsPerDeveloper: 8,
    capacity: 16, // 2 members * 8 points
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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    status: 'planning' as Sprint['status'],
    teamMembers: [] as string[],
    absentMembers: [] as { name: string; type: 'partial' | 'total' }[],
    weeks: 2,
    holidays: 0,
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

  // Filter and sort sprints based on search, status filters, and sort order
  const filteredAndSortedSprints = sprints
    .filter(sprint => {
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
    })
    .sort((a, b) => {
      // Sort by name alphabetically
      const comparison = a.name.localeCompare(b.name, 'pt-BR');
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const resetForm = () => {
    setFormData({
      name: '',
      goal: '',
      startDate: '',
      endDate: '',
      status: 'planning',
      teamMembers: [],
      absentMembers: [],
      weeks: 2,
      holidays: 0,
      storyPointsPerDeveloper: 8
    });
  };

  // Function to calculate story points based on weeks, holidays, and absent members
  const calculateStoryPointsByWeeks = (weeks: number, holidays: number = 0, absentMembers: { name: string; type: 'partial' | 'total' }[] = []) => {
    let basePoints;
    switch (weeks) {
      case 2:
        basePoints = 8;
        break;
      case 3:
        basePoints = 12;
        break;
      case 4:
        basePoints = 16;
        break;
      default:
        basePoints = 8;
    }
    
    // Subtract 1 point per holiday (general capacity reduction)
    const adjustedPoints = Math.max(1, basePoints - holidays);
    return adjustedPoints;
  };

  // Function to calculate total sprint capacity considering team members and absences
  const calculateSprintCapacity = (teamMembers: string[], storyPointsPerDeveloper: number, absentMembers: { name: string; type: 'partial' | 'total' }[] = []) => {
    let totalCapacity = teamMembers.length * storyPointsPerDeveloper;
    
    // Reduce capacity for members with total absence (8 points per total absence)
    const totalAbsences = absentMembers.filter(member => member.type === 'total').length;
    totalCapacity -= totalAbsences * 8; // Remove 8 points per total absence
    
    return Math.max(0, totalCapacity);
  };

  const handleAddIssuesToSprint = (cardIds: string[], sprintId: string) => {
    // Update cards with new sprint assignment
    const updatedCards = allCards.map(card =>
      cardIds.includes(card.id) ? { ...card, sprint: sprintId } : card
    );
    
    setAllCards(updatedCards);

    // Update sprints with new card assignments
    const updatedSprints = sprints.map(sprint => ({
      ...sprint,
      cards: updatedCards.filter(card => card.sprint === sprint.id)
    }));
    
    setSprints(updatedSprints);

    const sprintName = sprints.find(s => s.id === sprintId)?.name;
    toast.success(`${cardIds.length} história(s) adicionada(s) à sprint "${sprintName}"!`);
  };

  const canStartSprint = (sprintId: string) => {
    const sprint = sprints.find(s => s.id === sprintId);
    if (!sprint || sprint.status !== 'planning') return false;
    
    // Check if there's already an active sprint
    const hasActiveSprint = sprints.some(s => s.status === 'active');
    return !hasActiveSprint;
  };

  const handleStartSprint = (sprintId: string) => {
    const sprint = sprints.find(s => s.id === sprintId);
    if (!sprint) return;

    // Check if there's an active sprint
    const hasActiveSprint = sprints.some(s => s.status === 'active');
    if (hasActiveSprint) {
      const activeSprint = sprints.find(s => s.status === 'active');
      toast.error(`Não é possível iniciar esta sprint. Conclua primeiro a sprint ativa: "${activeSprint?.name}".`);
      return;
    }

    // Check if sprint has cards
    if (sprint.cards.length === 0) {
      toast.error('Não é possível iniciar uma sprint sem cards. Adicione pelo menos um card antes de iniciar.');
      return;
    }

    const confirmMessage = `Deseja iniciar a "${sprint.name}"?\n\nEsta ação mudará o status da sprint para "Ativa" e não será possível iniciar outras sprints até que esta seja concluída.`;
    
    if (confirm(confirmMessage)) {
      const updatedSprints = sprints.map(s => 
        s.id === sprintId 
          ? { ...s, status: 'active' as const, updatedAt: new Date() }
          : s
      );
      setSprints(updatedSprints);
      toast.success(`Sprint "${sprint.name}" iniciada com sucesso!`);
    }
  };

  const handleCompleteSprint = (sprintId: string) => {
    const sprint = sprints.find(s => s.id === sprintId);
    if (!sprint) return;

    const confirmMessage = `Deseja finalizar a "${sprint.name}"?\n\nEsta ação mudará o status da sprint para "Concluída" e permitirá iniciar outras sprints.`;
    
    if (confirm(confirmMessage)) {
      const updatedSprints = sprints.map(s => 
        s.id === sprintId 
          ? { ...s, status: 'completed' as const, updatedAt: new Date() }
          : s
      );
      setSprints(updatedSprints);
      toast.success(`Sprint "${sprint.name}" finalizada com sucesso!`);
    }
  };

  const getSprintActions = (sprint: Sprint) => {
    const actions = [];
    
    // Add Issues button for active and planning sprints
    if (sprint.status === 'active' || sprint.status === 'planning') {
      actions.push(
        <Button
          key="add-issues"
          size="sm"
          variant="outline"
          onClick={() => setSelectedSprintForIssues(sprint)}
          className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Plus className="w-3 h-3" />
          Adicionar Issue
        </Button>
      );
    }
    
    // Iniciar Sprint button for planning sprints, only enabled when no active sprint exists
    if (sprint.status === 'planning') {
      const canStart = canStartSprint(sprint.id);
      const hasActiveSprint = sprints.some(s => s.status === 'active');
      
      actions.push(
        <Button
          key="start"
          size="sm"
          onClick={() => handleStartSprint(sprint.id)}
          disabled={!canStart}
          className={`flex items-center gap-1 ${
            canStart 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
          }`}
          title={
            !canStart 
              ? hasActiveSprint 
                ? "Conclua a sprint ativa primeiro"
                : "Adicione pelo menos um card à sprint"
              : "Iniciar esta sprint"
          }
        >
          <Play className="w-3 h-3" />
          Iniciar Sprint
        </Button>
      );
    }
    
    // Finalizar Sprint button for active sprints only
    if (sprint.status === 'active') {
      actions.push(
        <Button
          key="complete"
          size="sm"
          variant="outline"
          onClick={() => handleCompleteSprint(sprint.id)}
          className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
        >
          <CheckCircle className="w-3 h-3" />
          Finalizar Sprint
        </Button>
      );
    }
    
    return actions;
  };

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
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingSprint ? 'Editar Sprint' : 'Nova Sprint'}</DialogTitle>
              <DialogDescription>
                {editingSprint ? 'Edite as informações da sprint.' : 'Crie uma nova sprint para organizar suas tarefas.'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Sprint Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Sprint *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Sprint 1 - Funcionalidades Básicas"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Sprint Goal */}
              <div className="grid gap-2">
                <Label htmlFor="goal">Objetivo da Sprint *</Label>
                <Textarea
                  id="goal"
                  placeholder="Descreva o objetivo principal desta sprint..."
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Data de Início *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">Data de Fim *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Sprint Duration Helper */}
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="weeks">Duração (semanas)</Label>
                  <Select 
                    value={formData.weeks.toString()} 
                    onValueChange={(value) => {
                      const weeks = parseInt(value);
                      setFormData({ 
                        ...formData, 
                        weeks,
                        storyPointsPerDeveloper: calculateStoryPointsByWeeks(weeks, formData.holidays, formData.absentMembers)
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 semana</SelectItem>
                      <SelectItem value="2">2 semanas</SelectItem>
                      <SelectItem value="3">3 semanas</SelectItem>
                      <SelectItem value="4">4 semanas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="holidays">Feriados</Label>
                  <Input
                    id="holidays"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.holidays}
                    onChange={(e) => {
                      const holidays = parseInt(e.target.value) || 0;
                      setFormData({ 
                        ...formData, 
                        holidays,
                        storyPointsPerDeveloper: calculateStoryPointsByWeeks(formData.weeks, holidays, formData.absentMembers)
                      });
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pointsPerDev">Pontos por Dev</Label>
                  <Input
                    id="pointsPerDev"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.storyPointsPerDeveloper}
                    onChange={(e) => setFormData({ ...formData, storyPointsPerDeveloper: parseInt(e.target.value) || 8 })}
                  />
                </div>
              </div>

              {/* Team Members */}
              <div className="grid gap-2">
                <Label>Membros da Equipe</Label>
                <div className="flex flex-wrap gap-2">
                  {['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira', 'Carlos Lima', 'Lucia Mendes'].map(member => (
                    <label key={member} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.teamMembers.includes(member)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              teamMembers: [...formData.teamMembers, member]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              teamMembers: formData.teamMembers.filter(m => m !== member),
                              absentMembers: formData.absentMembers.filter(am => am.name !== member)
                            });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{member}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Capacity Summary */}
              {formData.teamMembers.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <Users className="w-4 h-4" />
                    <span>
                      Capacidade: {calculateSprintCapacity(formData.teamMembers, formData.storyPointsPerDeveloper, formData.absentMembers)} pontos 
                      ({formData.teamMembers.length} desenvolvedores × {formData.storyPointsPerDeveloper} pontos)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingSprint(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  if (formData.name && formData.goal && formData.startDate && formData.endDate) {
                    const newSprint: Sprint = {
                      id: editingSprint?.id || Date.now().toString(),
                      name: formData.name,
                      goal: formData.goal,
                      startDate: new Date(formData.startDate),
                      endDate: new Date(formData.endDate),
                      status: formData.status,
                      cards: editingSprint?.cards || [],
                      teamMembers: formData.teamMembers,
                      absentMembers: formData.absentMembers,
                      storyPointsPerDeveloper: formData.storyPointsPerDeveloper,
                      capacity: calculateSprintCapacity(formData.teamMembers, formData.storyPointsPerDeveloper, formData.absentMembers),
                      createdAt: editingSprint?.createdAt || new Date(),
                      updatedAt: new Date()
                    };

                    if (editingSprint) {
                      setSprints(sprints.map(s => s.id === editingSprint.id ? newSprint : s));
                      toast.success('Sprint atualizada com sucesso!');
                    } else {
                      setSprints([...sprints, newSprint]);
                      toast.success('Sprint criada com sucesso!');
                    }

                    setIsCreateDialogOpen(false);
                    setEditingSprint(null);
                    resetForm();
                  } else {
                    toast.error('Preencha todos os campos obrigatórios.');
                  }
                }}
                disabled={!formData.name || !formData.goal || !formData.startDate || !formData.endDate}
              >
                {editingSprint ? 'Salvar Alterações' : 'Criar Sprint'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <SprintFilters
        filters={filters}
        onFiltersChange={setFilters}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sprints={sprints}
      />

      {/* Sprints List */}
      <div className="space-y-4">
        {filteredAndSortedSprints.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma sprint encontrada</h3>
            <p className="text-gray-500 mb-4">
              {filters.searchText || filters.status.length > 0
                ? 'Tente ajustar os filtros para ver mais resultados.'
                : 'Crie sua primeira sprint para começar.'}
            </p>
          </div>
        ) : (
          filteredAndSortedSprints.map(sprint => (
            <Card key={sprint.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{sprint.name}</h3>
                    <Badge className={
                      sprint.status === 'planning' ? 'bg-gray-100 text-gray-800' :
                      sprint.status === 'active' ? 'bg-green-100 text-green-800' :
                      sprint.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'
                    }>
                      {sprint.status === 'planning' ? 'Planejamento' :
                       sprint.status === 'active' ? 'Ativa' :
                       sprint.status === 'completed' ? 'Concluída' : 'Cancelada'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSprintActions(sprint)}
                    
                    {/* More Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingSprint(sprint);
                            setFormData({
                              name: sprint.name,
                              goal: sprint.goal,
                              startDate: sprint.startDate.toISOString().split('T')[0],
                              endDate: sprint.endDate.toISOString().split('T')[0],
                              status: sprint.status,
                              teamMembers: sprint.teamMembers,
                              absentMembers: sprint.absentMembers,
                              weeks: Math.ceil((sprint.endDate.getTime() - sprint.startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)),
                              holidays: 0,
                              storyPointsPerDeveloper: sprint.storyPointsPerDeveloper
                            });
                            setIsCreateDialogOpen(true);
                          }}
                          disabled={sprint.status === 'completed' || sprint.status === 'cancelled'}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar Sprint
                        </DropdownMenuItem>
                        
                        {sprint.status === 'planning' && (
                          <DropdownMenuItem
                            onClick={() => {
                              const confirmMessage = `Deseja excluir a sprint "${sprint.name}"?\n\nEsta ação não pode ser desfeita.`;
                              if (confirm(confirmMessage)) {
                                // Remove cards from sprint first
                                const updatedCards = allCards.map(card =>
                                  card.sprint === sprint.id ? { ...card, sprint: undefined } : card
                                );
                                setAllCards(updatedCards);
                                
                                // Remove sprint
                                setSprints(sprints.filter(s => s.id !== sprint.id));
                                toast.success(`Sprint "${sprint.name}" excluída com sucesso!`);
                              }
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir Sprint
                          </DropdownMenuItem>
                        )}
                        
                        {sprint.status === 'active' && (
                          <DropdownMenuItem
                            onClick={() => {
                              const confirmMessage = `Deseja cancelar a sprint "${sprint.name}"?\n\nEsta ação mudará o status para "Cancelada" e os cards serão movidos de volta para o backlog.`;
                              if (confirm(confirmMessage)) {
                                // Move cards back to backlog
                                const updatedCards = allCards.map(card =>
                                  card.sprint === sprint.id ? { ...card, sprint: undefined } : card
                                );
                                setAllCards(updatedCards);
                                
                                // Update sprint status
                                const updatedSprints = sprints.map(s =>
                                  s.id === sprint.id 
                                    ? { ...s, status: 'cancelled' as const, cards: [], updatedAt: new Date() }
                                    : s
                                );
                                setSprints(updatedSprints);
                                toast.success(`Sprint "${sprint.name}" cancelada. Cards movidos para o backlog.`);
                              }
                            }}
                            className="text-red-600"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Cancelar Sprint
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{sprint.goal}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Sprint cards */}
                  {sprint.cards.length > 0 && (
                    <div className="grid gap-2">
                      {sprint.cards.map(card => (
                        <SprintCardItem
                          key={card.id}
                          card={card}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', JSON.stringify({
                              cardId: card.id,
                              fromSprint: sprint.id
                            }));
                          }}
                          draggable
                        />
                      ))}
                    </div>
                  )}
                  
                  {sprint.cards.length === 0 && (
                    <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                      <Target className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm">Nenhuma história nesta sprint</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Issues to Sprint Dialog */}
      <AddIssuesToSprintDialog
        isOpen={selectedSprintForIssues !== null}
        onClose={() => setSelectedSprintForIssues(null)}
        sprint={selectedSprintForIssues}
        allCards={allCards}
        allSprints={sprints}
        onAddIssues={handleAddIssuesToSprint}
      />
    </div>
  );
}