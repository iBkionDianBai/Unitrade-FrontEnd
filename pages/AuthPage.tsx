import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const AuthPage = () => {
  const { login, register, t } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? t.auth.loginBtn : t.auth.registerBtn}
        </h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth.username}</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth.password}</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg transform hover:-translate-y-0.5"
          >
            {isLogin ? t.auth.loginBtn : t.auth.registerBtn}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          <button onClick={() => setIsLogin(!isLogin)} className="hover:text-indigo-600 underline">
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
          {/*<div className="mt-4 text-xs text-gray-400">*/}
          {/*  For demo, try admins: admin1, admin2, admin3 (Password: any)*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;