import { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, Users, Target, TrendingUp, Play, CheckCircle, Square, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Sprint, KanbanCard } from '../types/kanban';
import { mockCards } from '../constants/kanban';
import { toast } from 'sonner@2.0.3';

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

export function SprintTimeline() {
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [allCards, setAllCards] = useState<KanbanCard[]>(mockCards);

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
  }, []);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  // Sort sprints by start date
  const sortedSprints = useMemo(() => {
    return [...sprints].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [sprints]);

  // Filter sprints by selected month
  const filteredSprints = useMemo(() => {
    if (!selectedMonth) return sortedSprints;
    
    const [year, month] = selectedMonth.split('-').map(Number);
    return sortedSprints.filter(sprint => {
      const sprintYear = sprint.startDate.getFullYear();
      const sprintMonth = sprint.startDate.getMonth() + 1;
      const endYear = sprint.endDate.getFullYear();
      const endMonth = sprint.endDate.getMonth() + 1;
      
      // Sprint overlaps with selected month
      return (sprintYear === year && sprintMonth === month) ||
             (endYear === year && endMonth === month) ||
             (sprintYear <= year && endYear >= year && sprintMonth <= month && endMonth >= month);
    });
  }, [sortedSprints, selectedMonth]);

  // Generate months for selector
  const availableMonths = useMemo(() => {
    const months: string[] = [];
    const now = new Date();
    
    // Add current month and next 6 months
    for (let i = -3; i <= 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      months.push(monthKey);
    }
    
    return months;
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatMonthYear = (monthKey: string) => {
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getStatusBadge = (status: Sprint['status']) => {
    const statusConfig = {
      planning: { label: 'Planejamento', color: 'bg-gray-100 text-gray-800' },
      active: { label: 'Ativa', color: 'bg-green-100 text-green-800' },
      completed: { label: 'Concluída', color: 'bg-blue-100 text-blue-800' },
      cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800' }
    };
    
    return statusConfig[status];
  };

  const getSprintMetrics = (sprint: Sprint) => {
    const teamCapacity = sprint.teamMembers.length * (sprint.storyPointsPerDeveloper || 8);
    const plannedStoryPoints = sprint.cards.reduce((total, card) => total + (card.storyPoints || 0), 0);
    
    const deliveredStoryPoints = sprint.cards
      .filter(card => card.status === 'done' || card.status === 'archived')
      .reduce((total, card) => total + (card.storyPoints || 0), 0);
    
    const capacityUtilization = teamCapacity > 0 ? (plannedStoryPoints / teamCapacity) * 100 : 0;
    const deliveryPercentage = plannedStoryPoints > 0 ? (deliveredStoryPoints / plannedStoryPoints) * 100 : 0;

    return {
      teamCapacity,
      plannedStoryPoints,
      deliveredStoryPoints,
      capacityUtilization,
      deliveryPercentage,
      teamSize: sprint.teamMembers.length
    };
  };

  const getDuration = (startDate: Date, endDate: Date) => {
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const isCurrentSprint = (sprint: Sprint) => {
    const now = new Date();
    return sprint.startDate <= now && sprint.endDate >= now && sprint.status === 'active';
  };

  const canStartSprint = (sprint: Sprint) => {
    return sprint.status === 'planning' && !sprints.some(s => s.status === 'active');
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

  return (
    <div className="space-y-6">
      {/* Header with month selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Cronograma de Sprints</h2>
          <p className="text-gray-600 mt-1">Visualização temporal das sprints do projeto</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableMonths.map(month => (
              <option key={month} value={month}>
                {formatMonthYear(month)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredSprints.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma sprint neste período</h3>
            <p className="text-gray-500">Selecione outro mês ou crie uma nova sprint</p>
          </div>
        ) : (
          filteredSprints.map((sprint, index) => {
            const metrics = getSprintMetrics(sprint);
            const statusBadge = getStatusBadge(sprint.status);
            const duration = getDuration(sprint.startDate, sprint.endDate);
            const isCurrent = isCurrentSprint(sprint);
            
            return (
              <Card key={sprint.id} className={`relative ${isCurrent ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                {/* Timeline line */}
                {index < filteredSprints.length - 1 && (
                  <div className="absolute left-6 top-20 w-0.5 h-full bg-gray-200 z-0"></div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Timeline dot */}
                      <div className={`w-4 h-4 rounded-full mt-1 relative z-10 ${
                        sprint.status === 'active' ? 'bg-green-500' :
                        sprint.status === 'completed' ? 'bg-blue-500' :
                        sprint.status === 'cancelled' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}></div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{sprint.name}</CardTitle>
                          <Badge className={statusBadge.color}>
                            {statusBadge.label}
                          </Badge>
                          {isCurrent && (
                            <Badge className="bg-orange-100 text-orange-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Em Andamento
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {sprint.goal}
                        </p>
                        
                        {/* Sprint info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500">Período</p>
                              <p className="font-medium">{formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500">Duração</p>
                              <p className="font-medium">{duration} dias</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500">Equipe</p>
                              <p className="font-medium">{metrics.teamSize} membros</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500">Stories</p>
                              <p className="font-medium">{sprint.cards.length} histórias</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {sprint.status === 'planning' && canStartSprint(sprint) && (
                        <Button
                          size="sm"
                          onClick={() => handleStartSprint(sprint.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Iniciar
                        </Button>
                      )}
                      
                      {sprint.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompleteSprint(sprint.id)}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Finalizar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Progress metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Utilização da Capacidade</span>
                        <span>{metrics.capacityUtilization.toFixed(0)}%</span>
                      </div>
                      <Progress value={metrics.capacityUtilization} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {metrics.plannedStoryPoints} de {metrics.teamCapacity} story points
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progresso de Entrega</span>
                        <span>{metrics.deliveryPercentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={metrics.deliveryPercentage} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {metrics.deliveredStoryPoints} de {metrics.plannedStoryPoints} pontos entregues
                      </p>
                    </div>
                  </div>
                  
                  {/* Team members */}
                  {sprint.teamMembers.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Membros da Equipe:</p>
                      <div className="flex flex-wrap gap-1">
                        {sprint.teamMembers.map((member, memberIndex) => (
                          <Badge key={memberIndex} variant="outline" className="text-xs">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}