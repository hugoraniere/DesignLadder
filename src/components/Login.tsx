import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';

interface LoginProps {
  onToggleMode: () => void;
}

export const Login = ({ onToggleMode }: LoginProps) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos');
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      window.location.hash = '#app';
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Logo showText={true} variant="dark" />
          <h1 className="text-3xl font-bold mt-8 mb-2">Entrar na plataforma</h1>
          <p className="text-gray-600">Gerencie seus roadmaps de design</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-600 p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 px-8 font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-gray-600 hover:text-black transition-colors"
              disabled={loading}
            >
              Não tem conta? <span className="font-bold underline">Criar conta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
