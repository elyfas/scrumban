import { KanbanCard, KanbanColumn as KanbanColumnType, SprintOption, Sprint, TeamMember } from '../types/kanban';

export const initialColumns: KanbanColumnType[] = [
  { id: 'backlog', title: 'Backlog', cards: [], color: 'border-slate-200 bg-slate-50' },
  { id: 'planejado', title: 'Planejado', cards: [], color: 'border-blue-200 bg-blue-50' },
  { id: 'em-execucao', title: 'Em execução', cards: [], color: 'border-yellow-200 bg-yellow-50' },
  { id: 'em-espera', title: 'Em espera', cards: [], color: 'border-orange-200 bg-orange-50' },
  { id: 'em-teste', title: 'Em teste', cards: [], color: 'border-purple-200 bg-purple-50' },
  { id: 'aguardando-validacao-tecnica', title: 'Aguardando validação técnica', cards: [], color: 'border-pink-200 bg-pink-50' },
  { id: 'aguardando-aceitacao', title: 'Aguardando aceitação', cards: [], color: 'border-indigo-200 bg-indigo-50' },
  { id: 'aceito-aguardando-integracao', title: 'Aceito / Aguardando integração', cards: [], color: 'border-cyan-200 bg-cyan-50' },
  { id: 'aguardando-homologacao', title: 'Aguardando homologação', cards: [], color: 'border-teal-200 bg-teal-50' },
  { id: 'homologado-aguardando-publicacao', title: '(Homologado) Aguardando publicação', cards: [], color: 'border-lime-200 bg-lime-50' },
  { id: 'finalizado', title: 'Finalizado', cards: [], color: 'border-green-200 bg-green-50' }
];

