import { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Target, 
  Calculator,
  BarChart3,
  Activity,
  AlertTriangle,
  PieChart,
  CreditCard,
  Wallet,
  ArrowUp,
  ArrowDown,
  Minus,
  Calendar,
  Building
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface FinancialMetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'default' | 'success' | 'warning' | 'error';
  currency?: boolean;
}

function FinancialMetricCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendValue, 
  color = 'default', 
  currency = false 
}: FinancialMetricCardProps) {
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

  const formatValue = (val: string | number) => {
    if (currency && typeof val === 'number') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(val);
    }
    return val;
  };

  return (
    <Card className={`${colorClasses[color]} transition-all hover:shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-gray-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{formatValue(value)}</div>
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

interface BudgetProgressProps {
  title: string;
  spent: number;
  budget: number;
  percentage: number;
  description: string;
  icon: React.ReactNode;
}

function BudgetProgress({ title, spent, budget, percentage, description, icon }: BudgetProgressProps) {
  const getColor = () => {
    if (percentage >= 90) return 'bg-red-100 border-red-200';
    if (percentage >= 75) return 'bg-yellow-100 border-yellow-200';
    return 'bg-green-100 border-green-200';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className={`${getColor()} transition-all hover:shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-gray-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold">{percentage}%</span>
            <span className="text-sm text-gray-600">
              {formatCurrency(spent)} / {formatCurrency(budget)}
            </span>
          </div>
          <Progress value={percentage} className="w-full" />
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function FinancialReports() {
  const [selectedSprint, setSelectedSprint] = useState('current');
  const [selectedPeriod, setSelectedPeriod] = useState('current-quarter');
  const [selectedProject, setSelectedProject] = useState('all-projects');

  // Dados simulados - em produção viriam de uma API
  const mockData = {
    costControl: {
      plannedVsActual: {
        planned: 85000,
        actual: 92000,
        variance: 8.2 // +8.2%
      },
      burnRate: {
        daily: 4600, // R$ 4.600/dia
        sprintDays: 14,
        totalBudget: 85000
      },
      costPerStoryPoint: {
        totalCost: 92000,
        storyPoints: 42,
        costPerPoint: 2190 // R$ 2.190/ponto
      }
    },
    economicProductivity: {
      roi: {
        valueDelivered: 120000,
        sprintCost: 92000,
        roiPercentage: 30.4 // 30.4%
      },
      costPerStory: {
        totalCost: 92000,
        storiesDelivered: 18,
        avgCost: 5111 // R$ 5.111/história
      },
      reworkIndex: {
        reworkCost: 12000,
        totalCost: 92000,
        percentage: 13.0 // 13%
      }
    },
    predictability: {
      earnedValue: {
        ev: 78000, // Valor das entregas concluídas
        pv: 85000, // Valor planejado até a data
        ac: 92000  // Custo real
      },
      cpi: 0.85, // EV / AC = 78000 / 92000
      spi: 0.92  // EV / PV = 78000 / 85000
    },
    organizational: {
      budgetConsumption: {
        consumed: 320000,
        total: 450000,
        percentage: 71.1
      },
      projectDeviations: [
        { name: 'Projeto Alpha', planned: 150000, actual: 165000, deviation: 10.0 },
        { name: 'Projeto Beta', planned: 200000, actual: 185000, deviation: -7.5 },
        { name: 'Projeto Gamma', planned: 100000, actual: 120000, deviation: 20.0 }
      ],
      portfolioRoi: {
        investment: 450000,
        expectedReturn: 675000,
        roiPercentage: 50.0
      }
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios Financeiros</h1>
          <p className="text-gray-600 mt-1">Análise de custos, ROI e gestão orçamentária do portfólio</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar Projeto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-projects">Todos os Projetos</SelectItem>
              <SelectItem value="projeto-alpha">Projeto Alpha</SelectItem>
              <SelectItem value="projeto-beta">Projeto Beta</SelectItem>
              <SelectItem value="projeto-gamma">Projeto Gamma</SelectItem>
            </SelectContent>
          </Select>

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
              <SelectItem value="current-quarter">Trimestre Atual</SelectItem>
              <SelectItem value="last-quarter">Trimestre Anterior</SelectItem>
              <SelectItem value="current-year">Ano Atual</SelectItem>
              <SelectItem value="last-6-months">Últimos 6 Meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="cost-control">Controle de Custos</TabsTrigger>
          <TabsTrigger value="productivity">Produtividade</TabsTrigger>
          <TabsTrigger value="predictability">Previsibilidade</TabsTrigger>
          <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FinancialMetricCard
              title="Variação de Custo"
              value={`+${mockData.costControl.plannedVsActual.variance}%`}
              description="Custo real vs. planejado"
              icon={<TrendingUp className="w-4 h-4" />}
              trend="up"
              trendValue="+R$ 7k"
              color="warning"
            />
            <FinancialMetricCard
              title="ROI da Sprint"
              value={`${mockData.economicProductivity.roi.roiPercentage}%`}
              description="Retorno sobre investimento"
              icon={<Target className="w-4 h-4" />}
              trend="up"
              trendValue="+5%"
              color="success"
            />
            <FinancialMetricCard
              title="CPI (Índice de Performance)"
              value={mockData.predictability.cpi}
              description="Eficiência de custos"
              icon={<Calculator className="w-4 h-4" />}
              trend="down"
              trendValue="-0.1"
              color="warning"
            />
            <FinancialMetricCard
              title="Burn Rate Diário"
              value={mockData.costControl.burnRate.daily}
              description="Taxa de consumo do orçamento"
              icon={<Activity className="w-4 h-4" />}
              trend="neutral"
              trendValue="0%"
              currency={true}
            />
          </div>

          {/* Resumo por categoria */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Saúde Financeira do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Controle de Custos</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Atenção</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Produtividade Econômica</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Excelente</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Previsibilidade</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Abaixo do Esperado</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ROI do Portfólio</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Muito Bom</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alertas Financeiros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Custo Acima do Planejado</p>
                    <p className="text-xs text-gray-600">8.2% de desvio na sprint atual</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Alto Índice de Retrabalho</p>
                    <p className="text-xs text-gray-600">13% do orçamento em correções</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">ROI Positivo</p>
                    <p className="text-xs text-gray-600">30% de retorno na sprint</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Controle de Custos */}
        <TabsContent value="cost-control" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custo Planejado x Realizado</CardTitle>
                <TrendingUp className="w-4 h-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Planejado:</span>
                    <span className="font-medium">{new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(mockData.costControl.plannedVsActual.planned)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Realizado:</span>
                    <span className="font-medium">{new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(mockData.costControl.plannedVsActual.actual)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Variação:</span>
                      <Badge variant="outline" className="bg-red-100 text-red-700">
                        +{mockData.costControl.plannedVsActual.variance}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <FinancialMetricCard
              title="Burn Rate Financeiro"
              value={mockData.costControl.burnRate.daily}
              description={`R$ ${mockData.costControl.burnRate.daily}/dia × ${mockData.costControl.burnRate.sprintDays} dias`}
              icon={<Activity className="w-4 h-4" />}
              trend="neutral"
              trendValue="Estável"
              currency={true}
            />
            
            <FinancialMetricCard
              title="Custo por Story Point"
              value={mockData.costControl.costPerStoryPoint.costPerPoint}
              description={`${new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(mockData.costControl.costPerStoryPoint.totalCost)} ÷ ${mockData.costControl.costPerStoryPoint.storyPoints} pts`}
              icon={<Calculator className="w-4 h-4" />}
              trend="up"
              trendValue="+R$ 150"
              currency={true}
              color="warning"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução dos Custos por Sprint</CardTitle>
                <CardDescription>Comparativo de custos planejados vs. realizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
                    <span className="font-medium">Sprint</span>
                    <span className="font-medium">Planejado</span>
                    <span className="font-medium">Realizado</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-3 bg-red-50 rounded">
                    <span>Sprint 24</span>
                    <span>R$ 85.000</span>
                    <span className="text-red-600">R$ 92.000</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-3 bg-green-50 rounded">
                    <span>Sprint 23</span>
                    <span>R$ 80.000</span>
                    <span className="text-green-600">R$ 78.000</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-3 bg-yellow-50 rounded">
                    <span>Sprint 22</span>
                    <span>R$ 75.000</span>
                    <span className="text-yellow-600">R$ 82.000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Custos</CardTitle>
                <CardDescription>Breakdown dos custos da sprint atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Recursos Humanos</span>
                    <span>R$ 68.000 (74%)</span>
                  </div>
                  <Progress value={74} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Infraestrutura</span>
                    <span>R$ 12.000 (13%)</span>
                  </div>
                  <Progress value={13} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ferramentas & Licenças</span>
                    <span>R$ 8.000 (9%)</span>
                  </div>
                  <Progress value={9} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Outros</span>
                    <span>R$ 4.000 (4%)</span>
                  </div>
                  <Progress value={4} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Produtividade Econômica */}
        <TabsContent value="productivity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI Incremental da Sprint</CardTitle>
                <Target className="w-4 h-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-green-700">
                    {mockData.economicProductivity.roi.roiPercentage}%
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Valor Entregue:</span>
                      <span>{new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(mockData.economicProductivity.roi.valueDelivered)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Custo da Sprint:</span>
                      <span>{new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(mockData.economicProductivity.roi.sprintCost)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <FinancialMetricCard
              title="Custo Médio por História"
              value={mockData.economicProductivity.costPerStory.avgCost}
              description={`${new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(mockData.economicProductivity.costPerStory.totalCost)} ÷ ${mockData.economicProductivity.costPerStory.storiesDelivered} histórias`}
              icon={<CreditCard className="w-4 h-4" />}
              trend="down"
              trendValue="-R$ 250"
              currency={true}
              color="success"
            />
            
            <FinancialMetricCard
              title="Índice de Retrabalho Financeiro"
              value={`${mockData.economicProductivity.reworkIndex.percentage}%`}
              description={`${new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(mockData.economicProductivity.reworkIndex.reworkCost)} em correções`}
              icon={<AlertTriangle className="w-4 h-4" />}
              trend="up"
              trendValue="+2%"
              color="warning"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Eficiência Econômica por Sprint</CardTitle>
                <CardDescription>Custo por ponto e por história ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded text-sm">
                  <span className="font-medium">Sprint</span>
                  <span className="font-medium">R$/Ponto</span>
                  <span className="font-medium">R$/História</span>
                  <span className="font-medium">ROI</span>
                </div>
                <div className="grid grid-cols-4 gap-2 p-3 bg-yellow-50 rounded text-sm">
                  <span>Sprint 24</span>
                  <span>R$ 2.190</span>
                  <span>R$ 5.111</span>
                  <span className="text-green-600">30.4%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 p-3 bg-green-50 rounded text-sm">
                  <span>Sprint 23</span>
                  <span>R$ 2.053</span>
                  <span>R$ 4.875</span>
                  <span className="text-green-600">28.5%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 p-3 bg-red-50 rounded text-sm">
                  <span>Sprint 22</span>
                  <span>R$ 2.343</span>
                  <span>R$ 5.467</span>
                  <span className="text-red-600">22.1%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise de Valor vs. Custo</CardTitle>
                <CardDescription>Relação entre investimento e retorno</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Valor de Negócio Alto</span>
                    <span>45% das histórias</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Valor de Negócio Médio</span>
                    <span>35% das histórias</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Valor de Negócio Baixo</span>
                    <span>20% das histórias</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Recomendação:</strong> Priorizar histórias de alto valor 
                    para maximizar ROI das próximas sprints.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Previsibilidade (EVM) */}
        <TabsContent value="predictability" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <FinancialMetricCard
              title="Earned Value (EV)"
              value={mockData.predictability.earnedValue.ev}
              description="Valor das entregas concluídas"
              icon={<Wallet className="w-4 h-4" />}
              currency={true}
              color="default"
            />
            
            <FinancialMetricCard
              title="Planned Value (PV)"
              value={mockData.predictability.earnedValue.pv}
              description="Valor planejado até a data"
              icon={<Calendar className="w-4 h-4" />}
              currency={true}
              color="default"
            />
            
            <FinancialMetricCard
              title="Cost Performance Index (CPI)"
              value={mockData.predictability.cpi}
              description="EV ÷ Custo Real"
              icon={<Calculator className="w-4 h-4" />}
              trend="down"
              trendValue="-0.1"
              color="warning"
            />
            
            <FinancialMetricCard
              title="Schedule Performance Index (SPI)"
              value={mockData.predictability.spi}
              description="EV ÷ PV"
              icon={<Activity className="w-4 h-4" />}
              trend="down"
              trendValue="-0.05"
              color="warning"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Interpretação dos Índices EVM</CardTitle>
                <CardDescription>Análise dos indicadores de valor agregado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-yellow-700 font-bold text-sm">CPI</span>
                    </div>
                    <div>
                      <p className="font-medium">0.85 - Abaixo do Esperado</p>
                      <p className="text-sm text-gray-600">
                        Cada R$ 1,00 investido gera R$ 0,85 de valor
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-yellow-700 font-bold text-sm">SPI</span>
                    </div>
                    <div>
                      <p className="font-medium">0.92 - Ligeiramente Atrasado</p>
                      <p className="text-sm text-gray-600">
                        Progresso 8% abaixo do planejado
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-orange-50 rounded">
                  <p className="text-sm text-orange-800">
                    <strong>Ação Recomendada:</strong> Revisar escopo e recursos 
                    para melhorar eficiência e cumprimento de prazos.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projeções Financeiras</CardTitle>
                <CardDescription>Estimativas baseadas no desempenho atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                    <span className="font-medium">Estimate at Completion (EAC)</span>
                    <span className="font-bold">R$ 108.235</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span className="font-medium">Variance at Completion (VAC)</span>
                    <span className="font-bold text-red-600">-R$ 23.235</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-medium">To Complete Performance Index</span>
                    <span className="font-bold">1.25</span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <p>• EAC: Custo total estimado para conclusão</p>
                  <p>• VAC: Variação em relação ao orçamento original</p>
                  <p>• TCPI: Eficiência necessária para não estourar orçamento</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Portfólio */}
        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <BudgetProgress
              title="Orçamento Consumido"
              spent={mockData.organizational.budgetConsumption.consumed}
              budget={mockData.organizational.budgetConsumption.total}
              percentage={mockData.organizational.budgetConsumption.percentage}
              description="Percentual do orçamento total utilizado"
              icon={<Building className="w-4 h-4" />}
            />
            
            <FinancialMetricCard
              title="ROI Estimado do Portfólio"
              value={`${mockData.organizational.portfolioRoi.roiPercentage}%`}
              description={`${new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(mockData.organizational.portfolioRoi.expectedReturn)} / ${new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(mockData.organizational.portfolioRoi.investment)}`}
              icon={<TrendingUp className="w-4 h-4" />}
              trend="up"
              trendValue="+5%"
              color="success"
            />
            
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                <BarChart3 className="w-4 h-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-gray-600 mt-1">
                  2 no prazo, 1 com desvio de custo
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Desvios de Orçamento por Projeto</CardTitle>
                <CardDescription>Comparativo de custos previstos vs. realizados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockData.organizational.projectDeviations.map((project, index) => (
                  <div key={index} className={`p-3 rounded ${
                    project.deviation > 0 ? 'bg-red-50' : 
                    project.deviation < 0 ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{project.name}</span>
                      <Badge variant="outline" className={
                        project.deviation > 0 ? 'bg-red-100 text-red-700' :
                        project.deviation < 0 ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {project.deviation > 0 ? '+' : ''}{project.deviation}%
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Previsto: {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(project.planned)}</span>
                      <span>Realizado: {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(project.actual)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição do Orçamento</CardTitle>
                <CardDescription>Alocação de recursos por projeto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Projeto Alpha</span>
                    <span>R$ 165.000 (37%)</span>
                  </div>
                  <Progress value={37} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Projeto Beta</span>
                    <span>R$ 185.000 (41%)</span>
                  </div>
                  <Progress value={41} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Projeto Gamma</span>
                    <span>R$ 120.000 (27%)</span>
                  </div>
                  <Progress value={27} />
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Investido</span>
                    <span className="font-bold">R$ 470.000</span>
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