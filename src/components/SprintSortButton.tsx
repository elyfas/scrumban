import { Button } from './ui/button';
import { ArrowUpAZ, ArrowDownZA } from 'lucide-react';

interface SprintSortButtonProps {
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
}

export function SprintSortButton({ sortOrder, onSortOrderChange }: SprintSortButtonProps) {
  return (
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
  );
}