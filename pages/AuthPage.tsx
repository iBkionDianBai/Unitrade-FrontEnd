import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { AlertCircle, Loader } from 'lucide-react';

const AuthPage = () => {
  const { login, register, t } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || t.auth.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? t.auth.loginBtn : t.auth.registerBtn}
        </h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth.username}</label>
            <input 
              type="text" 
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isLogin ? t.auth.usernamePlaceholderLogin : t.auth.usernamePlaceholderRegister}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth.password}</label>
            <input 
              type="password" 
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? t.auth.passwordPlaceholderLogin : t.auth.passwordPlaceholderRegister}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg transform hover:-translate-y-0.5 disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading && <Loader className="w-5 h-5 animate-spin" />}
            {loading ? (isLogin ? t.auth.signingIn : t.auth.creatingAccount) : (isLogin ? t.auth.loginBtn : t.auth.registerBtn)}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }} 
            disabled={loading}
            className="hover:text-indigo-600 underline disabled:cursor-not-allowed"
          >
            {isLogin ? t.auth.needAccount : t.auth.haveAccount}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;