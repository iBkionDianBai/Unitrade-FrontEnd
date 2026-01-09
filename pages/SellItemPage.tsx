import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { api } from '../services/api';
import { Loader } from 'lucide-react';

const SellItemPage = () => {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Others');
    const [desc, setDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!user) return;
        
        setIsSubmitting(true);
        setError('');
        
        try {
            const productData = {
                title,
                price: Number(price),
                description: desc,
                category,
                image: `https://picsum.photos/seed/${title}/400/300`,
                tags: [category.toLowerCase(), 'campus']
            };
            
            await api.products.create(productData);
            navigate('/');
        } catch (e: any) {
            console.error('Error creating product:', e);
            console.error('Error response data:', e.response?.data);
            
            if (e.response?.status === 401) {
                setError('Authentication failed. Please try logging in again.');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('session_user');
            } else if (e.response?.status === 400) {
                const errorData = e.response?.data;
                const errorMsg = typeof errorData === 'object' 
                    ? JSON.stringify(errorData) 
                    : errorData?.detail || 'Invalid data. Please check your input.';
                setError(errorMsg);
            } else {
                setError(e.response?.data?.detail || 'Failed to create product. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">List an Item</h2>
            
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input 
                        value={title} 
                        onChange={e=>setTitle(e.target.value)} 
                        required 
                        disabled={isSubmitting}
                        className="w-full p-2 border rounded-lg disabled:bg-gray-100" 
                        placeholder="e.g. Calculus Textbook"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Price ($)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            min="0"
                            value={price} 
                            onChange={e=>setPrice(e.target.value)} 
                            required 
                            disabled={isSubmitting}
                            className="w-full p-2 border rounded-lg disabled:bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select 
                            value={category} 
                            onChange={e=>setCategory(e.target.value)} 
                            disabled={isSubmitting}
                            className="w-full p-2 border rounded-lg disabled:bg-gray-100"
                        >
                            <option>Books</option>
                            <option>Electronics</option>
                            <option>Furniture</option>
                            <option>Clothing</option>
                            <option>Sports</option>
                            <option>Others</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                        value={desc} 
                        onChange={e=>setDesc(e.target.value)} 
                        rows={4} 
                        disabled={isSubmitting}
                        className="w-full p-2 border rounded-lg disabled:bg-gray-100" 
                        placeholder="Describe your item..."
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting && <Loader className="w-5 h-5 animate-spin" />}
                    {isSubmitting ? 'Listing...' : 'List Item'}
                </button>
            </form>
        </div>
    )
}

export default SellItemPage;