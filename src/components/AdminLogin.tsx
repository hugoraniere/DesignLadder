import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError('Invalid credentials');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('Authentication failed');
        return;
      }

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!adminData) {
        await supabase.auth.signOut();
        setError('Not authorized');
        return;
      }

      onLogin();
    } catch (err) {
      setError('Login failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Logo showText={true} variant="dark" />
          </div>
          <h1 className="text-4xl font-bold">Admin Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 px-8 font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? 'Logging in...' : 'Login'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
