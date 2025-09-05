import { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  CheckCircle, 
  Clock, 
  BarChart3,
  Activity,
  AlertCircle,
  Users,
  ThumbsUp,
  Filter,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'default' | 'success' | 'warning' | 'error';
}

function MetricCard({ title, value, description, icon, trend, trendValue, color = 'default' }: MetricCardProps) {
  const colorClasses = {
    default: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200'
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className={`${colorClasses[color]} transition-all hover:shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-gray-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {trend && trendValue && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className="text-sm text-gray-600">{trendValue}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

interface ProgressMetricProps {
  title: string;
  current: number;
  total: number;
  percentage: number;
  description: string;
  icon: React.ReactNode;
}

function ProgressMetric({ title, current, total, percentage, description, icon }: ProgressMetricProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-gray-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold">{percentage}%</span>
            <span className="text-sm text-gray-600">{current}/{total}</span>
          </div>
          <Progress value={percentage} className="w-full" />
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function OperationalReports() {
  const [selectedSprint, setSelectedSprint] = useState('current');
  const [selectedPeriod, setSelectedPeriod] = useState('last-6-sprints');

  // Dados simulados - em produção viriam de uma API
  const mockData = {
    productivity: {
      velocity: { current: 42, previous: 38, trend: 'up' as const },
      deliveryRate: { value: 85, completed: 17, total: 20 },
      completionRate: { value: 90, completed: 18, planned: 20 }
    },
    quality: {
      testSuccessRate: { value: 94, passed: 188, total: 200 },
      testCoverage: { value: 87, executed: 174, planned: 200 },
      bugsPerStory: { value: 0.3, bugs: 6, stories: 18 },
      rework: { value: 12, reworkHours: 48, totalHours: 400 }
    },
    flow: {
      leadTime: { value: 5.2, unit: 'dias', trend: 'down' as const },
      cycleTime: { value: 3.1, unit: 'dias', trend: 'down' as const },
      wipAverage: { value: 8.5, trend: 'neutral' as const },
      throughput: { value: 18, unit: 'histórias/sprint', trend: 'up' as const }
    },
    satisfaction: {
      commitmentIndex: { value: 95, delivered: 42, committed: 44 },
      acceptanceIndex: { value: 100, accepted: 18, delivered: 18 },
      retrospectiveScore: { improvements: 8, recurring: 2 }
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios Operacionais</h1>
          <p className="text-gray-600 mt-1">Métricas de produtividade, qualidade e eficiência da equipe</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedSprint} onValueChange={setSelectedSprint}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar Sprint" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Sprint Atual</SelectItem>
              <SelectItem value="previous">Sprint Anterior</SelectItem>
              <SelectItem value="sprint-23">Sprint 23</SelectItem>
              <SelectItem value="sprint-22">Sprint 22</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-6-sprints">Últimas 6 Sprints</SelectItem>
              <SelectItem value="last-3-months">Últimos 3 Meses</SelectItem>
              <SelectItem value="current-quarter">Trimestre Atual</SelectItem>
              <SelectItem value="last-quarter">Trimestre Anterior</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="productivity">Produtividade</TabsTrigger>
          <TabsTrigger value="quality">Qualidade</TabsTrigger>
          <TabsTrigger value="flow">Fluxo & Eficiência</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfação</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Velocidade da Sprint"
              value={`${mockData.productivity.velocity.current} pts`}
              description="Story points concluídos"
              icon={<TrendingUp className="w-4 h-4" />}
              trend="up"
              trendValue="+10.5%"
              color="success"
            />
            <MetricCard
              title="Taxa de Entrega"
              value={`${mockData.productivity.deliveryRate.value}%`}
              description="Histórias entregues no prazo"
              icon={<Target className="w-4 h-4" />}
              trend="up"
              trendValue="+5%"
              color="success"
            />
            <MetricCard
              title="Lead Time"
              value={`${mockData.flow.leadTime.value} dias`}
              description="Tempo médio de entrega"
              icon={<Clock className="w-4 h-4" />}
              trend="down"
              trendValue="-0.8d"
              color="success"
            />
            <MetricCard
              title="Taxa de Sucesso dos Testes"
              value={`${mockData.quality.testSuccessRate.value}%`}
              description="Testes aprovados"
              icon={<CheckCircle className="w-4 h-4" />}
              trend="up"
              trendValue="+2%"
              color="success"
            />
          </div>

          {/* Resumo por categoria */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Resumo de Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Produtividade</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Excelente</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Qualidade</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Muito Bom</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fluxo</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Bom</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Satisfação</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Excelente</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Pontos de Atenção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">WIP Alto</p>
                    <p className="text-xs text-gray-600">8.5 itens em progresso (ideal: 6-7)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Retrabalho</p>
                    <p className="text-xs text-gray-600">12% do esforço em correções</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Tendência Positiva</p>
                    <p className="text-xs text-gray-600">Lead Time e Cycle Time em queda</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Produtividade / Entrega */}
        <TabsContent value="productivity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Velocidade da Sprint"
              value={`${mockData.productivity.velocity.current} pts`}
              description="Total de story points concluídos na sprint"
              icon={<TrendingUp className="w-4 h-4" />}
              trend="up"
              trendValue={`+${mockData.productivity.velocity.current - mockData.productivity.velocity.previous} pts`}
              color="success"
            />
            
            <ProgressMetric
              title="Taxa de Entrega no Prazo"
              current={mockData.productivity.deliveryRate.completed}
              total={mockData.productivity.deliveryRate.total}
              percentage={mockData.productivity.deliveryRate.value}
              description="Histórias concluídas até a data planejada"
              icon={<Target className="w-4 h-4" />}
            />
            
            <ProgressMetric
              title="Taxa de Conclusão da Sprint"
              current={mockData.productivity.completionRate.completed}
              total={mockData.productivity.completionRate.planned}
              percentage={mockData.productivity.completionRate.value}
              description="Histórias concluídas vs. planejadas"
              icon={<CheckCircle className="w-4 h-4" />}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Velocidade</CardTitle>
              <CardDescription>Evolução dos story points nas últimas sprints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Sprint 24 (Atual)</span>
                  <Badge variant="outline">42 pts</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Sprint 23</span>
                  <Badge variant="outline">38 pts</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Sprint 22</span>
                  <Badge variant="outline">35 pts</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Sprint 21</span>
                  <Badge variant="outline">40 pts</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Qualidade */}
        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            <ProgressMetric
              title="Taxa de Sucesso dos Testes"
              current={mockData.quality.testSuccessRate.passed}
              total={mockData.quality.testSuccessRate.total}
              percentage={mockData.quality.testSuccessRate.value}
              description="Testes aprovados vs. total executado"
              icon={<CheckCircle className="w-4 h-4" />}
            />
            
            <ProgressMetric
              title="Cobertura de Testes"
              current={mockData.quality.testCoverage.executed}
              total={mockData.quality.testCoverage.planned}
              percentage={mockData.quality.testCoverage.value}
              description="Testes executados vs. planejados"
              icon={<Activity className="w-4 h-4" />}
            />
            
            <MetricCard
              title="Índice de Bugs por História"
              value={mockData.quality.bugsPerStory.value}
              description={`${mockData.quality.bugsPerStory.bugs} defeitos / ${mockData.quality.bugsPerStory.stories} histórias`}
              icon={<AlertCircle className="w-4 h-4" />}
              trend="down"
              trendValue="-0.1"
              color="success"
            />
            
            <MetricCard
              title="Retrabalho"
              value={`${mockData.quality.rework.value}%`}
              description={`${mockData.quality.rework.reworkHours}h de correções / ${mockData.quality.rework.totalHours}h total`}
              icon={<TrendingUp className="w-4 h-4" />}
              trend="up"
              trendValue="+2%"
              color="warning"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Defeitos</CardTitle>
                <CardDescription>Tipos de bugs encontrados na sprint</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">UI/UX</span>
                  <Badge variant="outline">3</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Funcional</span>
                  <Badge variant="outline">2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Performance</span>
                  <Badge variant="outline">1</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Integração</span>
                  <Badge variant="outline">0</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Teste</CardTitle>
                <CardDescription>Detalhamento dos testes realizados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Testes Unitários</span>
                    <span>156/160 (97.5%)</span>
                  </div>
                  <Progress value={97.5} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Testes de Integração</span>
                    <span>28/32 (87.5%)</span>
                  </div>
                  <Progress value={87.5} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Testes E2E</span>
                    <span>4/8 (50%)</span>
                  </div>
                  <Progress value={50} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Fluxo e Eficiência */}
        <TabsContent value="flow" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard
              title="Lead Time"
              value={`${mockData.flow.leadTime.value} dias`}
              description="Tempo médio da criação até entrega"
              icon={<Clock className="w-4 h-4" />}
              trend="down"
              trendValue="-0.8d"
              color="success"
            />
            
            <MetricCard
              title="Cycle Time"
              value={`${mockData.flow.cycleTime.value} dias`}
              description="Tempo médio do início ao fim do desenvolvimento"
              icon={<Activity className="w-4 h-4" />}
              trend="down"
              trendValue="-0.5d"
              color="success"
            />
            
            <MetricCard
              title="WIP Médio"
              value={mockData.flow.wipAverage.value}
              description="Quantidade média de itens em andamento"
              icon={<BarChart3 className="w-4 h-4" />}
              trend="neutral"
              trendValue="0.0"
              color="warning"
            />
            
            <MetricCard
              title="Throughput"
              value={mockData.flow.throughput.value}
              description="Histórias concluídas por sprint"
              icon={<TrendingUp className="w-4 h-4" />}
              trend="up"
              trendValue="+2"
              color="success"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição do Lead Time</CardTitle>
                <CardDescription>Tempo gasto em cada fase do processo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Backlog</span>
                    <span>1.2 dias (23%)</span>
                  </div>
                  <Progress value={23} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Desenvolvimento</span>
                    <span>2.1 dias (40%)</span>
                  </div>
                  <Progress value={40} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Review & Testes</span>
                    <span>1.4 dias (27%)</span>
                  </div>
                  <Progress value={27} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Deploy</span>
                    <span>0.5 dias (10%)</span>
                  </div>
                  <Progress value={10} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução dos Tempos</CardTitle>
                <CardDescription>Tendência dos indicadores de fluxo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <div>
                    <p className="font-medium">Lead Time</p>
                    <p className="text-sm text-gray-600">Sprint atual: 5.2 dias</p>
                  </div>
                  <ArrowDown className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <div>
                    <p className="font-medium">Cycle Time</p>
                    <p className="text-sm text-gray-600">Sprint atual: 3.1 dias</p>
                  </div>
                  <ArrowDown className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                  <div>
                    <p className="font-medium">WIP</p>
                    <p className="text-sm text-gray-600">Média: 8.5 itens</p>
                  </div>
                  <Minus className="w-5 h-5 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Satisfação e Compromisso */}
        <TabsContent value="satisfaction" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ProgressMetric
              title="Índice de Comprometimento Cumprido"
              current={mockData.satisfaction.commitmentIndex.delivered}
              total={mockData.satisfaction.commitmentIndex.committed}
              percentage={mockData.satisfaction.commitmentIndex.value}
              description="Pontos entregues vs. comprometidos"
              icon={<Target className="w-4 h-4" />}
            />
            
            <ProgressMetric
              title="Índice de Aceite do Cliente/PO"
              current={mockData.satisfaction.acceptanceIndex.accepted}
              total={mockData.satisfaction.acceptanceIndex.delivered}
              percentage={mockData.satisfaction.acceptanceIndex.value}
              description="Histórias aceitas vs. entregues"
              icon={<ThumbsUp className="w-4 h-4" />}
            />
            
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Feedback da Retrospectiva</CardTitle>
                <Users className="w-4 h-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">+6</div>
                <p className="text-xs text-gray-600 mt-1">
                  {mockData.satisfaction.retrospectiveScore.improvements} melhorias - {mockData.satisfaction.retrospectiveScore.recurring} problemas recorrentes
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Compromissos</CardTitle>
                <CardDescription>Taxa de cumprimento das últimas sprints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span>Sprint 24</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700">95%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span>Sprint 23</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700">88%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                  <span>Sprint 22</span>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700">75%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span>Sprint 21</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700">92%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pontos de Melhoria</CardTitle>
                <CardDescription>Identificados na última retrospectiva</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <ThumbsUp className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Melhorar comunicação</p>
                    <p className="text-xs text-gray-600">Daily standups mais objetivas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <ThumbsUp className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Automação de testes</p>
                    <p className="text-xs text-gray-600">Implementar mais testes E2E</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                    <AlertCircle className="w-3 h-3 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Reduzir WIP</p>
                    <p className="text-xs text-gray-600">Focar em menos tarefas simultâneas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}