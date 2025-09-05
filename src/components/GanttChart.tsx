import { useState } from 'react';
import { Calendar, Clock, Users, Target, BarChart3, Filter, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockSprints } from '../constants/kanban';
import { Sprint } from '../types/kanban';
import { SprintScheduler } from './SprintScheduler';

interface GanttChartProps {
  sprints?: Sprint[];
}

export function GanttChart({ sprints = mockSprints }: GanttChartProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'month' | 'quarter'>('month');

  // Filtrar sprints baseado no status selecionado
  const filteredSprints = sprints.filter(sprint => 
    filterStatus === 'all' || sprint.status === filterStatus
  );

  // Ordenar sprints por data de início
  const sortedSprints = [...filteredSprints].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Calcular escala de tempo
  const getTimeScale = () => {
    if (sortedSprints.length === 0) return { start: new Date(), end: new Date() };
    
    const dates = sortedSprints.flatMap(sprint => [sprint.startDate, sprint.endDate]);
    const start = new Date(Math.min(...dates.map(d => new Date(d).getTime())));
    const end = new Date(Math.max(...dates.map(d => new Date(d).getTime())));
    
    // Adicionar margem
    start.setDate(start.getDate() - 7);
    end.setDate(end.getDate() + 7);
    
    return { start, end };
  };

  const { start: timeStart, end: timeEnd } = getTimeScale();
  const totalDays = Math.ceil((timeEnd.getTime() - timeStart.getTime()) / (1000 * 60 * 60 * 24));

  // Calcular posição e largura das barras do Gantt
  const getBarProperties = (sprint: Sprint) => {
    const sprintStart = new Date(sprint.startDate);
    const sprintEnd = new Date(sprint.endDate);
    const sprintDuration = Math.ceil((sprintEnd.getTime() - sprintStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysFromStart = Math.ceil((sprintStart.getTime() - timeStart.getTime()) / (1000 * 60 * 60 * 24));
    
    const leftPercentage = (daysFromStart / totalDays) * 100;
    const widthPercentage = (sprintDuration / totalDays) * 100;
    
    return { left: leftPercentage, width: widthPercentage };
  };

  // Obter cor baseada no status
  const getStatusColor = (status: Sprint['status']) => {
    switch (status) {
      case 'planning': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  // Obter badge de status
  const getStatusBadge = (status: Sprint['status']) => {
    const variants = {
      planning: 'secondary',
      active: 'default',
      completed: 'outline',
      cancelled: 'destructive'
    } as const;

    const labels = {
      planning: 'Planejamento',
      active: 'Ativa',
      completed: 'Concluída',
      cancelled: 'Cancelada'
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  // Calcular progresso da sprint (baseado nas datas)
  const getSprintProgress = (sprint: Sprint) => {
    const now = new Date();
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.round((elapsed / total) * 100);
  };

  // Gerar escala de tempo
  const generateTimeScale = () => {
    const months = [];
    const current = new Date(timeStart);
    current.setDate(1); // Primeiro dia do mês
    
    while (current <= timeEnd) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  const timeScale = generateTimeScale();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cronograma de Sprints</h1>
          <p className="text-gray-600 mt-1">Visualização em Gantt Chart e gerenciamento das sprints do projeto</p>
        </div>
        
        {/* Filtros */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="planning">Planejamento</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Select value={viewMode} onValueChange={(value: 'month' | 'quarter') => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mensal</SelectItem>
              <SelectItem value="quarter">Trimestral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Info de filtros aplicados */}
      {filterStatus !== 'all' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            📊 Mostrando {sortedSprints.length} sprint(s) com status: <span className="font-medium">{filterStatus}</span>
            <button 
              onClick={() => setFilterStatus('all')}
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              Remover filtro
            </button>
          </p>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Gerenciar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6 mt-6">
          {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Sprints</p>
                <p className="text-xl font-semibold">{sortedSprints.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Sprints Ativas</p>
                <p className="text-xl font-semibold">
                  {sortedSprints.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total da Equipe</p>
                <p className="text-xl font-semibold">
                  {Math.max(...sortedSprints.map(s => s.teamMembers.length), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Capacidade Total</p>
                <p className="text-xl font-semibold">
                  {sortedSprints.reduce((acc, s) => acc + s.capacity, 0)} pts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gantt Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Timeline das Sprints
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Escala de Tempo */}
            <div className="relative">
              <div className="flex border-b border-gray-200 pb-2 mb-4">
                {timeScale.map((month, index) => (
                  <div 
                    key={index}
                    className="flex-1 text-center text-sm font-medium text-gray-600 border-r border-gray-100 last:border-r-0"
                  >
                    {month.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                  </div>
                ))}
              </div>
              
              {/* Grid Lines */}
              <div className="absolute inset-0 top-8">
                {timeScale.map((_, index) => (
                  <div 
                    key={index}
                    className="absolute top-0 bottom-0 border-l border-gray-100"
                    style={{ left: `${(index / timeScale.length) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Sprints */}
            <div className="space-y-4">
              {sortedSprints.map((sprint) => {
                const barProps = getBarProperties(sprint);
                const progress = getSprintProgress(sprint);
                
                return (
                  <div key={sprint.id} className="relative">
                    {/* Sprint Info */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900">{sprint.name}</h3>
                        {getStatusBadge(sprint.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {sprint.teamMembers.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {sprint.capacity} pts
                        </span>
                        <span>
                          {new Date(sprint.startDate).toLocaleDateString('pt-BR')} - {new Date(sprint.endDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Gantt Bar */}
                    <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className={`absolute top-0 bottom-0 ${getStatusColor(sprint.status)} rounded-lg flex items-center justify-center text-white text-xs font-medium transition-all duration-300 hover:opacity-80`}
                        style={{
                          left: `${barProps.left}%`,
                          width: `${barProps.width}%`
                        }}
                      >
                        {sprint.status === 'active' && (
                          <span>{progress}%</span>
                        )}
                      </div>
                      
                      {/* Progress indicator for active sprints */}
                      {sprint.status === 'active' && (
                        <div
                          className="absolute top-0 bottom-0 bg-green-300 rounded-lg opacity-50"
                          style={{
                            left: `${barProps.left}%`,
                            width: `${(barProps.width * progress) / 100}%`
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Sprint Goal */}
                    <p className="text-sm text-gray-600 mt-1 truncate" title={sprint.goal}>
                      {sprint.goal}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Planejamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Ativa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm">Concluída</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Cancelada</span>
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6 mt-6">
          <SprintScheduler sprints={sprints} />
        </TabsContent>
      </Tabs>
    </div>
  );
}