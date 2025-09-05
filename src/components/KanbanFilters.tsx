import { useState } from 'react';
import { FilterOptions, Priority, IssueType } from '../types/kanban';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Filter, X, Search } from 'lucide-react';

interface KanbanFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableAssignees: string[];
  availableSprints: string[];
  availableLabels: string[];
}

const priorityLabels: Record<Priority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica'
};

const issueTypeLabels: Record<IssueType, string> = {
  story: 'Story',
  bug: 'Bug',
  task: 'Task',
  epic: 'Epic'
};

export function KanbanFilters({ filters, onFiltersChange, availableAssignees, availableSprints, availableLabels }: KanbanFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <T,>(
    currentArray: T[],
    item: T,
    key: keyof FilterOptions
  ) => {
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateFilter(key, newArray as FilterOptions[typeof key]);
  };

  const getActiveFiltersCount = () => {
    return (
      filters.priority.length +
      filters.assignee.length +
      filters.issueType.length +
      filters.sprint.length +
      filters.label.length +
      (filters.searchText ? 1 : 0)
    );
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priority: [],
      assignee: [],
      issueType: [],
      sprint: [],
      label: [],
      searchText: ''
    });
  };

  const activeCount = getActiveFiltersCount();

  return (
    <div className="flex items-center gap-2">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Buscar issues..."
          value={filters.searchText}
          onChange={(e) => updateFilter('searchText', e.target.value)}
          className="pl-9 w-64 h-8 bg-white border-slate-200 focus:border-blue-500"
        />
      </div>

      {/* Filters Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {activeCount > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filtros</h4>
              {activeCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Limpar
                </Button>
              )}
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Prioridade</Label>
              <div className="space-y-2">
                {(Object.keys(priorityLabels) as Priority[]).map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={filters.priority.includes(priority)}
                      onCheckedChange={() => toggleArrayFilter(filters.priority, priority, 'priority')}
                    />
                    <label
                      htmlFor={`priority-${priority}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {priorityLabels[priority]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Issue Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo de Issue</Label>
              <div className="space-y-2">
                {(Object.keys(issueTypeLabels) as IssueType[]).map((issueType) => (
                  <div key={issueType} className="flex items-center space-x-2">
                    <Checkbox
                      id={`issue-${issueType}`}
                      checked={filters.issueType.includes(issueType)}
                      onCheckedChange={() => toggleArrayFilter(filters.issueType, issueType, 'issueType')}
                    />
                    <label
                      htmlFor={`issue-${issueType}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {issueTypeLabels[issueType]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignee Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Responsável</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableAssignees.map((assignee) => (
                  <div key={assignee} className="flex items-center space-x-2">
                    <Checkbox
                      id={`assignee-${assignee}`}
                      checked={filters.assignee.includes(assignee)}
                      onCheckedChange={() => toggleArrayFilter(filters.assignee, assignee, 'assignee')}
                    />
                    <label
                      htmlFor={`assignee-${assignee}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {assignee}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sprint Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sprint</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableSprints.map((sprint) => (
                  <div key={sprint} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sprint-${sprint}`}
                      checked={filters.sprint.includes(sprint)}
                      onCheckedChange={() => toggleArrayFilter(filters.sprint, sprint, 'sprint')}
                    />
                    <label
                      htmlFor={`sprint-${sprint}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {sprint}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Label Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Labels</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableLabels.map((label) => (
                  <div key={label} className="flex items-center space-x-2">
                    <Checkbox
                      id={`label-${label}`}
                      checked={filters.label.includes(label)}
                      onCheckedChange={() => toggleArrayFilter(filters.label, label, 'label')}
                    />
                    <label
                      htmlFor={`label-${label}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filters Display */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.priority.map((priority) => (
            <Badge key={priority} variant="secondary" className="text-xs">
              {priorityLabels[priority]}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive" 
                onClick={() => toggleArrayFilter(filters.priority, priority, 'priority')}
              />
            </Badge>
          ))}
          {filters.issueType.map((issueType) => (
            <Badge key={issueType} variant="secondary" className="text-xs">
              {issueTypeLabels[issueType]}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive" 
                onClick={() => toggleArrayFilter(filters.issueType, issueType, 'issueType')}
              />
            </Badge>
          ))}
          {filters.assignee.map((assignee) => (
            <Badge key={assignee} variant="secondary" className="text-xs">
              {assignee}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive" 
                onClick={() => toggleArrayFilter(filters.assignee, assignee, 'assignee')}
              />
            </Badge>
          ))}
          {filters.sprint.map((sprint) => (
            <Badge key={sprint} variant="secondary" className="text-xs">
              Sprint: {sprint}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive" 
                onClick={() => toggleArrayFilter(filters.sprint, sprint, 'sprint')}
              />
            </Badge>
          ))}
          {filters.label.map((label) => (
            <Badge key={label} variant="secondary" className="text-xs">
              {label}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive" 
                onClick={() => toggleArrayFilter(filters.label, label, 'label')}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}