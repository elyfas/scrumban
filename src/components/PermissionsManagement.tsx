import { useState } from 'react';
import { Shield, Users, Edit, Save, RotateCcw, Search, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'Quadro' | 'Sprint' | 'Backlog' | 'Relatórios' | 'Gestão' | 'Sistema';
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
}

interface UserPermission {
  id: string;
  nome: string;
  matricula: string;
  email: string;
  role: string;
  quadros: string[];
  customPermissions: string[];
  isActive: boolean;
}

export function PermissionsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [showInactiveUsers, setShowInactiveUsers] = useState(false);

  // Mock permissions data
  const [permissions] = useState<Permission[]>([
    // Quadro permissions
    { id: 'quadro_view', name: 'Visualizar Quadro', description: 'Pode visualizar quadros Kanban', category: 'Quadro' },
    { id: 'quadro_edit', name: 'Editar Cards', description: 'Pode criar, editar e mover cards', category: 'Quadro' },
    { id: 'quadro_delete', name: 'Excluir Cards', description: 'Pode excluir cards do quadro', category: 'Quadro' },
    { id: 'quadro_manage', name: 'Gerenciar Quadro', description: 'Pode configurar colunas e regras do quadro', category: 'Quadro' },
    
    // Sprint permissions
    { id: 'sprint_view', name: 'Visualizar Sprints', description: 'Pode visualizar sprints e métricas', category: 'Sprint' },
    { id: 'sprint_create', name: 'Criar Sprints', description: 'Pode criar novas sprints', category: 'Sprint' },
    { id: 'sprint_edit', name: 'Editar Sprints', description: 'Pode editar sprints existentes', category: 'Sprint' },
    { id: 'sprint_delete', name: 'Excluir Sprints', description: 'Pode excluir sprints', category: 'Sprint' },
    
    // Backlog permissions
    { id: 'backlog_view', name: 'Visualizar Backlog', description: 'Pode visualizar o backlog do produto', category: 'Backlog' },
    { id: 'backlog_edit', name: 'Gerenciar Backlog', description: 'Pode priorizar e organizar o backlog', category: 'Backlog' },
    
    // Reports permissions
    { id: 'reports_operational', name: 'Relatórios Operacionais', description: 'Pode acessar relatórios operacionais', category: 'Relatórios' },
    { id: 'reports_financial', name: 'Relatórios Financeiros', description: 'Pode acessar relatórios financeiros', category: 'Relatórios' },
    
    // Management permissions
    { id: 'manage_boards', name: 'Gerenciar Quadros', description: 'Pode cadastrar e gerenciar quadros', category: 'Gestão' },
    { id: 'manage_members', name: 'Gerenciar Membros', description: 'Pode cadastrar e gerenciar membros', category: 'Gestão' },
    { id: 'manage_permissions', name: 'Gerenciar Permissões', description: 'Pode configurar permissões e papéis', category: 'Gestão' },
    
    // System permissions
    { id: 'system_admin', name: 'Administrador do Sistema', description: 'Acesso total ao sistema', category: 'Sistema' },
    { id: 'system_logs', name: 'Visualizar Logs', description: 'Pode visualizar logs do sistema', category: 'Sistema' },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'Administrador',
      description: 'Acesso total ao sistema',
      color: 'bg-red-100 text-red-800',
      permissions: permissions.map(p => p.id)
    },
    {
      id: 'product_owner',
      name: 'Product Owner',
      description: 'Gerencia produtos e prioridades',
      color: 'bg-blue-100 text-blue-800',
      permissions: ['quadro_view', 'quadro_edit', 'sprint_view', 'sprint_create', 'sprint_edit', 'backlog_view', 'backlog_edit', 'reports_operational']
    },
    {
      id: 'scrum_master',
      name: 'Scrum Master',
      description: 'Facilita o processo Scrum',
      color: 'bg-green-100 text-green-800',
      permissions: ['quadro_view', 'quadro_edit', 'sprint_view', 'sprint_create', 'sprint_edit', 'sprint_delete', 'reports_operational', 'manage_members']
    },
    {
      id: 'developer',
      name: 'Desenvolvedor',
      description: 'Executa desenvolvimento de software',
      color: 'bg-purple-100 text-purple-800',
      permissions: ['quadro_view', 'quadro_edit', 'sprint_view', 'backlog_view']
    },
    {
      id: 'viewer',
      name: 'Visualizador',
      description: 'Apenas visualização',
      color: 'bg-gray-100 text-gray-800',
      permissions: ['quadro_view', 'sprint_view', 'backlog_view']
    }
  ]);

  const [users, setUsers] = useState<UserPermission[]>([
    {
      id: 'user-1',
      nome: 'João Silva Santos',
      matricula: 'MAT001',
      email: 'joao.silva@empresa.com',
      role: 'developer',
      quadros: ['Sistema de E-commerce', 'App Mobile Banking'],
      customPermissions: [],
      isActive: true
    },
    {
      id: 'user-2',
      nome: 'Maria Oliveira Costa',
      matricula: 'MAT002',
      email: 'maria.oliveira@empresa.com',
      role: 'product_owner',
      quadros: ['Sistema de E-commerce'],
      customPermissions: ['reports_financial'],
      isActive: true
    },
    {
      id: 'user-3',
      nome: 'Pedro Henrique Lima',
      matricula: 'MAT003',
      email: 'pedro.lima@empresa.com',
      role: 'scrum_master',
      quadros: ['App Mobile Banking', 'Portal do Cliente'],
      customPermissions: [],
      isActive: false
    }
  ]);

  const categories = ['all', 'Quadro', 'Sprint', 'Backlog', 'Relatórios', 'Gestão', 'Sistema'];

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || permission.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredUsers = users.filter(user => {
    const matchesVisibility = showInactiveUsers || user.isActive;
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesVisibility && matchesSearch;
  });

  const handleRolePermissionToggle = (roleId: string, permissionId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter(p => p !== permissionId)
            : [...role.permissions, permissionId]
        };
      }
      return role;
    }));
  };

  const handleUserRoleChange = (userId: string, newRoleId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRoleId } : user
    ));
    toast.success('Papel do usuário atualizado com sucesso!');
  };

  const handleUserStatusToggle = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
    const user = users.find(u => u.id === userId);
    toast.success(`Usuário ${user?.isActive ? 'desativado' : 'ativado'} com sucesso!`);
  };

  const getRoleById = (roleId: string) => roles.find(r => r.id === roleId);

  const getUserPermissions = (user: UserPermission) => {
    const role = getRoleById(user.role);
    const rolePermissions = role?.permissions || [];
    return [...new Set([...rolePermissions, ...user.customPermissions])];
  };

  const saveRoleChanges = (roleId: string) => {
    setEditingRole(null);
    toast.success('Permissões do papel atualizadas com sucesso!');
  };

  const resetRoleChanges = (roleId: string) => {
    // Reset to original state - would need to store original state in real app
    setEditingRole(null);
    toast.info('Alterações canceladas');
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Permissões</h1>
            <p className="text-gray-600 mt-1">Configure papéis, permissões e acesso dos usuários</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar permissões ou usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.slice(1).map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch
              id="show-inactive"
              checked={showInactiveUsers}
              onCheckedChange={setShowInactiveUsers}
            />
            <Label htmlFor="show-inactive">Mostrar inativos</Label>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Papéis</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permissões</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{permissions.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Roles and Permissions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Papéis e Permissões</h2>
            
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <Badge className={role.color}>{role.name}</Badge>
                    </div>
                    <div className="flex gap-2">
                      {editingRole === role.id ? (
                        <>
                          <Button size="sm" onClick={() => saveRoleChanges(role.id)}>
                            <Save className="w-4 h-4 mr-1" />
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => resetRoleChanges(role.id)}>
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setEditingRole(role.id)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.slice(1).map(category => {
                      const categoryPermissions = filteredPermissions.filter(p => p.category === category);
                      if (categoryPermissions.length === 0) return null;

                      return (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">{category}</h4>
                          <div className="space-y-2 ml-4">
                            {categoryPermissions.map(permission => (
                              <div key={permission.id} className="flex items-center justify-between">
                                <div className="flex-1">
                                  <Label htmlFor={`${role.id}-${permission.id}`} className="text-sm font-normal">
                                    {permission.name}
                                  </Label>
                                  <p className="text-xs text-gray-500">{permission.description}</p>
                                </div>
                                <Switch
                                  id={`${role.id}-${permission.id}`}
                                  checked={role.permissions.includes(permission.id)}
                                  onCheckedChange={() => handleRolePermissionToggle(role.id, permission.id)}
                                  disabled={editingRole !== role.id}
                                />
                              </div>
                            ))}
                          </div>
                          <Separator className="mt-3" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Users Management */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Usuários e Acessos</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Usuários do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => {
                    const role = getRoleById(user.role);
                    const userPermissions = getUserPermissions(user);

                    return (
                      <div key={user.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{user.nome}</h4>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-xs text-gray-500">Matrícula: {user.matricula}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={role?.color}>
                              {role?.name}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserStatusToggle(user.id)}
                              className={user.isActive ? 'text-red-600 border-red-300 hover:bg-red-50' : 'text-green-600 border-green-300 hover:bg-green-50'}
                            >
                              {user.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <Label className="text-sm font-medium">Papel:</Label>
                            <Select value={user.role} onValueChange={(value) => handleUserRoleChange(user.id, value)}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map(role => (
                                  <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Quadros com Acesso:</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {user.quadros.map(quadro => (
                                <Badge key={quadro} variant="outline" className="text-xs">
                                  {quadro}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">
                              Permissões ({userPermissions.length} de {permissions.length}):
                            </Label>
                            <div className="text-xs text-gray-600 mt-1 max-h-20 overflow-y-auto">
                              {userPermissions.map(permId => {
                                const perm = permissions.find(p => p.id === permId);
                                return perm ? (
                                  <span key={permId} className="inline-block bg-gray-100 rounded px-2 py-1 mr-1 mb-1">
                                    {perm.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}