export const mockCards: KanbanCard[] = [
  {
    id: '1',
    cardNumber: 1,
    clientCardId: 'CLI-2024-001',
    title: 'Dashboard Analytics Widget',
    description: 'Implement analytics widget for the main dashboard showing key metrics and charts',
    storyPoints: 8,
    priority: 'high',
    assignee: 'João Silva',
    reporter: 'Maria Santos',
    issueType: 'story',
    status: 'planejado',
    labels: ['frontend', 'dashboard', 'analytics'],
    createdAt: new Date('2024-01-15'),
    attachments: [],
    plannedDueDate: new Date('2024-02-15'),
    acceptanceCriteria: [
      { id: '1', text: 'Display real-time metrics on dashboard', completed: false },
      { id: '2', text: 'Include interactive charts (line, bar, pie)', completed: false },
      { id: '3', text: 'Data updates automatically every 5 minutes', completed: false },
      { id: '4', text: 'Responsive design for mobile devices', completed: false }
    ],
    definitionOfReady: [
      { id: '1', text: 'Requirements are clear and documented', completed: true },
      { id: '2', text: 'Design mockups are approved', completed: true },
      { id: '3', text: 'API endpoints are defined', completed: false }
    ],
    definitionOfDone: [
      { id: '1', text: 'Code is reviewed and approved', completed: false },
      { id: '2', text: 'Unit tests are written and passing', completed: false },
      { id: '3', text: 'Integration tests are passing', completed: false },
      { id: '4', text: 'Documentation is updated', completed: false }
    ],
    testScenarios: [
      {
        id: '1',
        title: 'Successful Registration',
        description: 'Test user registration with valid credentials',
        expectedResult: 'User account is created and verification email is sent',
        status: 'pending'
      }
    ],
    developmentLinks: {
      branch: 'feature/user-auth',
      commits: []
    },
    comments: [
      {
        id: '1',
        text: 'Iniciando desenvolvimento do widget de analytics. Vou usar Chart.js para os gráficos.',
        author: 'João Silva',
        createdAt: new Date('2024-01-16T10:30:00'),
        isEdited: false
      },
      {
        id: '2',
        text: 'Certifique-se de que os dados sejam atualizados em tempo real. A performance é crucial aqui.',
        author: 'Maria Santos',
        createdAt: new Date('2024-01-16T14:15:00'),
        isEdited: false
      }
    ],
    history: [
      {
        id: '1',
        action: 'criacao',
        description: 'Card criado',
        author: 'Maria Santos',
        timestamp: new Date('2024-01-15T09:00:00'),
        field: 'status',
        newValue: 'backlog'
      },
      {
        id: '2',
        action: 'atualizacao',
        description: 'Prioridade alterada de média para alta',
        author: 'Maria Santos',
        timestamp: new Date('2024-01-15T15:30:00'),
        field: 'priority',
        oldValue: 'medium',
        newValue: 'high'
      },
      {
        id: '3',
        action: 'atualizacao',
        description: 'Responsável atribuído',
        author: 'Maria Santos',
        timestamp: new Date('2024-01-16T08:00:00'),
        field: 'assignee',
        newValue: 'João Silva'
      }
    ]
  },
  {
    id: '2',
    cardNumber: 2,
    title: 'Report Generation System',
    description: 'Implement automated report generation with PDF export and email scheduling',
    storyPoints: 3,
    priority: 'critical',
    assignee: 'Ana Costa',
    reporter: 'Pedro Lima',
    issueType: 'bug',
    status: 'em-execucao',
    labels: ['backend', 'reports', 'pdf'],
    sprint: 'Sprint 1 - Jan 2024',
    createdAt: new Date('2024-01-10'),
    attachments: [],
    plannedDueDate: new Date('2024-01-20'),
    acceptanceCriteria: [
      { id: '1', text: 'Generate PDF reports from dashboard data', completed: true },
      { id: '2', text: 'Schedule automated report emails', completed: false },
      { id: '3', text: 'Support multiple report formats', completed: true }
    ],
    definitionOfReady: [
      { id: '1', text: 'Bug is reproduced', completed: true },
      { id: '2', text: 'Root cause is identified', completed: true }
    ],
    definitionOfDone: [
      { id: '1', text: 'Bug is fixed', completed: true },
      { id: '2', text: 'Fix is tested', completed: false },
      { id: '3', text: 'Regression tests added', completed: false }
    ],
    testScenarios: [
      {
        id: '1',
        title: 'Form Submission Test',
        description: 'Submit contact form with valid data',
        expectedResult: 'Email is sent and success message appears',
        status: 'passed'
      },
      {
        id: '2',
        title: 'Error Handling Test',
        description: 'Test form submission with server error',
        expectedResult: 'Error message is displayed to user',
        status: 'failed'
      }
    ],
    developmentLinks: {
      branch: 'bugfix/contact-form-email',
      pullRequest: 'PR-123',
      commits: ['fix: resolve email sending issue', 'test: add email service tests']
    },
    comments: [
      {
        id: '1',
        text: 'Bug reproduzido com sucesso. O problema está na configuração SMTP.',
        author: 'Ana Costa',
        createdAt: new Date('2024-01-11T09:15:00'),
        isEdited: false
      },
      {
        id: '2',
        text: 'Correção implementada e testada. Aguardando aprovação do PR.',
        author: 'Ana Costa',
        createdAt: new Date('2024-01-12T16:45:00'),
        isEdited: false
      }
    ],
    history: [
      {
        id: '1',
        action: 'criacao',
        description: 'Card criado',
        author: 'Pedro Lima',
        timestamp: new Date('2024-01-10T14:30:00'),
        field: 'status',
        newValue: 'backlog'
      },
      {
        id: '2',
        action: 'mudanca_status',
        description: 'Status alterado para Em execução',
        author: 'Ana Costa',
        timestamp: new Date('2024-01-11T08:00:00'),
        field: 'status',
        oldValue: 'backlog',
        newValue: 'em-execucao'
      },
      {
        id: '3',
        action: 'atualizacao',
        description: 'Branch criada: bugfix/contact-form-email',
        author: 'Ana Costa',
        timestamp: new Date('2024-01-11T10:30:00'),
        field: 'developmentLinks.branch',
        newValue: 'bugfix/contact-form-email'
      },
      {
        id: '4',
        action: 'atualizacao',
        description: 'Pull Request criado: PR-123',
        author: 'Ana Costa',
        timestamp: new Date('2024-01-12T17:00:00'),
        field: 'developmentLinks.pullRequest',
        newValue: 'PR-123'
      }
    ]
  },
  {
    id: '3',
    cardNumber: 3,
    title: 'Homepage Performance Optimization',
    description: 'Optimize homepage loading time to under 2 seconds',
    storyPoints: 5,
    priority: 'medium',
    assignee: 'Carlos Oliveira',
    reporter: 'João Silva',
    issueType: 'task',
    status: 'em-teste',
    labels: ['performance', 'optimization', 'frontend'],
    sprint: 'Sprint 2 - Fev 2024',
    createdAt: new Date('2024-01-05'),
    attachments: [],
    plannedDueDate: new Date('2024-01-30'),
    acceptanceCriteria: [
      { id: '1', text: 'Page loads in under 2 seconds', completed: true },
      { id: '2', text: 'Images are optimized', completed: true },
      { id: '3', text: 'JavaScript bundles are minimized', completed: true }
    ],
    definitionOfReady: [
      { id: '1', text: 'Performance audit completed', completed: true },
      { id: '2', text: 'Optimization targets defined', completed: true }
    ],
    definitionOfDone: [
      { id: '1', text: 'Performance tests pass', completed: true },
      { id: '2', text: 'Lighthouse score > 90', completed: true },
      { id: '3', text: 'Monitoring is set up', completed: false }
    ],
    testScenarios: [
      {
        id: '1',
        title: 'Load Time Test',
        description: 'Measure homepage load time',
        expectedResult: 'Page loads in under 2 seconds',
        status: 'passed'
      }
    ],
    developmentLinks: {
      branch: 'feature/homepage-optimization',
      commits: ['perf: optimize images', 'perf: reduce bundle size']
    },
    comments: [
      {
        id: '1',
        text: 'Implementação concluída. Conseguimos reduzir o tempo de carregamento para 1.2 segundos.',
        author: 'Carlos Oliveira',
        createdAt: new Date('2024-01-25T11:20:00'),
        isEdited: false
      }
    ],
    history: [
      {
        id: '1',
        action: 'criacao',
        description: 'Card criado',
        author: 'João Silva',
        timestamp: new Date('2024-01-05T10:00:00'),
        field: 'status',
        newValue: 'backlog'
      },
      {
        id: '2',
        action: 'mudanca_status',
        description: 'Status alterado para Planejado',
        author: 'Carlos Oliveira',
        timestamp: new Date('2024-01-08T09:00:00'),
        field: 'status',
        oldValue: 'backlog',
        newValue: 'planejado'
      },
      {
        id: '3',
        action: 'mudanca_status',
        description: 'Status alterado para Em execução',
        author: 'Carlos Oliveira',
        timestamp: new Date('2024-01-15T08:30:00'),
        field: 'status',
        oldValue: 'planejado',
        newValue: 'em-execucao'
      },
      {
        id: '4',
        action: 'mudanca_status',
        description: 'Status alterado para Em teste',
        author: 'Carlos Oliveira',
        timestamp: new Date('2024-01-25T14:00:00'),
        field: 'status',
        oldValue: 'em-execucao',
        newValue: 'em-teste'
      }
    ]
  },
  {
    id: '4',
    cardNumber: 4,
    title: 'Admin Dashboard Epic',
    description: 'Complete administrative dashboard with analytics, user management, and reporting',
    storyPoints: 21,
    priority: 'low',
    assignee: 'Maria Santos',
    reporter: 'Ana Costa',
    issueType: 'epic',
    status: 'finalizado',
    labels: ['dashboard', 'admin', 'analytics', 'epic'],
    sprint: 'Sprint 2 - Fev 2024',
    createdAt: new Date('2023-12-20'),
    attachments: [],
    plannedDueDate: new Date('2024-01-31'),
    actualDueDate: new Date('2024-01-28'),
    acceptanceCriteria: [
      { id: '1', text: 'User management interface', completed: true },
      { id: '2', text: 'Analytics dashboard', completed: true },
      { id: '3', text: 'Report generation', completed: true },
      { id: '4', text: 'Role-based permissions', completed: true }
    ],
    definitionOfReady: [
      { id: '1', text: 'Epic is broken down into stories', completed: true },
      { id: '2', text: 'Dependencies identified', completed: true }
    ],
    definitionOfDone: [
      { id: '1', text: 'All stories completed', completed: true },
      { id: '2', text: 'End-to-end tests pass', completed: true },
      { id: '3', text: 'User acceptance testing complete', completed: true }
    ],
    testScenarios: [
      {
        id: '1',
        title: 'Admin Login Test',
        description: 'Test admin user login and access',
        expectedResult: 'Admin can login and access dashboard',
        status: 'passed'
      },
      {
        id: '2',
        title: 'User Management Test',
        description: 'Test creating and managing users',
        expectedResult: 'Admin can create, edit, and delete users',
        status: 'passed'
      }
    ],
    developmentLinks: {
      branch: 'feature/admin-dashboard',
      pullRequest: 'PR-456',
      commits: ['feat: add user management', 'feat: add analytics', 'feat: add reporting']
    },
    comments: [
      {
        id: '1',
        text: 'Epic finalizado com sucesso! Todos os critérios foram atendidos.',
        author: 'Maria Santos',
        createdAt: new Date('2024-01-28T17:30:00'),
        isEdited: false
      },
      {
        id: '2',
        text: 'Excelente trabalho na implementação do dashboard. Ficou muito intuitivo.',
        author: 'Ana Costa',
        createdAt: new Date('2024-01-29T09:15:00'),
        isEdited: false
      }
    ],
    history: [
      {
        id: '1',
        action: 'criacao',
        description: 'Epic criado',
        author: 'Ana Costa',
        timestamp: new Date('2023-12-20T14:00:00'),
        field: 'status',
        newValue: 'backlog'
      },
      {
        id: '2',
        action: 'mudanca_status',
        description: 'Status alterado para Planejado',
        author: 'Maria Santos',
        timestamp: new Date('2024-01-02T10:00:00'),
        field: 'status',
        oldValue: 'backlog',
        newValue: 'planejado'
      },
      {
        id: '3',
        action: 'mudanca_status',
        description: 'Status alterado para Em execução',
        author: 'Maria Santos',
        timestamp: new Date('2024-01-05T08:00:00'),
        field: 'status',
        oldValue: 'planejado',
        newValue: 'em-execucao'
      },
      {
        id: '4',
        action: 'mudanca_status',
        description: 'Status alterado para Finalizado',
        author: 'Maria Santos',
        timestamp: new Date('2024-01-28T16:45:00'),
        field: 'status',
        oldValue: 'aguardando-homologacao',
        newValue: 'finalizado'
      },
      {
        id: '5',
        action: 'atualizacao',
        description: 'Data de conclusão definida',
        author: 'Sistema',
        timestamp: new Date('2024-01-28T16:45:00'),
        field: 'actualDueDate',
        newValue: '2024-01-28'
      }
    ]
  },
  {
    id: '5',
    cardNumber: 5,
    title: 'API Rate Limiting',
    description: 'Implement rate limiting for public API endpoints',
    storyPoints: 5,
    priority: 'medium',
    assignee: 'Pedro Lima',
    reporter: 'Carlos Oliveira',
    issueType: 'story',
    status: 'aguardando-homologacao',
    labels: ['backend', 'api', 'security'],
    sprint: 'Sprint 3 - Mar 2024',
    createdAt: new Date('2024-01-20'),
    attachments: [],
    plannedDueDate: new Date('2024-02-10'),
    acceptanceCriteria: [
      { id: '1', text: 'Rate limits are configurable', completed: true },
      { id: '2', text: 'Proper error responses for exceeded limits', completed: true },
      { id: '3', text: 'Rate limit headers included in responses', completed: true }
    ],
    definitionOfReady: [
      { id: '1', text: 'Rate limiting strategy defined', completed: true },
      { id: '2', text: 'Technical approach approved', completed: true }
    ],
    definitionOfDone: [
      { id: '1', text: 'Implementation complete', completed: true },
      { id: '2', text: 'Load testing performed', completed: true },
      { id: '3', text: 'Documentation updated', completed: false }
    ],
    testScenarios: [
      {
        id: '1',
        title: 'Rate Limit Enforcement',
        description: 'Test API rate limiting under normal load',
        expectedResult: 'Requests are limited according to configuration',
        status: 'passed'
      }
    ],
    developmentLinks: {
      branch: 'feature/api-rate-limiting',
      commits: ['feat: implement rate limiting middleware']
    },
    comments: [
      {
        id: '1',
        text: 'Implementação do rate limiting concluída. Testes de carga passaram com sucesso.',
        author: 'Pedro Lima',
        createdAt: new Date('2024-02-05T14:20:00'),
        isEdited: false
      },
      {
        id: '2',
        text: 'Aguardando apenas a atualização da documentação para finalizar.',
        author: 'Pedro Lima',
        createdAt: new Date('2024-02-08T10:30:00'),
        isEdited: false
      }
    ],
    history: [
      {
        id: '1',
        action: 'criacao',
        description: 'Card criado',
        author: 'Carlos Oliveira',
        timestamp: new Date('2024-01-20T11:00:00'),
        field: 'status',
        newValue: 'backlog'
      },
      {
        id: '2',
        action: 'mudanca_status',
        description: 'Status alterado para Planejado',
        author: 'Pedro Lima',
        timestamp: new Date('2024-01-25T09:00:00'),
        field: 'status',
        oldValue: 'backlog',
        newValue: 'planejado'
      },
      {
        id: '3',
        action: 'mudanca_status',
        description: 'Status alterado para Em execução',
        author: 'Pedro Lima',
        timestamp: new Date('2024-02-01T08:00:00'),
        field: 'status',
        oldValue: 'planejado',
        newValue: 'em-execucao'
      },
      {
        id: '4',
        action: 'mudanca_status',
        description: 'Status alterado para Aguardando homologação',
        author: 'Pedro Lima',
        timestamp: new Date('2024-02-08T15:30:00'),
        field: 'status',
        oldValue: 'em-teste',
        newValue: 'aguardando-homologacao'
      }
    ]
  },
  {
    id: '6',
    cardNumber: 6,
    title: 'External API Integration',
    description: 'Integrate third-party APIs for payment processing and data enrichment',
    storyPoints: 13,
    priority: 'high',
    assignee: 'Ana Costa',
    reporter: 'João Silva',
    issueType: 'story',
    status: 'backlog',
    labels: ['backend', 'api', 'integration'],
    createdAt: new Date('2024-01-25'),
    attachments: [],
    plannedDueDate: new Date('2024-03-15'),
    acceptanceCriteria: [
      { id: '1', text: 'Payment gateway integration completed', completed: false },
      { id: '2', text: 'Data enrichment API connected', completed: false },
      { id: '3', text: 'Error handling and retry logic', completed: false },
      { id: '4', text: 'API rate limiting implemented', completed: false }
    ],
    definitionOfReady: [
      { id: '1', text: 'API specifications documented', completed: false },
      { id: '2', text: 'Third-party API credentials obtained', completed: true }
    ],
    definitionOfDone: [
      { id: '1', text: 'Integration endpoints tested', completed: false },
      { id: '2', text: 'End-to-end tests pass', completed: false },
      { id: '3', text: 'Documentation complete', completed: false }
    ],
    testScenarios: [
      {
        id: '1',
        title: 'Payment Processing Test',
        description: 'Test payment gateway integration',
        expectedResult: 'Payments are processed successfully',
        status: 'pending'
      }
    ],
    developmentLinks: {
      commits: []
    },
    comments: [],
    history: [
      {
        id: '1',
        action: 'criacao',
        description: 'Card criado',
        author: 'João Silva',
        timestamp: new Date('2024-01-25T13:00:00'),
        field: 'status',
        newValue: 'backlog'
      }
    ]
  },
  {
    id: '7',
    cardNumber: 7,
    title: 'User Profile Management',
    description: 'Implement comprehensive user profile management with avatar upload and preferences',
    storyPoints: 5,
    priority: 'medium',
    assignee: 'Carlos Oliveira',
    reporter: 'Maria Santos',
    issueType: 'story',
    status: 'backlog',
    labels: ['frontend', 'user-management', 'profile'],
    createdAt: new Date('2024-02-01'),
    attachments: [],
    plannedDueDate: new Date('2024-03-01'),
    acceptanceCriteria: [
      { id: '1', text: 'User can edit personal information', completed: false },
      { id: '2', text: 'Avatar upload functionality', completed: false },
      { id: '3', text: 'Password change option', completed: false },
      { id: '4', text: 'Notification preferences', completed: false }
    ],
    definitionOfReady: [
      { id: '1', text: 'UI/UX designs approved', completed: true },
      { id: '2', text: 'Backend API endpoints ready', completed: false }
    ],
    definitionOfDone: [
      { id: '1', text: 'Frontend implementation complete', completed: false },
      { id: '2', text: 'Form validation working', completed: false },
      { id: '3', text: 'File upload tested', completed: false }
    ],
    testScenarios: [
      {
        id: '1',
        title: 'Profile Update Test',
        description: 'Test user profile information update',
        expectedResult: 'User can successfully update their profile',
        status: 'pending'
      }
    ],
    developmentLinks: {
      commits: []
    },
    comments: [],
    history: [
      {
        id: '1',
        action: 'criacao',
        description: 'Card criado',
        author: 'Maria Santos',
        timestamp: new Date('2024-02-01T09:00:00'),
        field: 'status',
        newValue: 'backlog'
      }
    ]
  },
  {
    id: '8',
    cardNumber: 8,
    title: 'Security Audit & Improvements',
    description: 'Conduct comprehensive security audit and implement recommended improvements',
    storyPoints: 8,
    priority: 'critical',
    assignee: 'Pedro Lima',
    reporter: 'Ana Costa',
    issueType: 'task',
    status: 'backlog',
    labels: ['security', 'audit', 'backend'],
    createdAt: new Date('2024-02-05'),
    attachments: [],
    plannedDueDate: new Date('2024-02-28'),
    acceptanceCriteria: [
      { id: '1', text: 'Security audit completed', completed: false },
      { id: '2', text: 'Vulnerabilities documented', completed: false },
      { id: '3', text: 'Critical issues fixed', completed: false },
      { id: '4', text: 'Security report generated', completed: false }
    ],
    definitionOfReady: [
      { id: '1', text: 'Security audit tools selected', completed: true },
      { id: '2', text: 'Audit scope defined', completed: true }
    ],
    definitionOfDone: [
      { id: '1', text: 'All critical vulnerabilities fixed', completed: false },
      { id: '2', text: 'Security tests pass', completed: false },
      { id: '3', text: 'Team trained on security practices', completed: false }
    ],
    testScenarios: [
      {
        id: '1',
        title: 'Penetration Test',
        description: 'Conduct penetration testing on the application',
        expectedResult: 'No critical vulnerabilities found',
        status: 'pending'
      }
    ],
    developmentLinks: {
      commits: []
    },
    comments: [],
    history: [
      {
        id: '1',
        action: 'criacao',
        description: 'Card criado',
        author: 'Ana Costa',
        timestamp: new Date('2024-02-05T11:30:00'),
        field: 'status',
        newValue: 'backlog'
      }
    ]
  }
];

