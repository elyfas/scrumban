import { SprintView } from './SprintView';

export function SprintManagement() {
  return (
    <div className="h-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Sprints</h1>
            <p className="text-gray-600 mt-1">Organize e acompanhe o progresso das suas sprints</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="h-full overflow-auto">
        <SprintView />
      </div>
    </div>
  );
}