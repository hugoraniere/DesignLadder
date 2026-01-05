import { useState, useEffect } from 'react';
import { ArrowLeft, KanbanSquare, GitBranch, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';
import { KanbanBoard } from './KanbanBoard';

interface Project {
  id: string;
  name: string;
}

interface KanbanPageProps {
  projectId: string;
  onBack: () => void;
}

export const KanbanPage = ({ projectId, onBack }: KanbanPageProps) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, name')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-black sticky top-0 bg-white z-40">
        <div className="max-w-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.hash = '#app'}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors text-sm"
                title="Ver todos os projetos"
              >
                <ArrowLeft className="w-4 h-4" />
                Meus Projetos
              </button>
              <div className="w-px h-6 bg-gray-300" />
              <Logo showText={false} variant="dark" />
              <h1 className="text-lg font-bold">{project?.name}</h1>
            </div>
          </div>

          <div className="flex">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 font-medium border-r border-gray-200 transition-colors text-sm bg-gray-50 hover:bg-gray-100"
            >
              <GitBranch className="w-4 h-4" />
              Roadmap
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 font-medium border-r border-gray-200 transition-colors text-sm bg-white border-b-2 border-black -mb-[2px] relative z-10"
            >
              <KanbanSquare className="w-4 h-4" />
              Kanban
            </button>
            <button
              onClick={() => window.location.hash = `#ceremonies/${projectId}`}
              className="flex items-center gap-2 px-4 py-2 font-medium border-r border-gray-200 transition-colors text-sm bg-gray-50 hover:bg-gray-100"
            >
              <Calendar className="w-4 h-4" />
              Cerimônias
            </button>
          </div>
        </div>
      </header>

      <main className="h-[calc(100vh-73px)] overflow-hidden">
        <KanbanBoard projectId={projectId} />
      </main>
    </div>
  );
};
