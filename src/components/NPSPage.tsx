import { useState, useEffect } from 'react';
import { TrendingUp, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface NPSPageProps {
  projectId: string;
}

interface NPSResponse {
  id: string;
  designer_id: string;
  designer_name: string;
  score: number;
  month: number;
  year: number;
  comment: string | null;
  created_at: string;
}

export const NPSPage = ({ projectId }: NPSPageProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<NPSResponse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    loadNPSData();
  }, [projectId]);

  const loadNPSData = async () => {
    try {
      setLoading(true);

      const { data } = await supabase
        .from('nps_responses')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      setResponses(data || []);

      const hasCurrentMonthResponse = data?.some(
        (r) => r.designer_id === user?.id && r.month === currentMonth && r.year === currentYear
      );

      if (!hasCurrentMonthResponse) {
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error loading NPS:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (score === null || !user) {
      alert('Por favor, selecione uma nota');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('nps_responses').insert({
        project_id: projectId,
        designer_id: user.id,
        designer_name: user.email?.split('@')[0] || 'Designer',
        score,
        month: currentMonth,
        year: currentYear,
        comment: comment.trim() || null
      });

      if (error) throw error;

      setShowForm(false);
      setScore(null);
      setComment('');
      loadNPSData();
    } catch (error) {
      console.error('Error submitting NPS:', error);
      alert('Erro ao enviar resposta');
    } finally {
      setSubmitting(false);
    }
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months[month - 1];
  };

  const calculateAverage = () => {
    if (responses.length === 0) return 0;
    const sum = responses.reduce((acc, r) => acc + r.score, 0);
    return (sum / responses.length).toFixed(1);
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
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
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">NPS - Net Promoter Score</h1>
          <p className="text-gray-600">Avalie mensalmente sua experiência no time de design</p>
        </div>

        {showForm && (
          <div className="bg-white border-2 border-black p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">
              NPS de {getMonthName(currentMonth)} {currentYear}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Em uma escala de 0 a 10, o quanto você recomendaria trabalhar neste time de design para um colega?
            </p>

            <div className="flex gap-2 mb-6 flex-wrap">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => setScore(value)}
                  className={`w-12 h-12 border-2 font-bold transition-all ${
                    score === value
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">
                Comentário (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="O que poderia melhorar?"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={score === null || submitting}
              className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Enviando...' : 'Enviar Resposta'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-bold">NPS Médio</h3>
            </div>
            <p className="text-4xl font-bold">{calculateAverage()}</p>
            <p className="text-sm text-gray-500 mt-1">Baseado em {responses.length} respostas</p>
          </div>

          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5" />
              <h3 className="font-bold">Este Mês</h3>
            </div>
            <p className="text-4xl font-bold">
              {responses.filter(r => r.month === currentMonth && r.year === currentYear).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Respostas em {getMonthName(currentMonth)}</p>
          </div>

          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-bold">Tendência</h3>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {responses.length > 0 ? 'Acompanhando mensalmente' : 'Sem dados ainda'}
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-black">
          <div className="p-6 border-b-2 border-gray-200">
            <h2 className="text-xl font-bold">Histórico de Respostas</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {responses.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Nenhuma resposta ainda
              </div>
            ) : (
              responses.map((response) => (
                <div key={response.id} className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{response.designer_name}</p>
                      <p className="text-sm text-gray-500">
                        {getMonthName(response.month)} {response.year}
                      </p>
                    </div>
                    <div className={`text-3xl font-bold ${getScoreColor(response.score)}`}>
                      {response.score}
                    </div>
                  </div>
                  {response.comment && (
                    <p className="text-sm text-gray-700 mt-2 italic">"{response.comment}"</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
