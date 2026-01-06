import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { api } from '../services/api';
import { Product, User } from '../types';
import { ShoppingBag, Tag, MessageCircle, UserX, ShieldCheck, UserPlus, UserCheck } from 'lucide-react';

const ProfilePage = () => {
    const { user, t, toggleFollow } = useContext(AppContext);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    // Determine which user profile to show
    // If 'id' param exists, show that user. Otherwise show logged-in user.
    const targetUserId = id || user?.id;
    const isOwnProfile = user && targetUserId === user.id;

    // State
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'listings' | 'wishlist' | 'history' | 'following'>('listings');
    
    // Data State
    const [myActiveListings, setMyActiveListings] = useState<Product[]>([]);
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [soldHistory, setSoldHistory] = useState<Product[]>([]);
    const [purchasedHistory, setPurchasedHistory] = useState<Product[]>([]);
    const [followedUsers, setFollowedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!targetUserId) return;
        
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch User Details if not own profile (or refresh own)
                let u = user;
                if (!isOwnProfile || !u) {
                    u = await api.users.get(targetUserId);
                }
                setProfileUser(u);

                // Fetch Profile Content
                const data = await api.users.getProfileData(targetUserId);
                setMyActiveListings(data.listings);
                setWishlistProducts(data.wishlist);
                setSoldHistory(data.sold);
                setPurchasedHistory(data.bought);
                setFollowedUsers(data.followedUsers || []);
            } catch (error) {
                console.error("Error fetching profile data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [targetUserId, user, isOwnProfile]);

    if (!targetUserId && !loading) return <Navigate to="/auth" />;
    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
    if (!profileUser) return <div className="text-center py-20">User not found</div>;

    const handleConfirmReceived = async (productId: string) => {
        if(!user) return;
        await api.products.confirmReceived(productId, user.id);
        // 刷新数据
        fetchData();
    };

    const handleWithdrawSubmit = async () => {
        if(!user) return;
        const res = await api.users.withdraw(user.id, Number(withdrawAmount), cardNumber);
        setUser({ ...user, walletBalance: res.newBalance });
        setShowWithdraw(false);
        alert("提现已受理，资金将在24小时内到账。");
    };

    const handleChat = async (e: React.MouseEvent, product?: Product) => {
        e.stopPropagation();
        if (!user) return navigate('/auth');
        if (product) {
            await api.messages.send(user.id, product.sellerId, `Hi, I'm interested in your ${product.title}.`);
        } else {
            await api.messages.send(user.id, profileUser.id, `Hi!`);
        }
        navigate('/messages');
    };

    const isFollowing = user?.following?.includes(profileUser.id);

    const handleProfileFollow = async () => {
        if (!user) return navigate('/auth');
        await toggleFollow(profileUser.id);
    }

    const handleUnfollowFromList = async (e: React.MouseEvent, targetId: string) => {
        e.stopPropagation();
        await toggleFollow(targetId);
        // Optimistically update list if we are viewing own profile
        if (isOwnProfile) {
            setFollowedUsers(followedUsers.filter(u => u.id !== targetId));
        }
    };

    const renderProductCard = (product: Product, showStatus = false, showChat = false) => (
         <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 cursor-pointer hover:shadow-md transition relative group">
            <img src={product.image} className="w-24 h-24 rounded-lg object-cover bg-gray-200 flex-shrink-0" alt={product.title}/>
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <div className="font-semibold text-gray-800 line-clamp-1 pr-2">{product.title}</div>
                        {showStatus && (
                             <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                                 product.status === 'SOLD' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'
                             }`}>
                                 {product.status}
                             </span>
                        )}
                    </div>
                    <div className="text-indigo-600 font-bold">${product.price}</div>
                </div>
                
                <div className="flex justify-between items-end mt-2">
                    <div className="text-xs text-gray-400">
                        {product.viewCount} views • {product.createdAt.split('T')[0]}
                    </div>
                    {showChat && product.status === 'ACTIVE' && product.sellerId !== user?.id && (
                        <button 
                            onClick={(e) => handleChat(e, product)}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-100 hover:text-indigo-800 transition shadow-sm z-10"
                        >
                            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                            {t.product.chatNow}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-50 to-purple-50 -z-10"></div>
                <img src={profileUser.avatar} className="w-32 h-32 rounded-full border-4 border-white shadow-lg z-10" alt="profile"/>
                <div className="text-center md:text-left flex-1 z-10 mt-4 md:mt-2">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileUser.username}</h1>
                            <p className="text-gray-500 mb-4 max-w-lg">{profileUser.bio}</p>
                        </div>
                        {/* Action Buttons for Visitor */}
                        {!isOwnProfile && (
                            <div className="flex gap-3 mt-2 md:mt-0">
                                <button 
                                    onClick={(e) => handleChat(e)}
                                    className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                                >
                                    <MessageCircle className="w-6 h-6" />
                                </button>
                                <button 
                                    onClick={handleProfileFollow}
                                    className={`flex items-center px-4 py-2 font-bold rounded-lg transition shadow-sm text-sm ${isFollowing 
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' 
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'}`}
                                >
                                    {isFollowing ? (
                                        <><UserCheck className="w-4 h-4 mr-2" /> {t.product.following}</>
                                    ) : (
                                        <><UserPlus className="w-4 h-4 mr-2" /> {t.product.follow}</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-4">
                        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center">
                            <ShieldCheck className="w-4 h-4 mr-1.5" />
                            Credit Score: {profileUser.creditScore}
                        </div>
                        <div className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold">
                            Role: {profileUser.role}
                        </div>
                        <div className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold">
                            {t.profile.following}: {followedUsers.length}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex space-x-6 border-b border-gray-200 mb-6 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('listings')}
                        className={`pb-3 px-1 font-medium transition whitespace-nowrap ${activeTab === 'listings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {isOwnProfile ? t.profile.myListings : 'Listings'} ({myActiveListings.length})
                    </button>
                    
                    {isOwnProfile && (
                        <button 
                            onClick={() => setActiveTab('wishlist')}
                            className={`pb-3 px-1 font-medium transition whitespace-nowrap ${activeTab === 'wishlist' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {t.profile.myWishlist} ({wishlistProducts.length})
                        </button>
                    )}
                    
                    <button 
                         onClick={() => setActiveTab('history')}
                        className={`pb-3 px-1 font-medium transition whitespace-nowrap ${activeTab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {t.profile.history}
                    </button>
                    <button 
                         onClick={() => setActiveTab('following')}
                        className={`pb-3 px-1 font-medium transition whitespace-nowrap ${activeTab === 'following' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {t.profile.following} ({followedUsers.length})
                    </button>
                </div>

                <div className="min-h-[300px]">
                    {activeTab === 'listings' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myActiveListings.length > 0 ? myActiveListings.map(p => renderProductCard(p)) : (
                                <div className="text-gray-400 col-span-full text-center py-8">No active listings.</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'wishlist' && isOwnProfile && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlistProducts.length > 0 ? wishlistProducts.map(p => renderProductCard(p, false, true)) : (
                                <div className="text-gray-400 col-span-full text-center py-8">{t.profile.noWishlist}</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-8">
                            {/* Purchases - Hide for visitors (Private) */}
                            {isOwnProfile && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5 text-indigo-600"/> {t.profile.bought} ({purchasedHistory.length})
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {purchasedHistory.length > 0 ? purchasedHistory.map(p => renderProductCard(p, true)) : (
                                            <div className="text-gray-400 text-sm py-4 italic">No purchase history.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Sales - Show for all (Public) */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-green-600"/> {t.profile.sold} ({soldHistory.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {soldHistory.length > 0 ? soldHistory.map(p => renderProductCard(p, true)) : (
                                        <div className="text-gray-400 text-sm py-4 italic">No sales history.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'following' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {followedUsers.length > 0 ? followedUsers.map(u => (
                                <div 
                                    key={u.id} 
                                    onClick={() => navigate(`/profile/${u.id}`)}
                                    className="bg-white rounded-xl border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition cursor-pointer group"
                                >
                                    <img src={u.avatar} className="w-16 h-16 rounded-full border border-gray-100 group-hover:scale-105 transition" alt={u.username} />
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition">{u.username}</h3>
                                        <p className="text-gray-500 text-sm truncate mb-2">{u.bio || 'No bio'}</p>
                                        <div className="text-xs text-green-600 flex items-center">
                                            <ShieldCheck className="w-3 h-3 mr-1" /> Score: {u.creditScore}
                                        </div>
                                    </div>
                                    {isOwnProfile && (
                                        <button 
                                            onClick={(e) => handleUnfollowFromList(e, u.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                            title="Unfollow"
                                        >
                                            <UserX className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            )) : (
                                <div className="text-gray-400 col-span-full text-center py-8">{t.profile.noFollowing}</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default ProfilePage;