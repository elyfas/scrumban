import { KanbanCard, KanbanColumn as KanbanColumnType, FilterOptions, Status, TeamMember } from '../types/kanban';

export const getUniqueAssignees = (columns: KanbanColumnType[]): string[] => {
  const assignees = new Set<string>();
  columns.forEach(column => {
    column.cards.forEach(card => {
      assignees.add(card.assignee);
    });
  });
  return Array.from(assignees);
};

export const getUniqueSprints = (columns: KanbanColumnType[]): string[] => {
  const sprints = new Set<string>();
  columns.forEach(column => {
    column.cards.forEach(card => {
      if (card.sprint) {
        sprints.add(card.sprint);
      }
    });
  });
  return Array.from(sprints);
};

export const getUniqueLabels = (columns: KanbanColumnType[]): string[] => {
  const labels = new Set<string>();
  columns.forEach(column => {
    column.cards.forEach(card => {
      card.labels.forEach(label => labels.add(label));
    });
  });
  return Array.from(labels);
};

export const filterCard = (card: KanbanCard, filters: FilterOptions, selectedSprint: string): boolean => {
  // Sprint filter (from dropdown)
  if (selectedSprint !== 'all' && card.sprint !== selectedSprint) {
    return false;
  }
  
  // Priority filter
  if (filters.priority.length > 0 && !filters.priority.includes(card.priority)) {
    return false;
  }
  
  // Assignee filter
  if (filters.assignee.length > 0 && !filters.assignee.includes(card.assignee)) {
    return false;
  }
  
  // Issue type filter
  if (filters.issueType.length > 0 && !filters.issueType.includes(card.issueType)) {
    return false;
  }
  
  // Sprint filter (from filters)
  if (filters.sprint.length > 0 && (!card.sprint || !filters.sprint.includes(card.sprint))) {
    return false;
  }
  
  // Label filter
  if (filters.label.length > 0 && !card.labels.some(label => filters.label.includes(label))) {
    return false;
  }
  
  // Search text filter
  if (filters.searchText) {
    const searchLower = filters.searchText.toLowerCase();
    const matchesTitle = card.title.toLowerCase().includes(searchLower);
    const matchesDescription = card.description.toLowerCase().includes(searchLower);
    const matchesLabels = card.labels.some(label => label.toLowerCase().includes(searchLower));
    
    if (!matchesTitle && !matchesDescription && !matchesLabels) {
      return false;
    }
  }
  
  return true;
};

export const initializeColumnsWithCards = (columns: KanbanColumnType[], cards: KanbanCard[]): KanbanColumnType[] => {
  return columns.map(column => ({
    ...column,
    cards: cards.filter(card => card.status === column.id)
  }));
};

export const setCompletionDateIfFinalized = (card: KanbanCard): KanbanCard => {
  if (card.status === 'finalizado' && !card.actualDueDate) {
    return { ...card, actualDueDate: new Date() };
  }
  return card;
};

export const getNextCardNumber = (columns: KanbanColumnType[]): number => {
  let maxNumber = 0;
  columns.forEach(column => {
    column.cards.forEach(card => {
      if (card.cardNumber > maxNumber) {
        maxNumber = card.cardNumber;
      }
    });
  });
  return maxNumber + 1;
};

// Função para validar se um membro pode mover um card de um status para outro
export const canMoveCard = (
  card: KanbanCard,
  fromStatus: Status,
  toStatus: Status,
  currentUser: TeamMember
): { canMove: boolean; reason?: string } => {
  // Se o usuário não é desenvolvedor, pode mover qualquer card para qualquer status
  if (currentUser.role !== 'Desenvolvedor') {
    return { canMove: true };
  }

  // Se não é uma história de usuário, bug ou task, desenvolvedores não podem mover
  if (!['story', 'bug', 'task'].includes(card.issueType)) {
    return { 
      canMove: false, 
      reason: 'Desenvolvedores podem mover apenas História de Usuário, Bug e Task.' 
    };
  }

  // Fluxos permitidos para desenvolvedores com histórias de usuário
  const allowedTransitions: { [key in Status]?: Status[] } = {
    'planejado': ['em-execucao'],
    'em-execucao': ['em-espera', 'em-teste'],
    'em-espera': ['em-execucao'],
    'em-teste': ['aguardando-validacao-tecnica']
  };

  const allowedTargets = allowedTransitions[fromStatus];
  
  if (!allowedTargets || !allowedTargets.includes(toStatus)) {
    return {
      canMove: false,
      reason: `Desenvolvedores não podem mover este item de ${getStatusDisplayName(fromStatus)} para ${getStatusDisplayName(toStatus)}. Fluxo permitido: Planejado → Em Execução → Em Espera → Em Execução → Em Teste → Aguardando Validação Técnica.`
    };
  }

  return { canMove: true };
};

// Função auxiliar para obter o nome de exibição do status
const getStatusDisplayName = (status: Status): string => {
  const statusNames: { [key in Status]: string } = {
    'backlog': 'Backlog',
    'planejado': 'Planejado',
    'em-execucao': 'Em Execução',
    'em-espera': 'Em Espera',
    'em-teste': 'Em Teste',
    'aguardando-validacao-tecnica': 'Aguardando Validação Técnica',
    'aguardando-aceitacao': 'Aguardando Aceitação',
    'aceito-aguardando-integracao': 'Aceito / Aguardando Integração',
    'aguardando-homologacao': 'Aguardando Homologação',
    'homologado-aguardando-publicacao': 'Homologado / Aguardando Publicação',
    'finalizado': 'Finalizado'
  };
  
  return statusNames[status] || status;
};