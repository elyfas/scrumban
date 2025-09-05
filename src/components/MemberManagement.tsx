import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Users, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface Member {
  id: string;
  nome: string;
  matricula: string;
  funcao: string;
  senioridade: 'Estagiário' | 'Júnior' | 'Pleno' | 'Sênior' | 'Especialista';
  quadroCadastrado: string;
  createdAt: string;
  updatedAt: string;
  status: 'Ativo' | 'Inativo';
}

export function MemberManagement() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: 'member-1',
      nome: 'João Silva Santos',
      matricula: 'MAT001',
      funcao: 'Desenvolvedor Frontend',
      senioridade: 'Pleno',
      quadroCadastrado: 'Sistema de E-commerce',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      status: 'Ativo'
    },
    {
      id: 'member-2',
      nome: 'Maria Oliveira Costa',
      matricula: 'MAT002',
      funcao: 'Product Owner',
      senioridade: 'Sênior',
      quadroCadastrado: 'App Mobile Banking',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-10',
      status: 'Ativo'
    },
    {
      id: 'member-3',
      nome: 'Pedro Henrique Lima',
      matricula: 'MAT003',
      funcao: 'UI/UX Designer',
      senioridade: 'Júnior',
      quadroCadastrado: 'Portal do Cliente',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
      status: 'Inativo'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    funcao: '',
    senioridade: '' as Member['senioridade'] | '',
    quadroCadastrado: ''
  });

  // Mock data for boards
  const availableBoards = [
    'Sistema de E-commerce',
    'App Mobile Banking',
    'Portal do Cliente',
    'Sistema de Vendas',
    'Dashboard Analytics'
  ];

  const filteredMembers = members.filter(member =>
    member.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.funcao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return false;
    }
    if (!formData.matricula.trim()) {
      toast.error('Matrícula é obrigatória');
      return false;
    }
    if (!formData.funcao.trim()) {
      toast.error('Função é obrigatória');
      return false;
    }
    if (!formData.senioridade) {
      toast.error('Senioridade é obrigatória');
      return false;
    }
    if (!formData.quadroCadastrado) {
      toast.error('Quadro é obrigatório');
      return false;
    }
    return true;
  };

  const handleCreateMember = () => {
    if (!validateForm()) return;

    // Check if matricula already exists
    if (members.some(member => member.matricula === formData.matricula.trim())) {
      toast.error('Matrícula já cadastrada');
      return;
    }

    const newMember: Member = {
      id: `member-${Date.now()}`,
      nome: formData.nome.trim(),
      matricula: formData.matricula.trim(),
      funcao: formData.funcao.trim(),
      senioridade: formData.senioridade,
      quadroCadastrado: formData.quadroCadastrado,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'Ativo'
    };

    setMembers([...members, newMember]);
    setFormData({ nome: '', matricula: '', funcao: '', senioridade: '', quadroCadastrado: '' });
    setIsCreateDialogOpen(false);
    toast.success('Membro cadastrado com sucesso!');
  };

  const handleEditMember = () => {
    if (!validateForm() || !editingMember) return;

    // Check if matricula already exists (excluding current member)
    if (members.some(member => member.matricula === formData.matricula.trim() && member.id !== editingMember.id)) {
      toast.error('Matrícula já cadastrada');
      return;
    }

    const updatedMembers = members.map(member =>
      member.id === editingMember.id
        ? {
            ...member,
            nome: formData.nome.trim(),
            matricula: formData.matricula.trim(),
            funcao: formData.funcao.trim(),
            senioridade: formData.senioridade,
            quadroCadastrado: formData.quadroCadastrado,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : member
    );

    setMembers(updatedMembers);
    setFormData({ nome: '', matricula: '', funcao: '', senioridade: '', quadroCadastrado: '' });
    setEditingMember(null);
    setIsEditDialogOpen(false);
    toast.success('Membro atualizado com sucesso!');
  };

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.')) {
      setMembers(members.filter(member => member.id !== memberId));
      toast.success('Membro excluído com sucesso!');
    }
  };

  const openEditDialog = (member: Member) => {
    setEditingMember(member);
    setFormData({
      nome: member.nome,
      matricula: member.matricula,
      funcao: member.funcao,
      senioridade: member.senioridade,
      quadroCadastrado: member.quadroCadastrado
    });
    setIsEditDialogOpen(true);
  };

  const getSenioridadeColor = (senioridade: string) => {
    switch (senioridade) {
      case 'Estagiário':
        return 'bg-purple-100 text-purple-800';
      case 'Júnior':
        return 'bg-blue-100 text-blue-800';
      case 'Pleno':
        return 'bg-green-100 text-green-800';
      case 'Sênior':
        return 'bg-orange-100 text-orange-800';
      case 'Especialista':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Inativo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cadastrar Membro</h1>
            <p className="text-gray-600 mt-1">Gerencie os membros da equipe</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Membro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Membro</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo membro da equipe. Todos os campos são obrigatórios.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Digite o nome completo..."
                  />
                </div>
                <div>
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input
                    id="matricula"
                    value={formData.matricula}
                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                    placeholder="Digite a matrícula..."
                  />
                </div>
                <div>
                  <Label htmlFor="funcao">Função</Label>
                  <Input
                    id="funcao"
                    value={formData.funcao}
                    onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                    placeholder="Digite a função..."
                  />
                </div>
                <div>
                  <Label htmlFor="senioridade">Senioridade</Label>
                  <Select value={formData.senioridade} onValueChange={(value) => setFormData({ ...formData, senioridade: value as Member['senioridade'] })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a senioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Estagiário">Estagiário</SelectItem>
                      <SelectItem value="Júnior">Júnior</SelectItem>
                      <SelectItem value="Pleno">Pleno</SelectItem>
                      <SelectItem value="Sênior">Sênior</SelectItem>
                      <SelectItem value="Especialista">Especialista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="quadroCadastrado">Quadro Cadastrado</Label>
                  <Select value={formData.quadroCadastrado} onValueChange={(value) => setFormData({ ...formData, quadroCadastrado: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o quadro" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBoards.map((board) => (
                        <SelectItem key={board} value={board}>{board}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateMember}>
                  Cadastrar Membro
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mt-4 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar membros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {members.filter(m => m.status === 'Ativo').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sênior/Especialista</CardTitle>
              <User className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {members.filter(m => m.senioridade === 'Sênior' || m.senioridade === 'Especialista').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Júnior/Pleno</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {members.filter(m => m.senioridade === 'Júnior' || m.senioridade === 'Pleno').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Membros Cadastrados</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredMembers.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhum membro encontrado com esse termo.' : 'Nenhum membro cadastrado ainda.'}
                </p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{member.nome}</h3>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                        <Badge className={getSenioridadeColor(member.senioridade)}>
                          {member.senioridade}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Matrícula:</span> {member.matricula}
                        </div>
                        <div>
                          <span className="font-medium">Função:</span> {member.funcao}
                        </div>
                        <div>
                          <span className="font-medium">Quadro:</span> {member.quadroCadastrado}
                        </div>
                        <div>
                          <span className="font-medium">Cadastrado em:</span> {new Date(member.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(member)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Membro</DialogTitle>
            <DialogDescription>
              Altere os dados do membro da equipe. Todos os campos são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editNome">Nome Completo</Label>
              <Input
                id="editNome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Digite o nome completo..."
              />
            </div>
            <div>
              <Label htmlFor="editMatricula">Matrícula</Label>
              <Input
                id="editMatricula"
                value={formData.matricula}
                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                placeholder="Digite a matrícula..."
              />
            </div>
            <div>
              <Label htmlFor="editFuncao">Função</Label>
              <Input
                id="editFuncao"
                value={formData.funcao}
                onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                placeholder="Digite a função..."
              />
            </div>
            <div>
              <Label htmlFor="editSenioridade">Senioridade</Label>
              <Select value={formData.senioridade} onValueChange={(value) => setFormData({ ...formData, senioridade: value as Member['senioridade'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a senioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Estagiário">Estagiário</SelectItem>
                  <SelectItem value="Júnior">Júnior</SelectItem>
                  <SelectItem value="Pleno">Pleno</SelectItem>
                  <SelectItem value="Sênior">Sênior</SelectItem>
                  <SelectItem value="Especialista">Especialista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="editQuadroCadastrado">Quadro Cadastrado</Label>
              <Select value={formData.quadroCadastrado} onValueChange={(value) => setFormData({ ...formData, quadroCadastrado: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o quadro" />
                </SelectTrigger>
                <SelectContent>
                  {availableBoards.map((board) => (
                    <SelectItem key={board} value={board}>{board}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditMember}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}