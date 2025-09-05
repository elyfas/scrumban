import { FolderKanban, Users, Shield, Settings, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ManagementHubProps {
  onSectionChange: (section: string) => void;
}

export function ManagementHub({ onSectionChange }: ManagementHubProps) {
  const managementOptions = [
    {
      id: 'kanban-gestao-quadros',
      title: 'Cadastrar Quadro',
      description: 'Gerencie quadros Kanban do sistema',
      icon: FolderKanban,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      stats: { label: 'Quadros ativos', value: '3' }
    },
    {
      id: 'kanban-gestao-membros',
      title: 'Cadastrar Membro',
      description: 'Gerencie membros da equipe e suas informações',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      stats: { label: 'Membros ativos', value: '12' }
    },
    {
      id: 'kanban-gestao-permissoes',
      title: 'Gerenciar Permissões',
      description: 'Configure papéis, permissões e acessos',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      stats: { label: 'Papéis configurados', value: '5' }
    }
  ];

  const systemStats = [
    {
      title: 'Quadros Ativos',
      value: '3',
      icon: FolderKanban,
      change: '+2 este mês',
      changeType: 'positive'
    },
    {
      title: 'Membros da Equipe',
      value: '12',
      icon: Users,
      change: '+3 este mês',
      changeType: 'positive'
    },
    {
      title: 'Usuários Ativos',
      value: '9',
      icon: Activity,
      change: '75% da equipe',
      changeType: 'neutral'
    },
    {
      title: 'Taxa de Utilização',
      value: '89%',
      icon: TrendingUp,
      change: '+5% este mês',
      changeType: 'positive'
    }
  ];

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-gray-700" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão do Sistema</h1>
            <p className="text-gray-600 mt-1">Configure e gerencie recursos do sistema Kanban</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* System Overview Stats */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Visão Geral do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {systemStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Management Options */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Opções de Gestão</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {managementOptions.map((option) => (
              <Card 
                key={option.id}
                className={`cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-gray-300 ${option.bgColor}`}
                onClick={() => onSectionChange(option.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm`}>
                    <option.icon className={`w-8 h-8 ${option.color}`} />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className={`text-2xl font-bold ${option.color}`}>
                      {option.stats.value}
                    </div>
                    <div className="text-sm text-gray-500">
                      {option.stats.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                   onClick={() => onSectionChange('kanban-gestao-quadros')}>
                <div className="flex items-center gap-3">
                  <FolderKanban className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Criar Novo Quadro</h3>
                    <p className="text-sm text-gray-600">Configurar um novo projeto</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                   onClick={() => onSectionChange('kanban-gestao-membros')}>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Adicionar Membro</h3>
                    <p className="text-sm text-gray-600">Cadastrar novo membro</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                   onClick={() => onSectionChange('kanban-gestao-permissoes')}>
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Configurar Permissões</h3>
                    <p className="text-sm text-gray-600">Ajustar acessos e papéis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FolderKanban className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Quadro "Sistema de E-commerce"</span> foi atualizado
                    </p>
                    <p className="text-xs text-gray-500">há 2 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Maria Oliveira</span> foi adicionada ao projeto
                    </p>
                    <p className="text-xs text-gray-500">há 5 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Permissões do papel <span className="font-medium">"Desenvolvedor"</span> foram atualizadas
                    </p>
                    <p className="text-xs text-gray-500">ontem</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}