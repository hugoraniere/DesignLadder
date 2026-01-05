import { useState } from 'react';
import { LayoutDashboard, GitBranch, KanbanSquare, Calendar, TrendingUp, Users, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentPage: 'dashboard' | 'roadmap' | 'kanban' | 'ceremonies' | 'nps' | 'team';
  onNavigate: (page: 'dashboard' | 'roadmap' | 'kanban' | 'ceremonies' | 'nps' | 'team') => void;
  projectName?: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const Sidebar = ({ currentPage, onNavigate, projectName, onCollapseChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { signOut } = useAuth();

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onCollapseChange) {
      onCollapseChange(newState);
    }
  };

  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap' as const, label: 'Roadmap', icon: GitBranch },
    { id: 'kanban' as const, label: 'Tarefas', icon: KanbanSquare },
    { id: 'ceremonies' as const, label: 'Cerimônias', icon: Calendar },
    { id: 'nps' as const, label: 'NPS', icon: TrendingUp },
    { id: 'team' as const, label: 'Estrutura do Time', icon: Users },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r-2 border-black transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 border-b-2 border-black flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Logo showText={false} variant="dark" />
            <div className="flex flex-col">
              <span className="font-bold text-sm">Design Ladder</span>
              {projectName && <span className="text-xs text-gray-600">{projectName}</span>}
            </div>
          </div>
        )}
        {isCollapsed && <Logo showText={false} variant="dark" />}
        <button
          onClick={handleToggleCollapse}
          className="p-1 hover:bg-gray-100 rounded transition-colors ml-auto"
          title={isCollapsed ? 'Expandir' : 'Colapsar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? 'bg-black text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? '' : ''}`} />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-t-2 border-black p-4">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title={isCollapsed ? 'Sair' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Sair</span>}
        </button>
      </div>
    </aside>
  );
};
