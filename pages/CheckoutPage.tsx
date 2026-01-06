import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { api } from '../services/api';
import { Product } from '../types';
import { CreditCard, MapPin, Truck, HandCoins } from 'lucide-react';

const CheckoutPage = () => {
  const { id } = useParams();
  const { user, t } = useContext(AppContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if(!id) return;
      api.products.get(id).then(p => {
          setProduct(p);
          setLoading(false);
      }).catch(() => {
          navigate('/');
      });
  }, [id, navigate]);

  if (!user) return <Navigate to="/auth" />;
  if (loading) return <div className="p-8 text-center">Loading checkout...</div>;
  if (!product) return <Navigate to="/" />;
  
  if (product.status !== 'ACTIVE') {
      return (
          <div className="p-12 text-center">
              <h2 className="text-xl font-bold mb-4">Item Unavailable</h2>
              <p className="text-gray-500">This item has been sold or removed.</p>
              <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 hover:underline">Return Home</button>
          </div>
      );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card' && !cardNumber.trim()) {
        alert("Please enter your card number.");
        return;
    }

    setIsProcessing(true);
    
    try {
        await api.products.purchase(product.id, user.id);
        navigate(`/checkout/success/${product.id}`);
    } catch (err: any) {
        alert(err.message || "Transaction failed");
        setIsProcessing(false);
    }
  };

  const addressLabel = paymentMethod === 'cash' ? "Meeting Address" : t.checkout.address;
  const addressPlaceholder = paymentMethod === 'cash' 
      ? "Library Entrance, Student Center Main Hall, etc..." 
      : "Dormitory Building A, Room 304, University Campus...";

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{t.checkout.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Form */}
        <div className="space-y-6">
          {/* Address Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-3 mb-4 text-lg font-semibold text-gray-700">
                <MapPin className="text-indigo-600" />
                {addressLabel}
             </div>
             <textarea 
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={addressPlaceholder}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
             />
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-3 mb-4 text-lg font-semibold text-gray-700">
                <CreditCard className="text-indigo-600" />
                {t.checkout.payment}
             </div>
             <div className="space-y-3">
                {/* Card Payment */}
                <div className={`border rounded-xl transition-all duration-200 ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`}>
                    <label className="flex items-center p-4 cursor-pointer">
                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-indigo-600" />
                        <span className="ml-3 font-medium">Credit/Debit Card</span>
                    </label>
                    {paymentMethod === 'card' && (
                        <div className="px-4 pb-4 pl-11 animate-in slide-in-from-top-2 fade-in duration-200">
                            <input 
                                type="text" 
                                placeholder="Card Number (0000 0000 0000 0000)"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full p-2.5 text-sm border border-indigo-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    )}
                </div>

                {/* WeChat Pay */}
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'wechat' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`}>
                    <input type="radio" name="payment" value="wechat" checked={paymentMethod === 'wechat'} onChange={() => setPaymentMethod('wechat')} className="w-4 h-4 text-indigo-600" />
                    <span className="ml-3 font-medium">WeChat Pay</span>
                </label>

                {/* Cash on Meeting */}
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'cash' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`}>
                    <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-4 h-4 text-indigo-600" />
                    <div className="flex items-center ml-3">
                         <span className="font-medium">Cash on Meeting</span>
                         <HandCoins className="w-4 h-4 ml-2 text-gray-400" />
                    </div>
                </label>
             </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">{t.checkout.summary}</h3>
                
                <div className="flex gap-4 mb-6">
                    <img src={product.image} alt={product.title} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                    <div>
                        <div className="font-semibold text-gray-800 line-clamp-2 mb-1">{product.title}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                </div>

                <div className="space-y-3 text-sm border-t border-gray-100 pt-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                        <span>Item Price</span>
                        <span>${Number(product.price).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Service Fee</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-900 pt-2">
                        <span>{t.checkout.total}</span>
                        <span className="text-indigo-600">${Number(product.price).toFixed(2)}</span>
                    </div>
                </div>

                <button 
                    onClick={handlePlaceOrder}
                    disabled={!address || isProcessing}
                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/30 flex justify-center items-center"
                >
                    {isProcessing ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        t.checkout.placeOrder
                    )}
                </button>
                <div className="mt-4 flex items-center justify-center text-xs text-gray-500 gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Secure Transaction
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const ShieldCheck = ({ className }: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
)

export default CheckoutPage;