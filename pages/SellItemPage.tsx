import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { api } from '../services/api';
import { generateProductDescription } from '../services/geminiService';

const SellItemPage = () => {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Others');
    const [desc, setDesc] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAiGenerate = async () => {
        setLoadingAI(true);
        const generated = await generateProductDescription(title, category);
        setDesc(generated);
        setLoadingAI(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!user) return;
        setIsSubmitting(true);
        try {
            await api.products.create({
                sellerId: user.id,
                title,
                price: Number(price),
                description: desc,
                category,
                image: `https://picsum.photos/seed/${title}/400/300`, // AI gen image sim
                tags: [category.toLowerCase(), 'campus']
            });
            navigate('/');
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">List an Item</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input value={title} onChange={e=>setTitle(e.target.value)} required className="w-full p-2 border rounded-lg" placeholder="e.g. Calculus Textbook"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Price ($)</label>
                        <input type="number" value={price} onChange={e=>setPrice(e.target.value)} required className="w-full p-2 border rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full p-2 border rounded-lg">
                            <option>Books</option>
                            <option>Electronics</option>
                            <option>Furniture</option>
                            <option>Others</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 flex justify-between">
                        <span>Description</span>
                        <button type="button" onClick={handleAiGenerate} disabled={!title || loadingAI} className="text-indigo-600 text-xs hover:underline disabled:opacity-50">
                            {loadingAI ? 'Generating...' : '✨ Auto-Generate with AI'}
                        </button>
                    </label>
                    <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={4} className="w-full p-2 border rounded-lg" placeholder="Describe your item..."></textarea>
                </div>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Listing...' : 'List Item'}
                </button>
            </form>
        </div>
    )
}

export default SellItemPage;