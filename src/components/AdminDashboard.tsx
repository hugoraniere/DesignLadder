import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Search, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Logo } from './Logo';

interface Response {
  id: string;
  problem: string;
  desired_outcome: string;
  frequency: string;
  team_size: string;
  role: string;
  company_size: string;
  budget: string;
  urgency: string;
  early_tester: boolean;
  company_name: string;
  email: string;
  created_at: string;
}

export const AdminDashboard = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    frequency: '',
    role: '',
    budget: '',
    team_size: ''
  });
  const [selectedResponseIndex, setSelectedResponseIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchResponses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [responses, searchTerm, filters]);

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (err) {
      console.error('Failed to fetch responses:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...responses];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.problem.toLowerCase().includes(term) ||
        r.desired_outcome.toLowerCase().includes(term) ||
        r.company_name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term)
      );
    }

    if (filters.frequency) {
      filtered = filtered.filter(r => r.frequency === filters.frequency);
    }
    if (filters.role) {
      filtered = filtered.filter(r => r.role === filters.role);
    }
    if (filters.budget) {
      filtered = filtered.filter(r => r.budget === filters.budget);
    }
    if (filters.team_size) {
      filtered = filtered.filter(r => r.team_size === filters.team_size);
    }

    setFilteredResponses(filtered);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const exportToCSV = () => {
    const headers = [
      'Timestamp',
      'Problem',
      'Desired Outcome',
      'Frequency',
      'Team Size',
      'Role',
      'Company Size',
      'Budget',
      'Urgency',
      'Early Tester',
      'Company Name',
      'Email'
    ];

    const rows = filteredResponses.map(r => [
      new Date(r.created_at).toLocaleString(),
      `"${r.problem.replace(/"/g, '""')}"`,
      `"${r.desired_outcome.replace(/"/g, '""')}"`,
      r.frequency,
      r.team_size,
      r.role,
      r.company_size,
      r.budget,
      r.urgency,
      r.early_tester ? 'Yes' : 'No',
      `"${r.company_name.replace(/"/g, '""')}"`,
      r.email
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-ladder-responses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatFrequency = (freq: string) => {
    const map: Record<string, string> = {
      'once_in_a_while': 'Once in a while',
      'weekly': 'Weekly',
      'daily': 'Daily',
      'multiple_times_daily': 'Multiple times a day'
    };
    return map[freq] || freq;
  };

  const formatRole = (role: string) => {
    const map: Record<string, string> = {
      'head_manager': 'Head / Manager',
      'ic': 'IC (Designer, Researcher, Writer)',
      'product_manager': 'Product Manager',
      'engineer': 'Engineer',
      'founder_ceo': 'Founder / CEO',
      'freelancer': 'Freelancer / Contractor',
      'designer': 'Product Designer',
      'lead': 'Design Lead / Manager',
      'director': 'Design Director / VP',
      'ops': 'DesignOps / Operations',
      'founder': 'Founder / C-level',
      'pm': 'Product Manager',
      'other': 'Other'
    };
    return map[role] || role;
  };

  const openResponseModal = (index: number) => {
    setSelectedResponseIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeResponseModal = () => {
    setIsModalOpen(false);
    setSelectedResponseIndex(null);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    if (selectedResponseIndex !== null && selectedResponseIndex > 0) {
      setSelectedResponseIndex(selectedResponseIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedResponseIndex !== null && selectedResponseIndex < filteredResponses.length - 1) {
      setSelectedResponseIndex(selectedResponseIndex + 1);
    }
  };

  const selectedResponse = selectedResponseIndex !== null ? filteredResponses[selectedResponseIndex] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo showText={false} variant="dark" className="scale-75" />
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-600">Design Ladder</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-bold">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">
            {filteredResponses.length} responses
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="font-bold">Export CSV</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search responses..."
              className="w-full pl-12 pr-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
              value={filters.frequency}
              onChange={(e) => setFilters({ ...filters, frequency: e.target.value })}
            >
              <option value="">All Frequencies</option>
              <option value="once_in_a_while">Once in a while</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
              <option value="multiple_times_daily">Multiple times a day</option>
            </select>

            <select
              className="px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
              <option value="">All Roles</option>
              <option value="head_manager">Head / Manager</option>
              <option value="ic">IC (Designer, Researcher, Writer)</option>
              <option value="product_manager">Product Manager</option>
              <option value="engineer">Engineer</option>
              <option value="founder_ceo">Founder / CEO</option>
              <option value="freelancer">Freelancer / Contractor</option>
              <option value="other">Other</option>
            </select>

            <select
              className="px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
              value={filters.budget}
              onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
            >
              <option value="">All Budgets</option>
              <option value="5-10">$5–$10 / month</option>
              <option value="10-25">$10–$25 / month</option>
              <option value="25-50">$25–$50 / month</option>
              <option value="50-100">$50–$100 / month</option>
              <option value="100+">$100+</option>
              <option value="depends">Depends on the impact</option>
            </select>

            <select
              className="px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white"
              value={filters.team_size}
              onChange={(e) => setFilters({ ...filters, team_size: e.target.value })}
            >
              <option value="">All Team Sizes</option>
              <option value="1">1 (solo)</option>
              <option value="2-5">2–5</option>
              <option value="6-10">6–10</option>
              <option value="11-20">11–20</option>
              <option value="21-50">21–50</option>
              <option value="50+">50+</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border-2 border-black">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-sm">Timestamp</th>
                <th className="px-4 py-3 text-left font-bold text-sm">Problem</th>
                <th className="px-4 py-3 text-left font-bold text-sm">Desired Outcome</th>
                <th className="px-4 py-3 text-left font-bold text-sm">Frequency</th>
                <th className="px-4 py-3 text-left font-bold text-sm">Team Size</th>
                <th className="px-4 py-3 text-left font-bold text-sm">Role</th>
                <th className="px-4 py-3 text-left font-bold text-sm">Company Size</th>
                <th className="px-4 py-3 text-left font-bold text-sm">Budget</th>
                <th className="px-4 py-3 text-left font-bold text-sm">Urgency</th>
                <th className="px-4 py-3 text-left font-bold text-sm">Early Tester</th>
                <th className="px-4 py-3 text-left font-bold text-sm">Company</th>
                <th className="px-4 py-3 text-left font-bold text-sm">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredResponses.map((response, index) => (
                <tr
                  key={response.id}
                  onClick={() => openResponseModal(index)}
                  className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} cursor-pointer hover:bg-gray-200 transition-colors`}
                >
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {new Date(response.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm max-w-xs">
                    <div className="line-clamp-2">{response.problem}</div>
                  </td>
                  <td className="px-4 py-3 text-sm max-w-xs">
                    <div className="line-clamp-2">{response.desired_outcome}</div>
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {formatFrequency(response.frequency)}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {response.team_size}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {formatRole(response.role)}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {response.company_size}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {response.budget}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {response.urgency.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {response.early_tester ? 'Yes' : 'No'}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {response.company_name}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {response.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredResponses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No responses found
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={closeResponseModal}
          />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-black px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold">Response Details</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevious}
                  disabled={selectedResponseIndex === 0}
                  className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                  aria-label="Previous response"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold px-2">
                  {(selectedResponseIndex ?? 0) + 1} / {filteredResponses.length}
                </span>
                <button
                  onClick={goToNext}
                  disabled={selectedResponseIndex === filteredResponses.length - 1}
                  className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                  aria-label="Next response"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={closeResponseModal}
                  className="p-2 ml-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Timestamp</label>
                  <p className="text-base">{new Date(selectedResponse.created_at).toLocaleString()}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Email</label>
                  <p className="text-base break-all">{selectedResponse.email}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Company Name</label>
                  <p className="text-base">{selectedResponse.company_name}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Role</label>
                  <p className="text-base">{formatRole(selectedResponse.role)}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Company Size</label>
                  <p className="text-base">{selectedResponse.company_size}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Team Size</label>
                  <p className="text-base">{selectedResponse.team_size}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Frequency</label>
                  <p className="text-base">{formatFrequency(selectedResponse.frequency)}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Budget</label>
                  <p className="text-base">{selectedResponse.budget}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Urgency</label>
                  <p className="text-base">{selectedResponse.urgency.replace(/_/g, ' ')}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Early Tester</label>
                  <p className="text-base">{selectedResponse.early_tester ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Problem</label>
                <p className="text-base whitespace-pre-wrap">{selectedResponse.problem}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Desired Outcome</label>
                <p className="text-base whitespace-pre-wrap">{selectedResponse.desired_outcome}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
