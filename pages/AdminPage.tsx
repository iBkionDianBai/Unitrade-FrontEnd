import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { api } from '../services/api';
import { UserRole, User, Product } from '../types';
import { AlertTriangle } from 'lucide-react';

const AdminPage = () => {
    const { user, t } = useContext(AppContext);
    const [tab, setTab] = useState<'users' | 'products'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Confirmation Modal State
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        type: 'USER' | 'PRODUCT' | null;
        item: User | Product | null;
    }>({ isOpen: false, type: null, item: null });

    useEffect(() => {
        if(user?.role !== UserRole.ADMIN) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                if (tab === 'users') {
                    const res = await api.admin.getAllUsers();
                    setUsers(res);
                } else {
                    const res = await api.admin.getAllProducts();
                    setProducts(res);
                }
            } catch(e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, tab]);

    if (user?.role !== UserRole.ADMIN) return <Navigate to="/" />;

    const handleBanClick = (u: User) => {
        setConfirmState({ isOpen: true, type: 'USER', item: u });
    };

    const handleProductClick = (p: Product) => {
        setConfirmState({ isOpen: true, type: 'PRODUCT', item: p });
    };

    const executeAction = async () => {
        if (!confirmState.item) return;
        
        // Close modal and show loading state
        setConfirmState({ ...confirmState, isOpen: false });
        setLoading(true);

        try {
            if (confirmState.type === 'USER') {
                const u = confirmState.item as User;
                await api.admin.toggleBanUser(u.id, !u.isBanned);
                const res = await api.admin.getAllUsers(); // Refresh
                setUsers(res);
            } else {
                const p = confirmState.item as Product;
                const newStatus = p.status === 'BANNED' ? 'ACTIVE' : 'BANNED';
                await api.admin.toggleProductStatus(p.id, newStatus);
                const res = await api.admin.getAllProducts(); // Refresh
                setProducts(res);
            }
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
            setConfirmState({ isOpen: false, type: null, item: null });
        }
    };

    const getConfirmText = () => {
        if (!confirmState.item) return { title: '', message: '', actionBtn: '', isDestructive: false };
        
        if (confirmState.type === 'USER') {
            const u = confirmState.item as User;
            const action = u.isBanned ? t.admin.unban : t.admin.ban;
            const isDestructive = !u.isBanned; // Banning is destructive
            return {
                title: `${action} User`,
                message: `Are you sure you want to ${action.toLowerCase()} user "${u.username}"? ${isDestructive ? 'They will lose access to the platform.' : ''}`,
                actionBtn: action,
                isDestructive
            };
        } else {
            const p = confirmState.item as Product;
            const isBanned = p.status === 'BANNED';
            const action = isBanned ? t.admin.restore : t.admin.takedown;
            const isDestructive = !isBanned; // Taking down is destructive
            return {
                title: `${action} Product`,
                message: `Are you sure you want to ${action.toLowerCase()} the product "${p.title}"?`,
                actionBtn: action,
                isDestructive
            };
        }
    };

    const confirmInfo = getConfirmText();

    return (
        <div className="space-y-6 relative">
            <h1 className="text-2xl font-bold">{t.admin.dashboard}</h1>
            <div className="flex space-x-4 mb-4">
                <button onClick={()=>setTab('users')} className={`px-4 py-2 rounded-lg font-medium ${tab==='users'?'bg-indigo-600 text-white':'bg-white text-gray-600'}`}>{t.admin.users}</button>
                <button onClick={()=>setTab('products')} className={`px-4 py-2 rounded-lg font-medium ${tab==='products'?'bg-indigo-600 text-white':'bg-white text-gray-600'}`}>{t.admin.products}</button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tab === 'users' ? 'User' : 'Product'}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tab === 'users' ? users.map(u => (
                                    <tr key={u.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img className="h-8 w-8 rounded-full mr-2" src={u.avatar} alt=""/>
                                                <div className="text-sm font-medium text-gray-900">{u.username}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {u.isBanned ? 'Banned' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={()=>handleBanClick(u)} className="text-indigo-600 hover:text-indigo-900">{u.isBanned ? t.admin.unban : t.admin.ban}</button>
                                        </td>
                                    </tr>
                                )) : products.map(p => (
                                    <tr key={p.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === 'BANNED' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={()=>handleProductClick(p)} className="text-indigo-600 hover:text-indigo-900">
                                                {p.status === 'BANNED' ? t.admin.restore : t.admin.takedown}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {confirmState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-full ${confirmInfo.isDestructive ? 'bg-red-100' : 'bg-indigo-100'}`}>
                                <AlertTriangle className={`w-6 h-6 ${confirmInfo.isDestructive ? 'text-red-600' : 'text-indigo-600'}`} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">{confirmInfo.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {confirmInfo.message}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setConfirmState({...confirmState, isOpen: false})} 
                                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={executeAction} 
                                className={`px-4 py-2 text-white font-medium rounded-lg transition shadow-lg ${confirmInfo.isDestructive ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'}`}
                            >
                                {confirmInfo.actionBtn}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;