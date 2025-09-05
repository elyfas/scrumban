export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type IssueType = 'story' | 'bug' | 'task' | 'epic';
export type Status = 
  | 'backlog' 
  | 'planejado' 
  | 'em-execucao' 
  | 'em-espera' 
  | 'em-teste' 
  | 'aguardando-validacao-tecnica' 
  | 'aguardando-aceitacao' 
  | 'aceito-aguardando-integracao' 
  | 'aguardando-homologacao' 
  | 'homologado-aguardando-publicacao' 
  | 'finalizado';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TestScenario {
  id: string;
  title: string;
  description: string;
  expectedResult: string;
  actualResult?: string;
  status: 'pending' | 'passed' | 'failed';
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited: boolean;
}

export interface HistoryEntry {
  id: string;
  action: string;
  description: string;
  author: string;
  timestamp: Date;
  field?: string;
  oldValue?: string;
  newValue?: string;
}

export interface KanbanCard {
  id: string;
  cardNumber: number; // ID exclusivo numérico do card
  clientCardId?: string; // ID Quadro Cliente (opcional)
  title: string;
  description: string;
  storyPoints?: number;
  priority: Priority;
  assignee: string;
  reporter: string;
  issueType: IssueType;
  labels: string[];
  sprint?: string;
  status: Status;
  createdAt: Date;
  plannedDueDate?: Date;
  actualDueDate?: Date;
  attachments: Attachment[];
  acceptanceCriteria: ChecklistItem[];
  definitionOfReady: ChecklistItem[];
  definitionOfDone: ChecklistItem[];
  testScenarios: TestScenario[];
  developmentLinks: {
    branch?: string;
    pullRequest?: string;
    commits: string[];
  };
  comments: Comment[];
  history: HistoryEntry[];
}

export interface KanbanColumn {
  id: Status;
  title: string;
  cards: KanbanCard[];
  color: string;
}

export interface FilterOptions {
  priority: Priority[];
  assignee: string[];
  issueType: IssueType[];
  sprint: string[];
  label: string[];
  searchText: string;
}

export type ViewMode = 'compact' | 'expanded';

export interface SprintOption {
  id: string;
  name: string;
  isActive: boolean;
}

export interface AbsentMember {
  name: string;
  type: 'partial' | 'total'; // partial maintains 8 points, total removes 8 points
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  cards: KanbanCard[];
  teamMembers: string[]; // List of team member names
  absentMembers: AbsentMember[]; // List of absent members with absence type
  storyPointsPerDeveloper: number; // Default 8 story points per developer
  capacity: number; // Total sprint capacity in story points
  createdAt: Date;
  updatedAt: Date;
}

export interface SprintFilterOptions {
  status: Sprint['status'][];
  searchText: string;
}

export type MemberRole = 'Desenvolvedor' | 'Scrum Master' | 'Product Owner' | 'Tester' | 'Tech Lead' | 'Designer';

export interface TeamMember {
  id: string;
  name: string;
  role: MemberRole;
  email: string;
  isActive: boolean;
}