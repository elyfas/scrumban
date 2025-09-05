import { useState } from 'react';
import { Plus, Edit, Save, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner@2.0.3';
import { Sprint } from '../types/kanban';
import { mockSprints } from '../constants/kanban';

// Mock format function for date formatting since date-fns is not available
const format = (date: Date, formatStr: string, options?: any) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  if (formatStr === 'dd/MM/yyyy') {
    return `${day}/${month}/${year}`;
  }
  
  return date.toLocaleDateString('pt-BR');
};

interface SprintSchedulerProps {
  sprints?: Sprint[];
  onSprintUpdate?: (sprint: Sprint) => void;
  onSprintCreate?: (sprint: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function SprintScheduler({ 
  sprints = mockSprints, 
  onSprintUpdate,
  onSprintCreate 
}: SprintSchedulerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    status: 'planning' as Sprint['status'],
    teamMembers: [] as string[],
    storyPointsPerDeveloper: 8,
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      goal: '',
      startDate: undefined,
      endDate: undefined,
      status: 'planning',
      teamMembers: [],
      storyPointsPerDeveloper: 8,
    });
  };

  // Validate dates
  const validateDates = (start: Date | undefined, end: Date | undefined) => {
    if (!start || !end) return { isValid: false, message: 'Datas de início e fim são obrigatórias' };
    if (start >= end) return { isValid: false, message: 'Data de início deve ser anterior à data de fim' };
    
    // Check for overlapping sprints
    const overlapping = sprints.find(sprint => {
      if (editingSprint && sprint.id === editingSprint.id) return false;
      const sprintStart = new Date(sprint.startDate);
      const sprintEnd = new Date(sprint.endDate);
      return (start < sprintEnd && end > sprintStart);
    });
    
    if (overlapping) {
      return { 
        isValid: false, 
        message: `Período conflita com "${overlapping.name}"` 
      };
    }
    
    return { isValid: true, message: '' };
  };

  // Handle create/edit sprint
  const handleSaveSprint = () => {
    const { name, goal, startDate, endDate, status, teamMembers, storyPointsPerDeveloper } = formData;
    
    if (!name.trim()) {
      toast.error('Nome da sprint é obrigatório');
      return;
    }
    
    if (!goal.trim()) {
      toast.error('Objetivo da sprint é obrigatório');
      return;
    }
    
    const dateValidation = validateDates(startDate, endDate);
    if (!dateValidation.isValid) {
      toast.error(dateValidation.message);
      return;
    }
    
    if (teamMembers.length === 0) {
      toast.error('Pelo menos um membro da equipe deve ser selecionado');
      return;
    }

    const sprintData = {
      name: name.trim(),
      goal: goal.trim(),
      startDate: startDate!,
      endDate: endDate!,
      status,
      cards: [],
      teamMembers,
      absentMembers: [],
      storyPointsPerDeveloper,
      capacity: teamMembers.length * storyPointsPerDeveloper,
    };

    if (editingSprint) {
      const updatedSprint = {
        ...editingSprint,
        ...sprintData,
        updatedAt: new Date(),
      };
      onSprintUpdate?.(updatedSprint);
      toast.success('Sprint atualizada com sucesso');
      setEditingSprint(null);
    } else {
      onSprintCreate?.(sprintData);
      toast.success('Sprint criada com sucesso');
      setIsCreateDialogOpen(false);
    }
    
    resetForm();
  };

  // Start editing
  const startEditing = (sprint: Sprint) => {
    setEditingSprint(sprint);
    setFormData({
      name: sprint.name,
      goal: sprint.goal,
      startDate: new Date(sprint.startDate),
      endDate: new Date(sprint.endDate),
      status: sprint.status,
      teamMembers: [...sprint.teamMembers],
      storyPointsPerDeveloper: sprint.storyPointsPerDeveloper,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSprint(null);
    resetForm();
  };

  // Available team members (mock data)
  const availableMembers = [
    'João Silva',
    'Ana Costa', 
    'Carlos Oliveira',
    'Maria Santos',
    'Pedro Lima',
    'Fernanda Souza',
    'Rafael Santos',
    'Juliana Lima'
  ];

  // Get sprint duration in days
  const getSprintDuration = (start: Date, end: Date) => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Check for schedule conflicts
  const getScheduleConflicts = () => {
    const conflicts = [];
    if (!sprints || sprints.length < 2) return conflicts;
    
    const sortedSprints = [...sprints].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    for (let i = 0; i < sortedSprints.length - 1; i++) {
      const current = sortedSprints[i];
      const next = sortedSprints[i + 1];
      
      if (new Date(current.endDate) > new Date(next.startDate)) {
        conflicts.push({
          sprint1: current.name,
          sprint2: next.name,
          type: 'overlap' as const
        });
      }
      
      // Check for gaps (weekends are OK, but large gaps might be worth noting)
      const gap = Math.ceil((new Date(next.startDate).getTime() - new Date(current.endDate).getTime()) / (1000 * 60 * 60 * 24));
      if (gap > 7) {
        conflicts.push({
          sprint1: current.name,
          sprint2: next.name,
          type: 'gap' as const,
          days: gap
        });
      }
    }

    return conflicts;
  };

  const conflicts = getScheduleConflicts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Planejamento de Sprints</h2>
          <p className="text-gray-600 text-sm mt-1">Gerencie o cronograma e datas das sprints</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nova Sprint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Sprint</DialogTitle>
              <DialogDescription>
                Configure as informações básicas da nova sprint
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Sprint</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Sprint 1 - Janeiro 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: Sprint['status']) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planejamento</SelectItem>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="goal">Objetivo da Sprint</Label>
                <Textarea
                  id="goal"
                  value={formData.goal}
                  onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                  placeholder="Descreva o objetivo principal desta sprint..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        {formData.startDate ? format(formData.startDate, 'dd/MM/yyyy') : 'Selecionar data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label>Data de Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        {formData.endDate ? format(formData.endDate, 'dd/MM/yyyy') : 'Selecionar data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Membros da Equipe</Label>
                  <Select 
                    value=""
                    onValueChange={(member) => {
                      if (!formData.teamMembers.includes(member)) {
                        setFormData(prev => ({
                          ...prev,
                          teamMembers: [...prev.teamMembers, member]
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Adicionar membro" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMembers
                        .filter(member => !formData.teamMembers.includes(member))
                        .map(member => (
                          <SelectItem key={member} value={member}>
                            {member}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.teamMembers.map(member => (
                      <Badge key={member} variant="secondary" className="text-xs">
                        {member}
                        <button
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            teamMembers: prev.teamMembers.filter(m => m !== member)
                          }))}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="points">Story Points por Dev</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.storyPointsPerDeveloper}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      storyPointsPerDeveloper: parseInt(e.target.value) || 8 
                    }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Capacidade total: {formData.teamMembers.length * formData.storyPointsPerDeveloper} pts
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveSprint}>
                Criar Sprint
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Schedule Conflicts Alert */}
      {conflicts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800 text-lg">
              <AlertTriangle className="w-5 h-5" />
              Conflitos no Cronograma
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {conflicts.map((conflict, index) => (
                <div key={index} className="text-sm text-orange-700">
                  {conflict.type === 'overlap' ? (
                    <span>⚠️ Sobreposição entre "{conflict.sprint1}" e "{conflict.sprint2}"</span>
                  ) : (
                    <span>📅 Intervalo de {'days' in conflict ? conflict.days : 0} dias entre "{conflict.sprint1}" e "{conflict.sprint2}"</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sprints List */}
      <div className="space-y-4">
        {sprints
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .map((sprint) => (
            <Card key={sprint.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {editingSprint?.id === sprint.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nome da sprint"
                      />
                      <Select 
                        value={formData.status} 
                        onValueChange={(value: Sprint['status']) => setFormData(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planejamento</SelectItem>
                          <SelectItem value="active">Ativa</SelectItem>
                          <SelectItem value="completed">Concluída</SelectItem>
                          <SelectItem value="cancelled">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Textarea
                      value={formData.goal}
                      onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                      placeholder="Objetivo da sprint"
                      rows={2}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left">
                            {formData.startDate ? format(formData.startDate, 'dd/MM/yyyy') : 'Data início'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left">
                            {formData.endDate ? format(formData.endDate, 'dd/MM/yyyy') : 'Data fim'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={cancelEditing}>
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={handleSaveSprint}>
                        <Save className="w-4 h-4 mr-1" />
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{sprint.name}</h3>
                        <Badge variant={
                          sprint.status === 'active' ? 'default' :
                          sprint.status === 'completed' ? 'outline' :
                          sprint.status === 'cancelled' ? 'destructive' : 'secondary'
                        }>
                          {sprint.status === 'planning' ? 'Planejamento' :
                           sprint.status === 'active' ? 'Ativa' :
                           sprint.status === 'completed' ? 'Concluída' : 'Cancelada'}
                        </Badge>
                        {sprint.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{sprint.goal}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          {format(new Date(sprint.startDate), 'dd/MM/yyyy')} - {format(new Date(sprint.endDate), 'dd/MM/yyyy')}
                        </span>
                        <span>
                          {getSprintDuration(new Date(sprint.startDate), new Date(sprint.endDate))} dias
                        </span>
                        <span>
                          {sprint.teamMembers.length} desenvolvedores
                        </span>
                        <span>
                          {sprint.capacity} story points
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(sprint)}
                      className="ml-4"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}