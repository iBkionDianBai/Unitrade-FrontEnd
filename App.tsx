import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Language } from './types';
import { DICTIONARY } from './constants';
import { api } from './services/api';
import { AppContext } from './context/AppContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProductDetailPage from './pages/ProductDetailPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import SellItemPage from './pages/SellItemPage';
import AdminPage from './pages/AdminPage';
import CheckoutPage from './pages/CheckoutPage';
import PurchaseSuccessPage from './pages/PurchaseSuccessPage';
import WithdrawPage from "@/pages/WithdrawPage.dsx.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>(Language.EN);
  const [init, setInit] = useState(false);

  useEffect(() => {
    const initSession = async () => {
        const storedUser = localStorage.getItem('session_user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                // Verify user still exists/update data
                const freshUser = await api.auth.getCurrentUser(parsed.id);
                if (freshUser) {
                    // 检查用户是否被封禁
                    if (freshUser.isBanned) {
                        console.warn('User is banned, logging out');
                        localStorage.removeItem('session_user');
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        setUser(null);
                    } else {
                        setUser(freshUser);
                    }
                }
            } catch (e) {
                console.error("Session invalid", e);
                localStorage.removeItem('session_user');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
        }
        setInit(true);
    };
    initSession();
  }, []);

    const login = async (username: string, password: string) => {
        try {
            const u = await api.auth.login(username, password);
            
            // 双重检查：即使后端返回了用户，也要检查封禁状态
            if (u.isBanned) {
                throw new Error(lang === Language.CN ? '您的账号已被封禁，请联系管理员' : 'Your account has been banned. Please contact support.');
            }
            
            setUser(u);
            localStorage.setItem('session_user', JSON.stringify(u));
        } catch (error: any) {
            console.error('Login error:', error);
            // 提供更友好的错误信息
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                
                // 检查是否是封禁错误
                if (data && data.isBanned) {
                    throw new Error(lang === Language.CN ? '您的账号已被封禁，请联系管理员' : 'Your account has been banned. Please contact support.');
                }
                
                if (status === 401) {
                    throw new Error(lang === Language.CN ? '用户名或密码错误' : 'Invalid username or password');
                } else if (status === 400) {
                    if (data && data.detail) {
                        throw new Error(data.detail);
                    }
                    throw new Error(lang === Language.CN ? '请输入有效的用户名和密码' : 'Please enter valid username and password');
                } else if (status === 500) {
                    throw new Error(lang === Language.CN ? '服务器错误，请稍后重试' : 'Server error, please try again later');
                } else if (data && data.detail) {
                    throw new Error(data.detail);
                } else {
                    throw new Error(lang === Language.CN ? '登录失败，请重试' : 'Login failed, please try again');
                }
            } else if (error.request) {
                throw new Error(lang === Language.CN ? '无法连接到服务器' : 'Cannot connect to server');
            } else {
                throw new Error(error.message || (lang === Language.CN ? '登录失败' : 'Login failed'));
            }
        }
    };

    const register = async (username: string, password: string) => {
        try {
            const u = await api.auth.register(username, password);
            setUser(u);
            localStorage.setItem('session_user', JSON.stringify(u));
        } catch (error: any) {
            console.error('Register error:', error);
            // 提供更友好的错误信息
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                
                if (status === 400) {
                    if (data && data.username) {
                        throw new Error(lang === Language.CN ? '该用户名已被使用' : 'Username already exists');
                    } else if (data && data.password) {
                        throw new Error(lang === Language.CN ? '密码格式不正确' : 'Invalid password format');
                    } else {
                        throw new Error(lang === Language.CN ? '注册信息无效' : 'Invalid registration information');
                    }
                } else if (status === 500) {
                    throw new Error(lang === Language.CN ? '服务器错误，请稍后重试' : 'Server error, please try again later');
                } else if (data && data.detail) {
                    throw new Error(data.detail);
                } else {
                    throw new Error(lang === Language.CN ? '注册失败，请重试' : 'Registration failed, please try again');
                }
            } else if (error.request) {
                throw new Error(lang === Language.CN ? '无法连接到服务器' : 'Cannot connect to server');
            } else {
                throw new Error(error.message || (lang === Language.CN ? '注册失败' : 'Registration failed'));
            }
        }
    };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('session_user');
  };

  const toggleWishlist = async (productId: string) => {
      if (!user) return;
      try {
          const updatedUser = await api.auth.updateWishlist(user.id, productId);
          setUser(updatedUser);
          localStorage.setItem('session_user', JSON.stringify(updatedUser));
      } catch (e) {
          console.error("Failed to update wishlist", e);
      }
  };

  const toggleFollow = async (targetUserId: string) => {
      if (!user) return;
      try {
          const updatedUser = await api.auth.toggleFollow(user.id, targetUserId);
          setUser(updatedUser);
          localStorage.setItem('session_user', JSON.stringify(updatedUser));
      } catch (e) {
          console.error("Failed to update follow status", e);
      }
  };

  if (!init) return <div className="min-h-screen flex items-center justify-center text-indigo-600">Loading UniTrade...</div>;

  return (
    <AppContext.Provider value={{ user, login, register, logout, lang, setLang, t: DICTIONARY[lang], toggleWishlist, toggleFollow }}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
              {/* Protected Routes */}
              <Route path="/messages" element={
                  <ProtectedRoute><MessagesPage /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                  <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />
              <Route path="/profile/:id" element={
                  <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />
              <Route path="/sell" element={
                  <ProtectedRoute><SellItemPage /></ProtectedRoute>
              } />
              <Route path="/checkout/:id" element={
                  <ProtectedRoute><CheckoutPage /></ProtectedRoute>
              } />
              <Route path="/withdraw" element={
                  <ProtectedRoute><WithdrawPage /></ProtectedRoute>
              } />
              <Route path="/admin" element={
                  <ProtectedRoute><AdminPage /></ProtectedRoute>
              } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;