import { useState } from 'react';
import { 
  Home, 
  FileText, 
  Phone, 
  ThumbsUp, 
  Star, 
  Map, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Calendar,
  Package,
  BarChart3,
  Trello,
  TrendingUp,
  DollarSign,
  BookOpen,
  GanttChart,
  Settings,
  FolderKanban,
  Users,
  Shield
} from 'lucide-react';
import { Button } from './ui/button';
import logoImage from 'figma:asset/c620bfa4f82ea5e3353c78759d33e383340138d9.png';

type ActiveSection = 'home' | 'formularios' | 'chamados' | 'aprovacoes' | 'pesquisa' | 'roadmap' | 'ajuda' | 'kanban-quadro' | 'kanban-sprint' | 'kanban-backlog' | 'kanban-cronograma' | 'kanban-relatorios' | 'kanban-relatorios-operacional' | 'kanban-relatorios-financeiro' | 'kanban-documentacao' | 'kanban-gestao' | 'kanban-gestao-quadros' | 'kanban-gestao-membros' | 'kanban-gestao-permissoes';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

const menuItems = [
  { icon: Home, label: 'Home', section: 'home' as ActiveSection },
  { icon: FileText, label: 'Formulários', section: 'formularios' as ActiveSection },
  { icon: Phone, label: 'Chamados', section: 'chamados' as ActiveSection },
  { icon: ThumbsUp, label: 'Minhas aprovações', section: 'aprovacoes' as ActiveSection },
  { icon: Star, label: 'Pesquisa de Satisfação', section: 'pesquisa' as ActiveSection },
  { icon: Map, label: 'Roadmap', section: 'roadmap' as ActiveSection },
  { icon: HelpCircle, label: 'Ajuda', section: 'ajuda' as ActiveSection },
];

const kanbanSubItems = [
  { icon: LayoutDashboard, label: 'Quadro', section: 'kanban-quadro' as ActiveSection },
  { icon: Calendar, label: 'Sprint', section: 'kanban-sprint' as ActiveSection },
  { icon: GanttChart, label: 'Cronograma', section: 'kanban-cronograma' as ActiveSection },
  { icon: Package, label: 'Backlog', section: 'kanban-backlog' as ActiveSection },
  { 
    icon: BarChart3, 
    label: 'Relatórios', 
    section: 'kanban-relatorios' as ActiveSection,
    hasSubItems: true,
    subItems: [
      { icon: TrendingUp, label: 'Operacional', section: 'kanban-relatorios-operacional' as ActiveSection },
      { icon: DollarSign, label: 'Financeiro', section: 'kanban-relatorios-financeiro' as ActiveSection },
    ]
  },
  { 
    icon: Settings, 
    label: 'Gestão', 
    section: 'kanban-gestao' as ActiveSection,
    hasSubItems: true,
    subItems: [
      { icon: FolderKanban, label: 'Cadastrar Quadro', section: 'kanban-gestao-quadros' as ActiveSection },
      { icon: Users, label: 'Cadastrar Membro', section: 'kanban-gestao-membros' as ActiveSection },
      { icon: Shield, label: 'Gerenciar Permissões', section: 'kanban-gestao-permissoes' as ActiveSection },
    ]
  },
  { icon: BookOpen, label: 'Documentação', section: 'kanban-documentacao' as ActiveSection },
];

