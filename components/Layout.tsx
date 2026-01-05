import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  MessageCircle, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  Globe, 
  PlusCircle 
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { UserRole, Language } from '../types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, t, lang, setLang } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: t.nav.home, icon: ShoppingBag },
    { path: '/messages', label: t.nav.messages, icon: MessageCircle },
    { path: '/profile', label: t.nav.profile, icon: UserIcon },
  ];

  if (user?.role === UserRole.ADMIN) {
    navItems.push({ path: '/admin', label: t.nav.admin, icon: ShieldCheck });
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-slate-800">
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              UniTrade
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setLang(lang === Language.EN ? Language.CN : Language.EN)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <Globe className="w-5 h-5" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-3">
                 <button onClick={() => navigate('/sell')} className="hidden sm:flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition shadow-md hover:shadow-lg">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {t.nav.sell}
                </button>
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" />
                <button onClick={logout} className="text-gray-500 hover:text-red-600">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={() => navigate('/auth')} className="text-indigo-600 font-medium">
                {t.nav.login}
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition-enter-active">
        {children}
      </main>
    </div>
  );
};

export default Layout;