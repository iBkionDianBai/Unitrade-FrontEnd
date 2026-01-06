// ibkiondianbai/unitrade-frontend/.../pages/ProfilePage.tsx

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { api } from '../services/api';
import { Product, User } from '../types';
import {
    ShoppingBag,
    Tag,
    MessageCircle,
    UserX,
    ShieldCheck,
    UserPlus,
    UserCheck,
    Wallet,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Edit2
} from 'lucide-react';

const ProfilePage = () => {
    const { user: currentUser, t, toggleFollow, setUser} = useContext(AppContext);
    const { id } = useParams();
    const navigate = useNavigate();

    // 确定展示哪个用户的资料
    const targetUserId = id || currentUser?.id;
    const isOwnProfile = currentUser && targetUserId === currentUser.id;

    // 状态管理
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'listings' | 'wishlist' | 'history' | 'following'>('listings');
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioDraft, setBioDraft] = useState('');
    const [savingBio, setSavingBio] = useState(false);

    // 数据状态
    const [myActiveListings, setMyActiveListings] = useState<Product[]>([]);
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [soldHistory, setSoldHistory] = useState<Product[]>([]);
    const [purchasedHistory, setPurchasedHistory] = useState<Product[]>([]);
    const [followedUsers, setFollowedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!targetUserId) return;
        setLoading(true);
        try {
            // 获取用户信息
            const u = await api.users.get(targetUserId);
            setProfileUser(u);
            setBioDraft(u.bio || '');

            // 获取资料关联数据
            const data = await api.users.getProfileData(targetUserId);
            setMyActiveListings(data.listings || []);
            setWishlistProducts(data.wishlist || []);
            setSoldHistory(data.sold || []);
            setPurchasedHistory(data.bought || []);
            setFollowedUsers(data.followedUsers || []);
        } catch (error) {
            console.error("Error fetching profile data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [targetUserId, user, isOwnProfile]);

    // 处理确认收货
    const handleConfirmReceived = async (e: React.MouseEvent, productId: string) => {
        e.stopPropagation();
        if(!currentUser) return;
        try {
            await api.products.confirmReceived(productId, currentUser.id);
            alert(t.admin.confirmMsg || "Item received! Funds transferred to seller.");
            fetchData(); // 刷新数据以更新余额和状态
        } catch (err) {
            alert("Failed to confirm receipt.");
        }
    };

    const handleChat = async (e: React.MouseEvent, product?: Product) => {
        e.stopPropagation();
        if (!currentUser) return navigate('/auth');
        const targetId = product ? product.sellerId : profileUser?.id;
        if (!targetId) return;

        const initialMsg = product ? `Hi, I'm interested in your ${product.title}.` : `Hi!`;
        await api.messages.send(currentUser.id, targetId, initialMsg);
        navigate('/messages', { state: { sellerId: targetId } });
    };

    const isFollowing = currentUser?.following?.includes(profileUser?.id || '');

    const handleProfileFollow = async () => {
        if (!currentUser) return navigate('/auth');
        if (profileUser) await toggleFollow(profileUser.id);
    };

    const handleUnfollowFromList = async (e: React.MouseEvent, targetId: string) => {
        e.stopPropagation();
        await toggleFollow(targetId);
        if (isOwnProfile) {
            setFollowedUsers(followedUsers.filter(u => u.id !== targetId));
        }
    };

    if (!targetUserId && !loading) return <Navigate to="/auth" />;
    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
    if (!profileUser) return <div className="text-center py-20">User not found</div>;

    // 通用商品卡片渲染
    const renderProductCard = (product: Product, isHistory = false) => (
        <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 cursor-pointer hover:shadow-lg transition relative group">
            <img src={product.image} className="w-24 h-24 rounded-xl object-cover bg-gray-200 flex-shrink-0" alt={product.title}/>
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <div className="font-bold text-gray-800 line-clamp-1 pr-2">{product.title}</div>
                        <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                            product.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-600' :
                                product.status === 'SOLD' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                        }`}>
                            {product.status === 'RECEIVED' ? 'Completed' : product.status}
                        </span>
                    </div>
                    <div className="text-indigo-600 font-black">${product.price}</div>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="text-[10px] text-gray-400 font-medium">
                        {product.viewCount} views • {product.createdAt.split('T')[0]}
                    </div>

                    {/* 买家确认收货按钮 */}
                    {isHistory && isOwnProfile && product.status === 'SOLD' && product.buyerId === currentUser?.id && (
                        <button
                            onClick={(e) => handleConfirmReceived(e, product.id)}
                            className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition shadow-sm"
                        >
                            Confirm Received
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* 顶部个人资料卡片 */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 -z-10"></div>
                <img src={profileUser.avatar} className="w-32 h-32 rounded-full border-4 border-white shadow-xl z-10 object-cover" alt="profile"/>
                <div className="text-center md:text-left flex-1 z-10 mt-4">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-1">{profileUser.username}</h1>
                            <p className="text-gray-500 text-sm mb-4 max-w-lg leading-relaxed">{profileUser.bio || "This user prefers to keep a low profile."}</p>
                        </div>
                        {!isOwnProfile && (
                            <div className="flex gap-2">
                                <button onClick={(e) => handleChat(e)} className="p-3 text-indigo-600 bg-white border border-indigo-100 rounded-xl hover:bg-indigo-50 transition shadow-sm">
                                    <MessageCircle className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleProfileFollow}
                                    className={`flex items-center px-6 py-3 font-bold rounded-xl transition shadow-md text-sm ${isFollowing ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'}`}
                                >
                                    {isFollowing ? <><UserCheck className="w-4 h-4 mr-2" /> {t.product.following}</> : <><UserPlus className="w-4 h-4 mr-2" /> {t.product.follow}</>}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-2">
                        <div className="bg-white border border-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center shadow-sm">
                            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> {t.product.credit}: {profileUser.creditScore}
                        </div>
                        <div className="bg-gray-50 text-gray-500 px-4 py-1.5 rounded-full text-xs font-bold border border-gray-100 uppercase tracking-tighter">
                            {profileUser.role}
                        </div>
                    </div>
                </div>
            </div>

            {/* 钱包区域 (仅自己可见) */}
            {isOwnProfile && (
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                            <Wallet className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Available Balance</p>
                            <h2 className="text-4xl font-black tabular-nums">${currentUser.walletBalance?.toFixed(2) || '0.00'}</h2>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/withdraw')}
                        className="w-full md:w-auto px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition flex items-center justify-center shadow-lg transform active:scale-95"
                    >
                        <ArrowUpRight className="w-5 h-5 mr-2" /> {t.admin.withdraw}
                    </button>
                </div>
            )}

            {/* 标签页导航 */}
            <div className="bg-white p-1.5 rounded-2xl border border-gray-100 flex gap-2 w-fit">
                {(['listings', 'wishlist', 'history', 'following'] as const).map(tab => {
                    if (tab === 'wishlist' && !isOwnProfile) return null;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition capitalize ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab === 'listings' && isOwnProfile ? t.profile.myListings : t.profile[tab as keyof typeof t.profile] || tab}
                        </button>
                    );
                })}
            </div>

            {/* 列表内容 */}
            <div className="min-h-[400px]">
                {activeTab === 'listings' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {myActiveListings.length > 0 ? myActiveListings.map(p => renderProductCard(p)) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                <Tag className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-medium">{t.home.noItems}</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'wishlist' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {wishlistProducts.length > 0 ? wishlistProducts.map(p => renderProductCard(p)) : (
                            <div className="col-span-full text-center py-20 text-gray-400 italic">{t.profile.noWishlist}</div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-12">
                        {/* 购买记录 (私密) */}
                        {isOwnProfile && (
                            <section>
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-indigo-600" /> {t.profile.bought}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {purchasedHistory.length > 0 ? purchasedHistory.map(p => renderProductCard(p, true)) : (
                                        <p className="text-gray-400 text-sm italic py-4">{t.profile.noHistory}</p>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* 卖出记录 (公开) */}
                        <section>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-500" /> {t.profile.sold}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {soldHistory.length > 0 ? soldHistory.map(p => renderProductCard(p)) : (
                                    <p className="text-gray-400 text-sm italic py-4">{t.profile.noHistory}</p>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'following' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {followedUsers.length > 0 ? followedUsers.map(u => (
                            <div
                                key={u.id}
                                onClick={() => navigate(`/profile/${u.id}`)}
                                className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition cursor-pointer group relative"
                            >
                                <img src={u.avatar} className="w-16 h-16 rounded-2xl border border-gray-100 group-hover:scale-105 transition object-cover" alt={u.username} />
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition">{u.username}</h3>
                                    <p className="text-gray-400 text-xs truncate mb-2 uppercase font-black tracking-tighter">{u.role}</p>
                                    <div className="text-[10px] text-green-600 font-bold flex items-center">
                                        <ShieldCheck className="w-3 h-3 mr-1" /> Score: {u.creditScore}
                                    </div>
                                </div>
                                {isOwnProfile && (
                                    <button
                                        onClick={(e) => handleUnfollowFromList(e, u.id)}
                                        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                    >
                                        <UserX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-20 text-gray-400 italic">{t.profile.noFollowing}</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;