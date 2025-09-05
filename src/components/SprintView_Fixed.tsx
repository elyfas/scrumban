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
        
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Sprint
        </Button>
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
                    <Badge className="bg-green-100 text-green-800">
                      {sprint.status === 'planning' ? 'Planejamento' :
                       sprint.status === 'active' ? 'Ativa' :
                       sprint.status === 'completed' ? 'Concluída' : 'Cancelada'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSprintActions(sprint)}
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