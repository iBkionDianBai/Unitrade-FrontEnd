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
                if (freshUser) setUser(freshUser);
            } catch (e) {
                console.error("Session invalid", e);
                localStorage.removeItem('session_user');
            }
        }
        setInit(true);
    };
    initSession();
  }, []);

    const login = async (username: string, password: string) => { // Added password here
        const u = await api.auth.login(username, password);       // Passing both here
        setUser(u);
        localStorage.setItem('session_user', JSON.stringify(u));
    };

    const register = async (username: string, password: string) => { // Added password here
        const u = await api.auth.register(username, password);       // Passing both here
        setUser(u);
        localStorage.setItem('session_user', JSON.stringify(u));
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