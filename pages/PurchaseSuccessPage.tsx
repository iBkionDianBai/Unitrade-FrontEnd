import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { api } from '../services/api';
import { Product } from '../types';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

const PurchaseSuccessPage = () => {
    const { id } = useParams();
    const { t } = useContext(AppContext);
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if(id) {
            api.products.get(id).then(setProduct).catch(console.error);
        }
    }, [id]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full border border-gray-100 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.checkout.successTitle}</h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    {t.checkout.successMsg}
                </p>

                {product && (
                    <div className="bg-gray-50 p-4 rounded-xl mb-8 flex items-center gap-4 text-left">
                        <img src={product.image} className="w-16 h-16 rounded-lg object-cover" alt="product"/>
                        <div>
                            <div className="font-semibold text-gray-900">{product.title}</div>
                            <div className="text-indigo-600 font-bold">${product.price}</div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => navigate('/profile')} 
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center justify-center"
                    >
                        {t.checkout.viewOrder} <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    <button 
                        onClick={() => navigate('/')} 
                        className="w-full py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center"
                    >
                        <Home className="w-4 h-4 mr-2" /> {t.checkout.backHome}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseSuccessPage;