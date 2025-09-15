import { useState } from "react";
import { KanbanBoard } from "./components/KanbanBoard";
import { SpassuSidebar } from "./components/SpassuSidebar";
import { SprintManagement } from "./components/SprintManagement";
import { BacklogView } from "./components/BacklogView";
import { GanttChart } from "./components/GanttChart";
import { OperationalReports } from "./components/OperationalReports";
import { FinancialReports } from "./components/FinancialReports";
import { DocumentationPage } from "./components/DocumentationPage";
import { ManagementHub } from "./components/ManagementHub";
import { BoardManagement } from "./components/BoardManagement";
import { MemberManagement } from "./components/MemberManagement";
import { PermissionsManagement } from "./components/PermissionsManagement";
import { Toaster } from "./components/ui/sonner";

type ActiveSection =
  | "home"
  | "formularios"
  | "chamados"
  | "aprovacoes"
  | "pesquisa"
  | "roadmap"
  | "ajuda"
  | "kanban-quadro"
  | "kanban-sprint"
  | "kanban-backlog"
  | "kanban-cronograma"
  | "kanban-relatorios"
  | "kanban-relatorios-operacional"
  | "kanban-relatorios-financeiro"
  | "kanban-documentacao"
  | "kanban-gestao"
  | "kanban-gestao-quadros"
  | "kanban-gestao-membros"
  | "kanban-gestao-permissoes";

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>("kanban-quadro");

  // Componente para seções em desenvolvimento
  const DevelopmentSection = () => (
    <div className="p-8">
      <h1>Em Desenvolvimento</h1>
      <p className="text-muted-foreground">
        Esta seção está em desenvolvimento...
      </p>
    </div>
  );

  // Componente para overview de relatórios
  const ReportsOverview = () => (
    <div className="p-8">
      <h1>Relatórios</h1>
      <p className="text-muted-foreground mb-6">
        Selecione um tipo de relatório no menu lateral para começar.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="p-6 border border-border rounded-lg hover:shadow-md transition-shadow"
          onClick={() => setActiveSection("kanban-relatorios-operacional")}
        >
          <h3>Relatórios Operacionais</h3>
          <p className="text-muted-foreground">
            Métricas de performance, velocity, burndown e análises de sprint.
          </p>
        </div>
        <div
          className="p-6 border border-border rounded-lg hover:shadow-md transition-shadow"
          onClick={() => setActiveSection("kanban-relatorios-financeiro")}
        >
          <h3>Relatórios Financeiros</h3>
          <p className="text-muted-foreground">
            Custos de projeto, ROI, análise de recursos e orçamentos.
          </p>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    const sectionComponents = {
      "kanban-quadro": KanbanBoard,
      "kanban-sprint": SprintManagement,
      "kanban-backlog": BacklogView,
      "kanban-cronograma": GanttChart,
      "kanban-relatorios": ReportsOverview,
      "kanban-relatorios-operacional": OperationalReports,
      "kanban-relatorios-financeiro": FinancialReports,
      "kanban-documentacao": DocumentationPage,
      "kanban-gestao": () => <ManagementHub onSectionChange={setActiveSection} />,
      "kanban-gestao-quadros": BoardManagement,
      "kanban-gestao-membros": MemberManagement,
      "kanban-gestao-permissoes": PermissionsManagement,
    };

    const Component = sectionComponents[activeSection] || DevelopmentSection;
    return <Component />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <SpassuSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex-1">{renderMainContent()}</div>
      <Toaster />
    </div>
  );
}