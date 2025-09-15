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
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);
  const [activeSection, setActiveSection] =
    useState<ActiveSection>("kanban-quadro");

  const renderMainContent = () => {
    switch (activeSection) {
      case "kanban-quadro":
        return <KanbanBoard />;
      case "kanban-sprint":
        return <SprintManagement />;
      case "kanban-backlog":
        return <BacklogView />;
      case "kanban-cronograma":
        return <GanttChart />;
      case "kanban-relatorios":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Relatórios
            </h1>
            <p className="text-gray-600">
              Selecione um tipo de relatório no menu lateral
              para começar.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() =>
                  setActiveSection(
                    "kanban-relatorios-operacional",
                  )
                }
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Relatórios Operacionais
                </h3>
                <p className="text-gray-600">
                  Métricas de performance, velocity, burndown e
                  análises de sprint.
                </p>
              </div>
              <div
                className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() =>
                  setActiveSection(
                    "kanban-relatorios-financeiro",
                  )
                }
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Relatórios Financeiros
                </h3>
                <p className="text-gray-600">
                  Custos de projeto, ROI, análise de recursos e
                  orçamentos.
                </p>
              </div>
            </div>
          </div>
        );
      case "kanban-relatorios-operacional":
        return <OperationalReports />;
      case "kanban-relatorios-financeiro":
        return <FinancialReports />;
      case "kanban-documentacao":
        return <DocumentationPage />;
      case "kanban-gestao":
        return (
          <ManagementHub onSectionChange={setActiveSection} />
        );
      case "kanban-gestao-quadros":
        return <BoardManagement />;
      case "kanban-gestao-membros":
        return <MemberManagement />;
      case "kanban-gestao-permissoes":
        return <PermissionsManagement />;
      default:
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Em Desenvolvimento
            </h1>
            <p className="text-gray-600">
              Esta seção está em desenvolvimento...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <SpassuSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() =>
          setIsSidebarCollapsed(!isSidebarCollapsed)
        }
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1">{renderMainContent()}</div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}