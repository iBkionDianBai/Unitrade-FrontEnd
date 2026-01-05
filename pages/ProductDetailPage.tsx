import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, Globe, ShieldCheck, MessageCircle, CreditCard, Star, UserPlus, UserCheck } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { api } from '../services/api';
import { Product, User, Review } from '../types';

const ProductDetailPage = () => {
  const { id } = useParams();
  const pid = id || '';

  const { t, user, toggleWishlist, toggleFollow } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [similars, setSimilars] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const p = await api.products.get(pid);
            setProduct(p);
            
            // Parallel fetch for related data
            const [fetchedSeller, fetchedSimilars, fetchedReviews] = await Promise.all([
                api.users.get(p.sellerId),
                api.products.getRelated(p.category, p.id),
                api.reviews.list(p.sellerId)
            ]);
            
            setSeller(fetchedSeller);
            setSimilars(fetchedSimilars);
            setReviews(fetchedReviews);
        } catch (e) {
            console.error("Failed to load product details", e);
        } finally {
            setLoading(false);
        }
    };
    if (pid) fetchData();
  }, [pid]);

  if (loading) return <div className="flex justify-center items-center min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!product || !seller) return <div>Product not found</div>;

  const handleChat = async () => {
      if(!user) return navigate('/auth');
      // Create a greeting message automatically
      await api.messages.send(user.id, seller.id, `Hi, I'm interested in your ${product.title}`);
      navigate('/messages');
  };

  const handleBuyClick = () => {
      if (!user) return navigate('/auth');
      navigate(`/checkout/${product.id}`);
  };

  const isWishlisted = user?.wishlist?.includes(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if(!user) return navigate('/auth');
      toggleWishlist(product.id);
  }

  const isFollowing = user?.following?.includes(seller.id);

  const handleFollow = async () => {
      if (!user) return navigate('/auth');
      if (user.id === seller.id) return;
      await toggleFollow(seller.id);
  }

  const hasReviewed = user && reviews.some(r => r.productId === product.id && r.buyerId === user.id);
  const canReview = user && product.status === 'SOLD' && product.buyerId === user.id && !hasReviewed;

  const handleSubmitReview = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!user) return;
      
      const newReview = await api.reviews.create({
          sellerId: seller.id,
          buyerId: user.id,
          productId: product.id,
          rating: reviewRating,
          content: reviewContent
      });

      // Refresh reviews
      setReviews([newReview, ...reviews]);
      setReviewContent('');
  };

  const averageRating = reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
      : 'N/A';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
           <div className="relative">
             <img src={product.image} alt={product.title} className="w-full h-[400px] object-cover" />
             <button 
                onClick={handleWishlist}
                className="absolute top-4 right-4 p-3 rounded-full bg-white shadow-md hover:bg-gray-50 transition transform hover:scale-105"
                title={isWishlisted ? t.product.removeFromWishlist : t.product.addToWishlist}
             >
                <Heart className={`w-6 h-6 transition duration-300 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
             </button>
           </div>
           <div className="p-6">
             <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <span className="text-2xl font-bold text-indigo-600">${product.price}</span>
             </div>
             <div className="flex gap-2 mb-6">
                {product.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full uppercase tracking-wider">{tag}</span>
                ))}
             </div>
             
             <h3 className="font-semibold text-lg mb-2">{t.product.description}</h3>
             <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
             
             <div className="flex items-center text-sm text-gray-400">
                <Globe className="w-4 h-4 mr-1"/> Posted on {product.createdAt.split('T')[0]} • {product.viewCount} views
             </div>
           </div>
        </div>

        {/* Similar Items */}
        <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">{t.product.similar}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similars.map(s => (
                    <div key={s.id} onClick={() => navigate(`/product/${s.id}`)} className="bg-white p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition">
                        <img src={s.image} className="w-full h-32 object-cover rounded-lg mb-2" alt={s.title}/>
                        <div className="font-medium text-sm truncate">{s.title}</div>
                        <div className="text-indigo-600 font-bold text-sm">${s.price}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Sidebar - Seller Info & Reviews */}
      <div className="space-y-6">
         {/* Seller Info Card */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
                <img src={seller.avatar} className="w-16 h-16 rounded-full border-2 border-indigo-100" alt="Seller"/>
                <div>
                    <div className="font-bold text-lg">{seller.username}</div>
                    <div className="text-sm text-green-600 flex items-center mb-1">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Credit: {seller.creditScore}
                    </div>
                    {/* Follow Button */}
                    {user?.id !== seller.id && (
                        <button 
                            onClick={handleFollow}
                            className={`flex items-center px-4 py-1.5 text-xs font-bold rounded-full transition-all shadow-sm ${isFollowing 
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'}`}
                        >
                            {isFollowing ? (
                                <><UserCheck className="w-3.5 h-3.5 mr-1.5" /> {t.product.following}</>
                            ) : (
                                <><UserPlus className="w-3.5 h-3.5 mr-1.5" /> {t.product.follow}</>
                            )}
                        </button>
                    )}
                </div>
            </div>
            <div className="text-sm text-gray-500 mb-6 italic">"{seller.bio}"</div>
            
            <button 
                onClick={handleChat}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium mb-3 hover:bg-indigo-700 transition flex items-center justify-center"
            >
                <MessageCircle className="w-5 h-5 mr-2" /> {t.product.chatNow}
            </button>

            {product.status === 'ACTIVE' && (!user || user.id !== product.sellerId) && (
                <button 
                    onClick={handleBuyClick}
                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <CreditCard className="w-5 h-5 mr-2" /> {t.product.buy}
                </button>
            )}
         </div>

         {/* Reviews Section */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
                 <h3 className="font-bold text-lg text-gray-800">{t.reviews.title} ({reviews.length})</h3>
                 <div className="text-sm text-orange-500 font-bold flex items-center">
                    <Star className="w-4 h-4 fill-orange-500 mr-1"/> {averageRating}
                 </div>
             </div>

             {/* Review Form */}
             {canReview && (
                 <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-xl">
                     <div className="font-semibold text-sm mb-3 text-gray-700">{t.reviews.leaveReview}</div>
                     <div className="flex gap-2 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button" onClick={() => setReviewRating(star)}>
                                <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            </button>
                        ))}
                     </div>
                     <textarea 
                        className="w-full p-2 text-sm border border-gray-200 rounded-lg mb-2 focus:outline-none focus:border-indigo-500" 
                        placeholder={t.reviews.placeholder}
                        value={reviewContent}
                        onChange={e => setReviewContent(e.target.value)}
                        required
                        rows={2}
                     />
                     <button type="submit" className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700">
                        {t.reviews.submit}
                     </button>
                 </form>
             )}
             
             {hasReviewed && (
                 <div className="mb-4 text-xs text-green-600 bg-green-50 p-2 rounded text-center">
                     {t.reviews.reviewed}
                 </div>
             )}

             {/* Review List */}
             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {reviews.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-4">{t.reviews.noReviews}</div>
                ) : (
                    reviews.map(r => (
                        <div key={r.id} className="border-b border-gray-50 pb-3 last:border-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-gray-700">User_{r.buyerId.substring(0,4)}</span>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">{r.content}</div>
                            <div className="text-[10px] text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                        </div>
                    ))
                )}
             </div>
         </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;