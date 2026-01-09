import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { api } from '../services/api';
import { UserRole, User, Product } from '../types';
import { AlertTriangle, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../constants';

const AdminPage = () => {
    const { user, t } = useContext(AppContext);
    const [tab, setTab] = useState<'users' | 'products'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    
    // 分页状态
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    
    // 筛选状态
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);

    // Confirmation Modal State
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        type: 'USER' | 'PRODUCT' | null;
        item: User | Product | null;
    }>({ isOpen: false, type: null, item: null });
    
    // Takedown reason state
    const [takedownReason, setTakedownReason] = useState('');
    const [reasonError, setReasonError] = useState('');

    useEffect(() => {
        if(user?.role !== UserRole.ADMIN) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                if (tab === 'users') {
                    const params = {
                        page: currentPage,
                        pageSize,
                        search: searchTerm || undefined,
                        isBanned: statusFilter === 'BANNED' ? true : statusFilter === 'ACTIVE' ? false : undefined,
                        role: roleFilter || undefined,
                    };
                    const res = await api.admin.getAllUsers(params);
                    setUsers(res.results || []);
                    setTotal(res.total || 0);
                    setTotalPages(res.totalPages || 1);
                } else {
                    const params = {
                        page: currentPage,
                        pageSize,
                        search: searchTerm || undefined,
                        status: statusFilter || undefined,
                        category: categoryFilter || undefined,
                    };
                    const res = await api.admin.getAllProducts(params);
                    setProducts(res.results || []);
                    setTotal(res.total || 0);
                    setTotalPages(res.totalPages || 1);
                }
            } catch(e) {
                console.error(e);
                // 确保在错误时设置空数组
                if (tab === 'users') {
                    setUsers([]);
                } else {
                    setProducts([]);
                }
                setTotal(0);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, tab, currentPage, pageSize, searchTerm, statusFilter, categoryFilter, roleFilter]);
    
    // 切换标签时重置筛选和分页
    useEffect(() => {
        setCurrentPage(1);
        setSearchTerm('');
        setStatusFilter('');
        setCategoryFilter('');
        setRoleFilter('');
    }, [tab]);

    if (user?.role !== UserRole.ADMIN) return <Navigate to="/" />;

    const handleBanClick = (u: User) => {
        setConfirmState({ isOpen: true, type: 'USER', item: u });
    };

    const handleProductClick = (p: Product) => {
        setConfirmState({ isOpen: true, type: 'PRODUCT', item: p });
        setTakedownReason('');
        setReasonError('');
    };

    const executeAction = async () => {
        if (!confirmState.item) return;
        
        // 如果是下架商品操作，需要验证原因
        if (confirmState.type === 'PRODUCT') {
            const p = confirmState.item as Product;
            if (p.status !== 'BANNED' && !takedownReason.trim()) {
                setReasonError(t.admin.takedownReasonRequired);
                return;
            }
        }
        
        // Close modal and show loading state
        setConfirmState({ ...confirmState, isOpen: false });
        setLoading(true);

        try {
            if (confirmState.type === 'USER') {
                const u = confirmState.item as User;
                await api.admin.toggleBanUser(u.id, !u.isBanned);
                // Refresh current page
                const params = {
                    page: currentPage,
                    pageSize,
                    search: searchTerm || undefined,
                    isBanned: statusFilter === 'BANNED' ? true : statusFilter === 'ACTIVE' ? false : undefined,
                    role: roleFilter || undefined,
                };
                const res = await api.admin.getAllUsers(params);
                setUsers(res.results || []);
                setTotal(res.total || 0);
                setTotalPages(res.totalPages || 1);
            } else {
                const p = confirmState.item as Product;
                const newStatus = p.status === 'BANNED' ? 'ACTIVE' : 'BANNED';
                await api.admin.toggleProductStatus(p.id, newStatus, takedownReason.trim() || undefined);
                // Refresh current page
                const params = {
                    page: currentPage,
                    pageSize,
                    search: searchTerm || undefined,
                    status: statusFilter || undefined,
                    category: categoryFilter || undefined,
                };
                const res = await api.admin.getAllProducts(params);
                setProducts(res.results || []);
                setTotal(res.total || 0);
                setTotalPages(res.totalPages || 1);
            }
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
            setConfirmState({ isOpen: false, type: null, item: null });
            setTakedownReason('');
            setReasonError('');
        }
    };
    
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); // 重置到第一页
    };
    
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getConfirmText = () => {
        if (!confirmState.item) return { title: '', message: '', actionBtn: '', isDestructive: false };
        
        if (confirmState.type === 'USER') {
            const u = confirmState.item as User;
            const isBanning = !u.isBanned;
            const action = u.isBanned ? t.admin.unban : t.admin.ban;
            const confirmMsg = u.isBanned 
                ? `${t.admin.confirmUnbanUser} "${u.username}"?`
                : `${t.admin.confirmBanUser} "${u.username}"? ${t.admin.userWillLoseAccess}`;
            
            return {
                title: `${action} ${t.admin.user}`,
                message: confirmMsg,
                actionBtn: action,
                isDestructive: isBanning
            };
        } else {
            const p = confirmState.item as Product;
            const isBanned = p.status === 'BANNED';
            const action = isBanned ? t.admin.restore : t.admin.takedown;
            const confirmMsg = isBanned
                ? `${t.admin.confirmRestoreProduct} "${p.title}"?`
                : `${t.admin.confirmTakedownProduct} "${p.title}"?`;
            
            return {
                title: `${action}${t.admin.product}`,
                message: confirmMsg,
                actionBtn: action,
                isDestructive: !isBanned
            };
        }
    };

    const confirmInfo = getConfirmText();

    return (
        <div className="space-y-6 relative">
            <h1 className="text-2xl font-bold">{t.admin.dashboard}</h1>
            
            {/* 标签切换 */}
            <div className="flex space-x-4 mb-4">
                <button onClick={()=>setTab('users')} className={`px-4 py-2 rounded-lg font-medium ${tab==='users'?'bg-indigo-600 text-white':'bg-white text-gray-600'}`}>{t.admin.users}</button>
                <button onClick={()=>setTab('products')} className={`px-4 py-2 rounded-lg font-medium ${tab==='products'?'bg-indigo-600 text-white':'bg-white text-gray-600'}`}>{t.admin.products}</button>
            </div>
            
            {/* 搜索和筛选栏 */}
            <div className="bg-white rounded-xl shadow p-4 space-y-4">
                <div className="flex gap-3 flex-wrap items-center">
                    {/* 搜索框 */}
                    <div className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={tab === 'users' ? t.admin.searchUsers : t.admin.searchProducts}
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    
                    {/* 筛选按钮 */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${showFilters ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <Filter className="w-4 h-4" />
                        {t.admin.filter}
                    </button>
                    
                    {/* 每页显示数量 */}
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value={5}>5 {t.admin.perPage}</option>
                        <option value={10}>10 {t.admin.perPage}</option>
                        <option value={20}>20 {t.admin.perPage}</option>
                        <option value={50}>50 {t.admin.perPage}</option>
                    </select>
                </div>
                
                {/* 筛选选项 */}
                {showFilters && (
                    <div className="flex gap-3 flex-wrap pt-3 border-t border-gray-200">
                        {tab === 'users' ? (
                            <>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">{t.admin.allStatus}</option>
                                    <option value="ACTIVE">{t.admin.statusActive}</option>
                                    <option value="BANNED">{t.admin.bannedStatus}</option>
                                </select>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => {
                                        setRoleFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">{t.admin.allRoles}</option>
                                    <option value="STUDENT">{t.admin.roleStudent}</option>
                                    <option value="ADMIN">{t.admin.roleAdmin}</option>
                                </select>
                            </>
                        ) : (
                            <>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">{t.admin.allStatus}</option>
                                    <option value="ACTIVE">{t.admin.statusActive}</option>
                                    <option value="SOLD">{t.admin.statusSold}</option>
                                    <option value="RECEIVED">{t.admin.statusReceived}</option>
                                    <option value="BANNED">{t.admin.bannedStatus}</option>
                                </select>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => {
                                        setCategoryFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">{t.admin.allCategories}</option>
                                    {CATEGORIES.filter(cat => cat !== 'All').map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('');
                                setCategoryFilter('');
                                setRoleFilter('');
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                        >
                            {t.admin.clearFilters}
                        </button>
                    </div>
                )}
                
                {/* 结果统计 */}
                <div className="text-sm text-gray-600">
                    {t.admin.totalRecords} {total} {t.admin.records}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.admin.id}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tab === 'users' ? 'User' : 'Product'}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.admin.status}</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.admin.action}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tab === 'users' ? (users && users.length > 0 ? users.map(u => (
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
                                                {u.isBanned ? t.admin.bannedStatus : t.admin.activeStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={()=>handleBanClick(u)} className="text-indigo-600 hover:text-indigo-900">{u.isBanned ? t.admin.unban : t.admin.ban}</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            {t.home.noItems}
                                        </td>
                                    </tr>
                                )) : (products && products.length > 0 ? products.map(p => (
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
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            {t.home.noItems}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* 分页控件 */}
                    {totalPages > 1 && (
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {t.admin.prevPage}
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {t.admin.nextPage}
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        {t.admin.showing} <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> {t.admin.to}{' '}
                                        <span className="font-medium">{Math.min(currentPage * pageSize, total)}</span> {t.admin.of}{' '}
                                        <span className="font-medium">{total}</span> {t.admin.records}
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                                                currentPage === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        
                                        {/* 页码按钮 */}
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        currentPage === pageNum
                                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                                                currentPage === totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
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
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            {confirmInfo.message}
                        </p>
                        
                        {/* 下架原因输入框 - 仅在下架商品时显示 */}
                        {confirmState.type === 'PRODUCT' && confirmState.item && (confirmState.item as Product).status !== 'BANNED' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.admin.takedownReason}
                                </label>
                                <textarea
                                    value={takedownReason}
                                    onChange={(e) => {
                                        setTakedownReason(e.target.value);
                                        setReasonError('');
                                    }}
                                    placeholder={t.admin.takedownReasonPlaceholder}
                                    rows={3}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                                        reasonError ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {reasonError && (
                                    <p className="mt-1 text-sm text-red-600">{reasonError}</p>
                                )}
                            </div>
                        )}
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => {
                                    setConfirmState({...confirmState, isOpen: false});
                                    setTakedownReason('');
                                    setReasonError('');
                                }} 
                                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                            >
                                {t.admin.cancel}
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