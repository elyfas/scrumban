import { useState } from 'react';
import { Plus, Edit, Trash2, Search, FolderKanban } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface Board {
  id: string;
  nomeProjeto: string;
  createdAt: string;
  updatedAt: string;
  status: 'Ativo' | 'Inativo' | 'Arquivado';
  membersCount: number;
  cardsCount: number;
}

export function BoardManagement() {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: 'board-1',
      nomeProjeto: 'Sistema de E-commerce',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      status: 'Ativo',
      membersCount: 8,
      cardsCount: 25
    },
    {
      id: 'board-2',
      nomeProjeto: 'App Mobile Banking',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-10',
      status: 'Ativo',
      membersCount: 6,
      cardsCount: 18
    },
    {
      id: 'board-3',
      nomeProjeto: 'Portal do Cliente',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
      status: 'Arquivado',
      membersCount: 4,
      cardsCount: 12
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [formData, setFormData] = useState({
    nomeProjeto: ''
  });

  const filteredBoards = boards.filter(board =>
    board.nomeProjeto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBoard = () => {
    if (!formData.nomeProjeto.trim()) {
      toast.error('Nome do projeto é obrigatório');
      return;
    }

    const newBoard: Board = {
      id: `board-${Date.now()}`,
      nomeProjeto: formData.nomeProjeto.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'Ativo',
      membersCount: 0,
      cardsCount: 0
    };

    setBoards([...boards, newBoard]);
    setFormData({ nomeProjeto: '' });
    setIsCreateDialogOpen(false);
    toast.success('Quadro criado com sucesso!');
  };

  const handleEditBoard = () => {
    if (!formData.nomeProjeto.trim() || !editingBoard) {
      toast.error('Nome do projeto é obrigatório');
      return;
    }

    const updatedBoards = boards.map(board =>
      board.id === editingBoard.id
        ? {
            ...board,
            nomeProjeto: formData.nomeProjeto.trim(),
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : board
    );

    setBoards(updatedBoards);
    setFormData({ nomeProjeto: '' });
    setEditingBoard(null);
    setIsEditDialogOpen(false);
    toast.success('Quadro atualizado com sucesso!');
  };

  const handleDeleteBoard = (boardId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este quadro? Esta ação não pode ser desfeita.')) {
      setBoards(boards.filter(board => board.id !== boardId));
      toast.success('Quadro excluído com sucesso!');
    }
  };

  const openEditDialog = (board: Board) => {
    setEditingBoard(board);
    setFormData({ nomeProjeto: board.nomeProjeto });
    setIsEditDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Inativo':
        return 'bg-yellow-100 text-yellow-800';
      case 'Arquivado':
        return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-2xl font-bold text-gray-900">Cadastrar Quadro</h1>
            <p className="text-gray-600 mt-1">Gerencie os quadros Kanban do sistema</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Quadro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Quadro</DialogTitle>
                <DialogDescription>
                  Preencha o nome do projeto para criar um novo quadro Kanban.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nomeProjeto">Nome do Projeto</Label>
                  <Input
                    id="nomeProjeto"
                    value={formData.nomeProjeto}
                    onChange={(e) => setFormData({ ...formData, nomeProjeto: e.target.value })}
                    placeholder="Digite o nome do projeto..."
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateBoard}>
                    Criar Quadro
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mt-4 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar quadros..."
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Quadros</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{boards.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quadros Ativos</CardTitle>
              <FolderKanban className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {boards.filter(b => b.status === 'Ativo').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quadros Arquivados</CardTitle>
              <FolderKanban className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {boards.filter(b => b.status === 'Arquivado').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boards List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quadros Cadastrados</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredBoards.length === 0 ? (
              <div className="p-8 text-center">
                <FolderKanban className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhum quadro encontrado com esse termo.' : 'Nenhum quadro cadastrado ainda.'}
                </p>
              </div>
            ) : (
              filteredBoards.map((board) => (
                <div key={board.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{board.nomeProjeto}</h3>
                        <Badge className={getStatusColor(board.status)}>
                          {board.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Criado em:</span> {new Date(board.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className="font-medium">Atualizado em:</span> {new Date(board.updatedAt).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className="font-medium">Membros:</span> {board.membersCount}
                        </div>
                        <div>
                          <span className="font-medium">Cards:</span> {board.cardsCount}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(board)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBoard(board.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Quadro</DialogTitle>
            <DialogDescription>
              Altere o nome do projeto para atualizar o quadro Kanban.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editNomeProjeto">Nome do Projeto</Label>
              <Input
                id="editNomeProjeto"
                value={formData.nomeProjeto}
                onChange={(e) => setFormData({ ...formData, nomeProjeto: e.target.value })}
                placeholder="Digite o nome do projeto..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditBoard}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}