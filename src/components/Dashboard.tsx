import { useState, useEffect } from 'react';
import { Calendar, AlertCircle, GitBranch, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  projectId: string;
}

interface UpcomingCeremony {
  id: string;
  name: string;
  frequency: string;
  duration_minutes: number;
}

interface StoryWithPhases {
  id: string;
  name: string;
  end_date: string;
  handoff_date: string | null;
}

interface NPSStatus {
  hasResponded: boolean;
  currentMonth: number;
  currentYear: number;
}

export const Dashboard = ({ projectId }: DashboardProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ceremonies, setCeremonies] = useState<UpcomingCeremony[]>([]);
  const [stories, setStories] = useState<StoryWithPhases[]>([]);
  const [npsStatus, setNpsStatus] = useState<NPSStatus | null>(null);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [projectId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const { data: project } = await supabase
        .from('projects')
        .select('name')
        .eq('id', projectId)
        .single();

      if (project) setProjectName(project.name);

      const { data: ceremoniesData } = await supabase
        .from('ceremonies')
        .select('id, name, frequency, duration_minutes')
        .eq('project_id', projectId)
        .order('position')
        .limit(3);

      if (ceremoniesData) setCeremonies(ceremoniesData);

      const { data: storiesData } = await supabase
        .from('design_stories')
        .select('id, name, end_date, handoff_date')
        .eq('project_id', projectId)
        .gte('end_date', new Date().toISOString().split('T')[0])
        .order('end_date')
        .limit(5);

      if (storiesData) setStories(storiesData);

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const { data: npsData } = await supabase
        .from('nps_responses')
        .select('id')
        .eq('project_id', projectId)
        .eq('designer_id', user?.id)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .maybeSingle();

      setNpsStatus({
        hasResponded: !!npsData,
        currentMonth,
        currentYear
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[month - 1];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-xl font-bold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">{projectName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!npsStatus?.hasResponded && (
            <div className="col-span-full bg-yellow-50 border-2 border-yellow-400 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">NPS Pendente</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Você ainda não respondeu o NPS de {getMonthName(npsStatus?.currentMonth || 0)}.
                  </p>
                  <button
                    onClick={() => window.location.hash = `#nps/${projectId}`}
                    className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Responder Agora
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="w-5 h-5" />
              <h2 className="font-bold text-lg">Roadmap</h2>
            </div>
            {stories.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma história próxima</p>
            ) : (
              <div className="space-y-3">
                {stories.map((story) => (
                  <div key={story.id} className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{story.name}</p>
                      <p className="text-xs text-gray-500">
                        Fim: {formatDate(story.end_date)}
                        {story.handoff_date && ` • Handoff: ${formatDate(story.handoff_date)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5" />
              <h2 className="font-bold text-lg">Próximas Cerimônias</h2>
            </div>
            {ceremonies.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma cerimônia cadastrada</p>
            ) : (
              <div className="space-y-3">
                {ceremonies.map((ceremony) => (
                  <div key={ceremony.id} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ceremony.name}</p>
                      <p className="text-xs text-gray-500">
                        {ceremony.frequency === 'weekly' && 'Semanal'} • {ceremony.duration_minutes} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" />
              <h2 className="font-bold text-lg">Atalhos Rápidos</h2>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => window.location.hash = `#roadmap/${projectId}`}
                className="w-full text-left px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
              >
                Ver Roadmap Completo
              </button>
              <button
                onClick={() => window.location.hash = `#kanban/${projectId}`}
                className="w-full text-left px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
              >
                Minhas Tarefas
              </button>
              <button
                onClick={() => window.location.hash = `#ceremonies/${projectId}`}
                className="w-full text-left px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
              >
                Gerenciar Cerimônias
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
