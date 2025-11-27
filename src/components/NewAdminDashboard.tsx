import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Download, FileText, Users } from 'lucide-react';
import { Logo } from './Logo';

interface MaturityDiagnosis {
  id: string;
  response_id: string;
  full_name: string;
  email: string;
  company: string | null;
  role: string;
  total_score: number;
  maturity_level: number;
  archetype: string;
  feedback: string | null;
  created_at: string;
}

interface ResearchResponse {
  id: string;
  problem: string;
  desired_outcome: string;
  frequency: string;
  team_size: string;
  role: string;
  company_name: string;
  email: string;
  created_at: string;
}

export const NewAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'maturity' | 'research'>('maturity');
  const [maturityData, setMaturityData] = useState<MaturityDiagnosis[]>([]);
  const [researchData, setResearchData] = useState<ResearchResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [maturity, research] = await Promise.all([
        supabase
          .from('maturity_diagnosis')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('responses')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      if (maturity.data) setMaturityData(maturity.data);
      if (research.data) setResearchData(research.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const exportMaturityToCSV = () => {
    const headers = [
      'Timestamp',
      'Name',
      'Email',
      'Company',
      'Role',
      'Score',
      'Level',
      'Archetype',
      'Feedback',
      'Response ID'
    ];

    const rows = maturityData.map(r => [
      new Date(r.created_at).toLocaleString(),
      r.full_name,
      r.email,
      r.company || '',
      r.role,
      r.total_score,
      r.maturity_level,
      r.archetype,
      r.feedback || '',
      r.response_id
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maturity-diagnostics-${new Date().toISOString()}.csv`;
    a.click();
  };

  const exportResearchToCSV = () => {
    const headers = [
      'Timestamp',
      'Problem',
      'Desired Outcome',
      'Frequency',
      'Team Size',
      'Role',
      'Company',
      'Email'
    ];

    const rows = researchData.map(r => [
      new Date(r.created_at).toLocaleString(),
      r.problem,
      r.desired_outcome,
      r.frequency,
      r.team_size,
      r.role,
      r.company_name,
      r.email
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-responses-${new Date().toISOString()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Logo showText={true} variant="dark" />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-bold">Logout</span>
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('maturity')}
              className={`flex items-center gap-2 px-6 py-3 font-bold transition-colors ${
                activeTab === 'maturity'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              <FileText className="w-5 h-5" />
              Maturity Diagnostics ({maturityData.length})
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`flex items-center gap-2 px-6 py-3 font-bold transition-colors ${
                activeTab === 'research'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              <Users className="w-5 h-5" />
              Research Responses ({researchData.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'maturity' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Maturity Diagnostics</h2>
              <button
                onClick={exportMaturityToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-2 border-black">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Date</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Name</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Email</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Company</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Role</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Score</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Level</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Archetype</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {maturityData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="border-2 border-black px-4 py-3">
                        {new Date(row.created_at).toLocaleDateString()}
                      </td>
                      <td className="border-2 border-black px-4 py-3">{row.full_name}</td>
                      <td className="border-2 border-black px-4 py-3">{row.email}</td>
                      <td className="border-2 border-black px-4 py-3">{row.company || '-'}</td>
                      <td className="border-2 border-black px-4 py-3">{row.role}</td>
                      <td className="border-2 border-black px-4 py-3 font-bold">{row.total_score}/75</td>
                      <td className="border-2 border-black px-4 py-3 font-bold">{row.maturity_level}</td>
                      <td className="border-2 border-black px-4 py-3 text-sm">{row.archetype}</td>
                      <td className="border-2 border-black px-4 py-3">{row.feedback || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Research Responses</h2>
              <button
                onClick={exportResearchToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-2 border-black">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Date</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Problem</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Desired Outcome</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Frequency</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Team Size</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Role</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Company</th>
                    <th className="border-2 border-black px-4 py-3 text-left font-bold">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {researchData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="border-2 border-black px-4 py-3">
                        {new Date(row.created_at).toLocaleDateString()}
                      </td>
                      <td className="border-2 border-black px-4 py-3 max-w-xs truncate">{row.problem}</td>
                      <td className="border-2 border-black px-4 py-3 max-w-xs truncate">{row.desired_outcome}</td>
                      <td className="border-2 border-black px-4 py-3">{row.frequency}</td>
                      <td className="border-2 border-black px-4 py-3">{row.team_size}</td>
                      <td className="border-2 border-black px-4 py-3">{row.role}</td>
                      <td className="border-2 border-black px-4 py-3">{row.company_name}</td>
                      <td className="border-2 border-black px-4 py-3">{row.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
