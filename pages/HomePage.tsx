import React, { useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, ArrowUp, Check } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { api } from '../services/api';
import { Product } from '../types';
import { mockDb } from '../services/mockDb';

const ITEMS_PER_CHUNK = 12;

const HomePage = () => {
  const { t } = useContext(AppContext);
  const [allFilteredProducts, setAllFilteredProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [hideSold, setHideSold] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const navigate = useNavigate();

  // Initial Fetch & Filter
  useEffect(() => {
    setLoading(true);
    // Debounce search/sort operations
    const timer = setTimeout(async () => {
      try {
          const products = await api.products.list({
              search,
              sort: sortBy,
              hideSold
          });
          setAllFilteredProducts(products);
          setVisibleProducts(products.slice(0, ITEMS_PER_CHUNK));
      } catch (e) {
          console.error("Failed to load products", e);
      } finally {
          setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, sortBy, hideSold]);

  // Infinite Scroll & Back-to-Top Listener
  useEffect(() => {
    const handleScroll = () => {
      // Toggle Back to Top Button
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }

      // Check for bottom of page to load more
      const scrollBuffer = 100; // Load when within 100px of bottom
      const reachedBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - scrollBuffer;
      
      if (reachedBottom && !loading && !loadingMore && visibleProducts.length < allFilteredProducts.length) {
        setLoadingMore(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, loadingMore, visibleProducts.length, allFilteredProducts.length]);

  // Load More Data Effect
  useEffect(() => {
    if (loadingMore) {
      // Simulate network latency for smoother UX
      const timer = setTimeout(() => {
        const currentLength = visibleProducts.length;
        const nextChunk = allFilteredProducts.slice(currentLength, currentLength + ITEMS_PER_CHUNK);
        setVisibleProducts(prev => [...prev, ...nextChunk]);
        setLoadingMore(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loadingMore, allFilteredProducts, visibleProducts.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to get seller info (in real app, this might be included in product DTO or fetched separately)
  const getSellerInfo = (sellerId: string) => {
      // For list view optimization, we might still fallback to mockDb or need a specific API. 
      // To strictly follow API pattern, we'd need to fetch users, but that's N+1.
      // We will assume the API returns populated products or we fetch efficiently.
      // For this refactor, accessing mockDb for SYNC display data is acceptable if not refactoring the entire Product interface to include seller info.
      return mockDb.getUser(sellerId);
  }

  return (
    <div className="space-y-8 relative min-h-screen pb-12">
      {/* Hero / Search */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t.home.searchPlaceholder}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
          <span className="font-semibold">{t.home.hotSearch}</span>
          {['Calculus', 'Guitar', 'Lamp', 'Bike'].map(s => (
            <span 
              key={s} 
              className="cursor-pointer hover:text-indigo-600 bg-gray-100 px-2 py-1 rounded hover:bg-indigo-50 transition"
              onClick={() => setSearch(s)}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Control Bar: Count, Filter & Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-gray-600 font-medium">
            {allFilteredProducts.length} {t.home.results}
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {/* Hide Sold Filter */}
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-indigo-600 transition select-none group">
                <div className={`w-5 h-5 border rounded-md flex items-center justify-center transition-colors duration-200 ${hideSold ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white group-hover:border-indigo-400'}`}>
                    {hideSold && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
                <input 
                    type="checkbox" 
                    checked={hideSold} 
                    onChange={(e) => setHideSold(e.target.checked)} 
                    className="hidden" 
                />
                <span className="font-medium">{t.home.hideSold}</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 hidden sm:inline">{t.home.sortBy}:</span>
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none cursor-pointer hover:border-indigo-300 transition"
                >
                    <option value="date_desc">{t.home.sortDate}</option>
                    <option value="price_asc">{t.home.sortPriceAsc}</option>
                    <option value="price_desc">{t.home.sortPriceDesc}</option>
                    <option value="views_desc">{t.home.sortPopular}</option>
                </select>
            </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
      ) : visibleProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">{t.home.noItems}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map(product => (
              <div 
                key={product.id} 
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {product.status === 'SOLD' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">SOLD</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                      ${product.price}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <img src={getSellerInfo(product.sellerId)?.avatar} className="w-5 h-5 rounded-full mr-2" alt="seller"/>
                    <span>{getSellerInfo(product.sellerId)?.username}</span>
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-gray-400">
                    <span>{product.category}</span>
                    <span>{product.viewCount} {t.product.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading More Indicator */}
          {loadingMore && (
             <div className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                   Loading more items...
                </div>
             </div>
          )}
          
          {/* End of List Indicator */}
          {!loadingMore && visibleProducts.length === allFilteredProducts.length && allFilteredProducts.length > 0 && (
             <div className="text-center py-8 text-gray-300 text-sm">
                No more items to display
             </div>
          )}
        </>
      )}

      {/* Back to Top Button - Pinned using Portal */}
      {showTopBtn && createPortal(
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transition transform hover:-translate-y-1 z-[9999] flex items-center justify-center ring-2 ring-white"
          title="Back to Top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>,
        document.body
      )}
    </div>
  );
};

export default HomePage;