import { useState } from 'react';
import { SprintFilterOptions, Sprint } from '../types/kanban';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Filter, X, Search, ArrowUpDown, ArrowUpAZ, ArrowDownZA } from 'lucide-react';

interface SprintFiltersProps {
  filters: SprintFilterOptions;
  onFiltersChange: (filters: SprintFilterOptions) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
}

const statusLabels: Record<Sprint['status'], string> = {
  planning: 'Planejamento',
  active: 'Ativa',
  completed: 'Concluída',
  cancelled: 'Cancelada'
};

const statusColors: Record<Sprint['status'], string> = {
  planning: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800'
};

export function SprintFilters({ filters, onFiltersChange, sortOrder, onSortOrderChange }: SprintFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = <K extends keyof SprintFilterOptions>(
    key: K,
    value: SprintFilterOptions[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <T,>(
    currentArray: T[],
    item: T,
    key: keyof SprintFilterOptions
  ) => {
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateFilter(key, newArray as SprintFilterOptions[typeof key]);
  };

  const getActiveFiltersCount = () => {
    return (
      filters.status.length +
      (filters.searchText ? 1 : 0)
    );
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: [],
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
          placeholder="Buscar sprints..."
          value={filters.searchText}
          onChange={(e) => updateFilter('searchText', e.target.value)}
          className="pl-9 w-64 h-8 bg-white border-slate-200 focus:border-blue-500"
        />
      </div>

      {/* Sort Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="flex items-center gap-2"
        title={`Ordenar ${sortOrder === 'asc' ? 'Z-A' : 'A-Z'}`}
      >
        {sortOrder === 'asc' ? (
          <ArrowUpAZ className="w-4 h-4" />
        ) : (
          <ArrowDownZA className="w-4 h-4" />
        )}
        {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
      </Button>

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

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status da Sprint</Label>
              <div className="space-y-2">
                {(Object.keys(statusLabels) as Sprint['status'][]).map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={filters.status.includes(status)}
                      onCheckedChange={() => toggleArrayFilter(filters.status, status, 'status')}
                    />
                    <label
                      htmlFor={`status-${status}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>
                        {statusLabels[status]}
                      </span>
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
          {filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="text-xs">
              Status: {statusLabels[status]}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive" 
                onClick={() => toggleArrayFilter(filters.status, status, 'status')}
              />
            </Badge>
          ))}
          {filters.searchText && (
            <Badge variant="secondary" className="text-xs">
              Busca: "{filters.searchText}"
              <X 
                className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive" 
                onClick={() => updateFilter('searchText', '')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}