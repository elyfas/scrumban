import { Search, Filter, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Priority, IssueType } from '../types/kanban';

export interface BacklogFilterOptions {
  searchText: string;
  status: ('backlog' | 'planned' | 'cancelled')[];
  priority: Priority[];
  type: IssueType[];
  assignee: string[];
}

interface BacklogFiltersProps {
  filters: BacklogFilterOptions;
  onFiltersChange: (filters: BacklogFilterOptions) => void;
  availableAssignees?: string[];
}

export function BacklogFilters({ filters, onFiltersChange, availableAssignees = [] }: BacklogFiltersProps) {
  const updateFilters = (updates: Partial<BacklogFilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchText: '',
      status: [],
      priority: [],
      type: [],
      assignee: []
    });
  };

  const toggleArrayFilter = <T extends string>(
    key: keyof BacklogFilterOptions,
    value: T
  ) => {
    const currentArray = filters[key] as T[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters({ [key]: newArray });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.status.length +
      filters.priority.length +
      filters.type.length +
      filters.assignee.length +
      (filters.searchText ? 1 : 0)
    );
  };

  const statusOptions = [
    { value: 'backlog' as const, label: 'Status Backlog', color: 'bg-gray-100 text-gray-800' },
    { value: 'planned' as const, label: 'Histórias Planejadas', color: 'bg-blue-100 text-blue-800' },
    { value: 'cancelled' as const, label: 'Histórias Canceladas', color: 'bg-red-100 text-red-800' }
  ];

  const priorityOptions = [
    { value: 'low' as const, label: 'Baixa', color: 'bg-green-100 text-green-800' },
    { value: 'medium' as const, label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high' as const, label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical' as const, label: 'Crítica', color: 'bg-red-100 text-red-800' }
  ];

  const typeOptions = [
    { value: 'story' as const, label: 'História', icon: '📖' },
    { value: 'bug' as const, label: 'Bug', icon: '🐛' },
    { value: 'task' as const, label: 'Tarefa', icon: '✓' },
    { value: 'epic' as const, label: 'Épico', icon: '⚡' }
  ];

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar histórias por título ou descrição..."
          value={filters.searchText}
          onChange={(e) => updateFilters({ searchText: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Quick Status Filter */}
      <Select
        value={filters.status.length === 1 ? filters.status[0] : ''}
        onValueChange={(value) => {
          if (value === 'all') {
            updateFilters({ status: [] });
          } else {
            updateFilters({ status: [value as 'backlog' | 'planned' | 'cancelled'] });
          }
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Status das Histórias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Histórias</SelectItem>
          {statusOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Advanced Filters */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="w-4 h-4 mr-2" />
            Filtros Avançados
            {getActiveFiltersCount() > 0 && (
              <Badge className="ml-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filtros Avançados</h4>
              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Limpar
                </Button>
              )}
            </div>

            {/* Status Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Status</Label>
              <div className="space-y-2">
                {statusOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${option.value}`}
                      checked={filters.status.includes(option.value)}
                      onCheckedChange={() => toggleArrayFilter('status', option.value)}
                    />
                    <Label htmlFor={`status-${option.value}`} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Prioridade</Label>
              <div className="space-y-2">
                {priorityOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${option.value}`}
                      checked={filters.priority.includes(option.value)}
                      onCheckedChange={() => toggleArrayFilter('priority', option.value)}
                    />
                    <Label htmlFor={`priority-${option.value}`} className="text-sm flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${option.color.split(' ')[0]}`}></span>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Tipo</Label>
              <div className="space-y-2">
                {typeOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${option.value}`}
                      checked={filters.type.includes(option.value)}
                      onCheckedChange={() => toggleArrayFilter('type', option.value)}
                    />
                    <Label htmlFor={`type-${option.value}`} className="text-sm flex items-center">
                      <span className="mr-2">{option.icon}</span>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignee Filter */}
            {availableAssignees.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Responsável</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableAssignees.map(assignee => (
                    <div key={assignee} className="flex items-center space-x-2">
                      <Checkbox
                        id={`assignee-${assignee}`}
                        checked={filters.assignee.includes(assignee)}
                        onCheckedChange={() => toggleArrayFilter('assignee', assignee)}
                      />
                      <Label htmlFor={`assignee-${assignee}`} className="text-sm">
                        {assignee}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Filtros:</span>
          <div className="flex gap-1">
            {filters.searchText && (
              <Badge variant="secondary" className="text-xs">
                Busca: "{filters.searchText.slice(0, 20)}${filters.searchText.length > 20 ? '...' : ''}"
              </Badge>
            )}
            {filters.status.map(status => (
              <Badge key={status} variant="secondary" className="text-xs">
                {statusOptions.find(opt => opt.value === status)?.label}
              </Badge>
            ))}
            {filters.priority.map(priority => (
              <Badge key={priority} variant="secondary" className="text-xs">
                {priorityOptions.find(opt => opt.value === priority)?.label}
              </Badge>
            ))}
            {filters.type.map(type => (
              <Badge key={type} variant="secondary" className="text-xs">
                {typeOptions.find(opt => opt.value === type)?.label}
              </Badge>
            ))}
            {filters.assignee.map(assignee => (
              <Badge key={assignee} variant="secondary" className="text-xs">
                {assignee}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}