export function SpassuSidebar({ isCollapsed, onToggle, activeSection, onSectionChange }: SidebarProps) {
  const [isKanbanExpanded, setIsKanbanExpanded] = useState(true);
  const [isRelatoriosExpanded, setIsRelatoriosExpanded] = useState(true);
  const [isGestaoExpanded, setIsGestaoExpanded] = useState(true);
  
  const isKanbanActive = activeSection.startsWith('kanban-');
  const isRelatoriosActive = activeSection.startsWith('kanban-relatorios');
  const isGestaoActive = activeSection.startsWith('kanban-gestao');

  return (
    <div 
      className={`${isCollapsed ? 'w-16' : 'w-[250px]'} transition-all duration-300 ease-in-out`}
    >
      <div className="h-full text-white flex flex-col" style={{ backgroundColor: '#201547' }}>
        {/* Logo Section */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Logo Image */}
            <div className="shrink-0">
              <img 
                src={logoImage} 
                alt="Logo Sistema" 
                className={`${isCollapsed ? 'w-10 h-10' : 'w-36 h-auto'} transition-all duration-300 object-contain`}
              />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          <div className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => onSectionChange(item.section)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeSection === item.section
                    ? 'bg-white/10 text-white'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm">{item.label}</span>
                )}
              </button>
            ))}
            
            {/* Kanban Section */}
            <div className="mt-2">
              <button
                onClick={() => setIsKanbanExpanded(!isKanbanExpanded)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isKanbanActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Trello className="w-5 h-5 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="text-sm flex-1">Kanban</span>
                    {isKanbanExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </>
                )}
              </button>
              
              {/* Kanban Sub-items */}
              {!isCollapsed && isKanbanExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  {kanbanSubItems.map((subItem, index) => (
                    <div key={index}>
                      <button
                        onClick={() => {
                          if (subItem.hasSubItems && subItem.label === 'Relatórios') {
                            setIsRelatoriosExpanded(!isRelatoriosExpanded);
                            if (!isRelatoriosActive) {
                              onSectionChange(subItem.section);
                            }
                          } else if (subItem.hasSubItems && subItem.label === 'Gestão') {
                            setIsGestaoExpanded(!isGestaoExpanded);
                            if (!isGestaoActive) {
                              onSectionChange(subItem.section);
                            }
                          } else {
                            onSectionChange(subItem.section);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeSection === subItem.section || (subItem.hasSubItems && (isRelatoriosActive || isGestaoActive))
                            ? 'bg-white/15 text-white' 
                            : 'text-white/80 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <subItem.icon className="w-4 h-4 shrink-0" />
                        <span className="text-sm flex-1">{subItem.label}</span>
                        {subItem.hasSubItems && (
                          (subItem.label === 'Relatórios' ? isRelatoriosExpanded : isGestaoExpanded) ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )
                        )}
                      </button>
                      
                      {/* Sub-sub-items for Relatórios and Gestão */}
                      {subItem.hasSubItems && ((subItem.label === 'Relatórios' && isRelatoriosExpanded) || (subItem.label === 'Gestão' && isGestaoExpanded)) && (
                        <div className="ml-6 mt-1 space-y-1">
                          {subItem.subItems?.map((subSubItem, subIndex) => (
                            <button
                              key={subIndex}
                              onClick={() => onSectionChange(subSubItem.section)}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                activeSection === subSubItem.section 
                                  ? 'bg-white/20 text-white' 
                                  : 'text-white/80 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <subSubItem.icon className="w-3 h-3 shrink-0" />
                              <span className="text-xs">{subSubItem.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Collapsed state - show active sub-item */}
              {isCollapsed && isKanbanActive && (
                <div className="mt-1">
                  {kanbanSubItems
                    .filter(subItem => activeSection === subItem.section)
                    .map((subItem, index) => (
                      <button
                        key={index}
                        onClick={() => onSectionChange(subItem.section)}
                        className="w-full flex items-center justify-center p-2 rounded-lg bg-white/15 text-white"
                        title={subItem.label}
                      >
                        <subItem.icon className="w-4 h-4" />
                      </button>
                    ))}
                  {/* Show active sub-sub-item when collapsed */}
                  {kanbanSubItems
                    .filter(subItem => subItem.hasSubItems)
                    .flatMap(subItem => subItem.subItems || [])
                    .filter(subSubItem => activeSection === subSubItem.section)
                    .map((subSubItem, index) => (
                      <button
                        key={index}
                        onClick={() => onSectionChange(subSubItem.section)}
                        className="w-full flex items-center justify-center p-2 rounded-lg bg-white/20 text-white mt-1"
                        title={subSubItem.label}
                      >
                        <subSubItem.icon className="w-3 h-3" />
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-full text-white/80 hover:text-white hover:bg-white/5 justify-start gap-2"
          >
            {isCollapsed ? (
              <>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Recolher menu</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}