export const availableSprints: SprintOption[] = [
  { id: 'sprint-1', name: 'Sprint 1 - Jan 2024', isActive: true },
  { id: 'sprint-2', name: 'Sprint 2 - Fev 2024', isActive: false },
  { id: 'sprint-3', name: 'Sprint 3 - Mar 2024', isActive: false },
];

export const mockSprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1 - Janeiro 2024',
    goal: 'Implementar funcionalidades básicas do dashboard e correções críticas',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-29'),
    status: 'active',
    cards: [],
    teamMembers: ['João Silva', 'Ana Costa', 'Carlos Oliveira'],
    absentMembers: [],
    storyPointsPerDeveloper: 8,
    capacity: 24, // 3 developers * 8 points each
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'sprint-2',
    name: 'Sprint 2 - Fevereiro 2024',
    goal: 'Desenvolver funcionalidades avançadas e otimizações de performance',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-15'),
    status: 'planning',
    cards: [],
    teamMembers: ['Maria Santos', 'Pedro Lima', 'Carlos Oliveira', 'Ana Costa'],
    absentMembers: [],
    storyPointsPerDeveloper: 8,
    capacity: 32, // 4 developers * 8 points each
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-30')
  },
  {
    id: 'sprint-3',
    name: 'Sprint 3 - Março 2024',
    goal: 'Implementar integrações externas e melhorias de segurança',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-15'),
    status: 'planning',
    cards: [],
    teamMembers: ['Pedro Lima', 'Ana Costa', 'João Silva'],
    absentMembers: [],
    storyPointsPerDeveloper: 10,
    capacity: 30, // 3 developers * 10 points each
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-25')
  },
  {
    id: 'sprint-4',
    name: 'Sprint 4 - Janeiro 2024 (Concluída)',
    goal: 'Sprint de exemplo concluída',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-14'),
    status: 'completed',
    cards: [],
    teamMembers: ['João Silva', 'Ana Costa'],
    absentMembers: [],
    storyPointsPerDeveloper: 8,
    capacity: 16, // 2 developers * 8 points each
    createdAt: new Date('2023-12-27'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: 'sprint-5',
    name: 'Sprint 5 - Dezembro 2023 (Cancelada)',
    goal: 'Sprint cancelada por mudança de prioridades',
    startDate: new Date('2023-12-15'),
    endDate: new Date('2023-12-29'),
    status: 'cancelled',
    cards: [],
    teamMembers: ['Maria Santos', 'Pedro Lima'],
    absentMembers: [],
    storyPointsPerDeveloper: 8,
    capacity: 16, // 2 developers * 8 points each
    createdAt: new Date('2023-12-10'),
    updatedAt: new Date('2023-12-20')
  }
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'João Silva',
    role: 'Desenvolvedor',
    email: 'joao.silva@empresa.com',
    isActive: true
  },
  {
    id: '2',
    name: 'Ana Costa',
    role: 'Desenvolvedor',
    email: 'ana.costa@empresa.com',
    isActive: true
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    role: 'Tech Lead',
    email: 'carlos.oliveira@empresa.com',
    isActive: true
  },
  {
    id: '4',
    name: 'Maria Santos',
    role: 'Scrum Master',
    email: 'maria.santos@empresa.com',
    isActive: true
  },
  {
    id: '5',
    name: 'Pedro Lima',
    role: 'Tester',
    email: 'pedro.lima@empresa.com',
    isActive: true
  }
];

// Simulando usuário logado atual - em uma aplicação real, isso viria do contexto de autenticação
// Para testar as regras, você pode alterar o índice:
// 0 = João Silva (Desenvolvedor) - só pode mover stories no fluxo restrito
// 2 = Carlos Oliveira (Tech Lead) - pode mover qualquer card
export const currentUser: TeamMember = mockTeamMembers[0]; // João Silva (Desenvolvedor)