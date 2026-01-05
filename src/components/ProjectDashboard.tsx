import { useState, useEffect } from 'react';
import { Plus, LogOut, Folder, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';
import { formatDate, parseDate } from '../utils/businessDays';

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'archived' | 'completed';
  start_date: string;
  handoff_date: string | null;
  created_at: string;
}

interface ProjectDashboardProps {
  onSelectProject: (projectId: string) => void;
}

export const ProjectDashboard = ({ onSelectProject }: ProjectDashboardProps) => {
  const { user, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectStartDate, setNewProjectStartDate] = useState(formatDate(new Date()));
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) {
      alert('Por favor, dê um nome ao projeto');
      return;
    }

    if (!user?.id) {
      alert('Erro: usuário não autenticado');
      return;
    }

    setCreating(true);

    try {
      console.log('[ProjectDashboard] Criando projeto:', {
        name: newProjectName.trim(),
        user_id: user.id,
        start_date: newProjectStartDate
      });

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: newProjectName.trim(),
          description: newProjectDescription.trim() || null,
          start_date: newProjectStartDate,
          status: 'active',
        })
        .select()
        .single();

      if (projectError) {
        console.error('[ProjectDashboard] Erro ao criar projeto:', projectError);
        throw projectError;
      }

      console.log('[ProjectDashboard] Projeto criado:', project.id);

      const defaultPhases = [
        { name: 'Discovery', order: 1 },
        { name: 'Ideação', order: 2 },
        { name: 'Prototipação', order: 3 },
      ];

      const { error: phasesError } = await supabase
        .from('phases')
        .insert(
          defaultPhases.map((phase) => ({
            project_id: project.id,
            name: phase.name,
            order: phase.order,
          }))
        );

      if (phasesError) throw phasesError;

      setShowNewProjectModal(false);
      setNewProjectName('');
      setNewProjectDescription('');
      setNewProjectStartDate(formatDate(new Date()));

      onSelectProject(project.id);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Erro ao criar projeto. Tente novamente.');
    } finally {
      setCreating(false);
    }
  };

  const formatHandoffDate = (dateString: string | null) => {
    if (!dateString) return 'Não definido';
    const date = parseDate(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'Em andamento',
      archived: 'Arquivado',
      completed: 'Concluído',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-600',
      archived: 'bg-gray-100 text-gray-800 border-gray-600',
      completed: 'bg-blue-100 text-blue-800 border-blue-600',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
          <p className="mt-4 text-gray-600">Carregando projetos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo showText={true} variant="dark" />
            <h1 className="text-2xl font-bold">Roadmaps de Design</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Olá,</p>
              <p className="font-bold">{user?.user_metadata?.full_name || user?.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-3 border-2 border-black hover:bg-black hover:text-white transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Meus Projetos</h2>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 font-bold hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Projeto
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <Folder className="w-20 h-20 mx-auto text-gray-400 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Nenhum projeto ainda</h3>
            <p className="text-gray-600 mb-8">
              Crie seu primeiro roadmap de design para começar a planejar
            </p>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-bold text-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-6 h-6" />
              Criar primeiro roadmap
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border-4 border-black p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{project.name}</h3>
                      <span
                        className={`px-3 py-1 text-sm font-bold border-2 ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusLabel(project.status)}
                      </span>
                    </div>

                    {project.description && (
                      <p className="text-gray-700 mb-4">{project.description}</p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Início: {formatHandoffDate(project.start_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Handoff: {formatHandoffDate(project.handoff_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectProject(project.id)}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 font-bold hover:bg-gray-800 transition-colors"
                  >
                    Ver roadmap
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 max-w-lg w-full border-4 border-black">
            <h2 className="text-3xl font-bold mb-6">Novo Projeto</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Nome do projeto <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Ex: Redesign do app mobile"
                  disabled={creating}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  placeholder="Breve descrição do projeto"
                  disabled={creating}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Data de início
                </label>
                <input
                  type="date"
                  value={newProjectStartDate}
                  onChange={(e) => setNewProjectStartDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                  disabled={creating}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowNewProjectModal(false)}
                disabled={creating}
                className="flex-1 border-2 border-black py-3 px-6 font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={createProject}
                disabled={creating}
                className="flex-1 bg-black text-white py-3 px-6 font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {creating ? 'Criando...' : 'Criar projeto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
