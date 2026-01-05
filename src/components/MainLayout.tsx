import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { RoadmapGantt } from './RoadmapGantt';
import { KanbanBoard } from './KanbanBoard';
import { CeremoniesContent } from './CeremoniesContent';
import { NPSPage } from './NPSPage';
import { TeamPage } from './TeamPage';
import { supabase } from '../lib/supabase';

interface MainLayoutProps {
  projectId: string;
}

type PageType = 'dashboard' | 'roadmap' | 'kanban' | 'ceremonies' | 'nps' | 'team';

export const MainLayout = ({ projectId }: MainLayoutProps) => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [projectName, setProjectName] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadProject();

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('#roadmap/')) setCurrentPage('roadmap');
      else if (hash.includes('#kanban/')) setCurrentPage('kanban');
      else if (hash.includes('#ceremonies/')) setCurrentPage('ceremonies');
      else if (hash.includes('#nps/')) setCurrentPage('nps');
      else if (hash.includes('#team/')) setCurrentPage('team');
      else if (hash.includes('#dashboard/')) setCurrentPage('dashboard');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [projectId]);

  const loadProject = async () => {
    const { data } = await supabase
      .from('projects')
      .select('name')
      .eq('id', projectId)
      .single();

    if (data) setProjectName(data.name);
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.location.hash = `#${page}/${projectId}`;
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        projectName={projectName}
        onCollapseChange={setIsSidebarCollapsed}
      />

      <div className={`flex-1 overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {currentPage === 'dashboard' && <Dashboard projectId={projectId} />}
        {currentPage === 'roadmap' && (
          <RoadmapGantt
            projectId={projectId}
            onBack={() => handleNavigate('dashboard')}
          />
        )}
        {currentPage === 'kanban' && (
          <div className="h-full bg-white p-6 overflow-hidden">
            <h1 className="text-2xl font-bold mb-6">Tarefas</h1>
            <div className="h-[calc(100%-4rem)]">
              <KanbanBoard projectId={projectId} />
            </div>
          </div>
        )}
        {currentPage === 'ceremonies' && (
          <CeremoniesContent projectId={projectId} />
        )}
        {currentPage === 'nps' && <NPSPage projectId={projectId} />}
        {currentPage === 'team' && <TeamPage projectId={projectId} />}
      </div>
    </div>
  );
};
