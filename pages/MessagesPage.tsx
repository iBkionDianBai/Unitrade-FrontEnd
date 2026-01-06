import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { api } from '../services/api';
import { Message, User } from '../types';
import { mockDb } from '../services/mockDb'; // Keep strictly for helper name lookup if needed, or fetch via API

const MessagesPage = () => {
    const { user } = useContext(AppContext);
    const location = useLocation();
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [msgInput, setMsgInput] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Cache for chat partners to avoid repeated calls
    const [chatPartners, setChatPartners] = useState<Record<string, User>>({});

    useEffect(() => {
        if(!user) return;
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const msgs = await api.messages.list(user.id);
                setMessages(msgs);
                
                // Identify unique users
                const userIds = new Set(msgs.map(m => m.senderId === user.id ? m.receiverId : m.senderId));
                // Fetch info for these users
                const partners: Record<string, User> = {};
                for (const uid of userIds) {
                    // For now, simpler to use sync mockDb or parallel fetch
                    // In real app: await api.users.get(uid)
                    const u = mockDb.getUser(uid);
                    if(u) partners[uid] = u;
                }
                setChatPartners(partners);

                // 3. 关键逻辑：如果存在从详情页传来的 sellerId，自动选中它
                const targetId = location.state?.sellerId;
                if (targetId) {
                    setSelectedChat(targetId);
                }

            } catch(e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [user, location.state]);

    const conversations = Array.from(new Set(messages.map(m => m.senderId === user?.id ? m.receiverId : m.senderId)));
    
    const messagesInChat = selectedChat ? messages.filter(m => (m.senderId === user?.id && m.receiverId === selectedChat) || (m.senderId === selectedChat && m.receiverId === user?.id)).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : [];

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedChat || !user || !msgInput.trim()) return;
        
        try {
            const newMsg = await api.messages.send(user.id, selectedChat, msgInput);
            setMessages([...messages, newMsg]);
            setMsgInput('');
        } catch(e) {
            console.error("Send failed", e);
        }
    }

    if (!user) return <Navigate to="/auth" />;
    if (loading) return <div className="p-8 text-center text-gray-500">Loading messages...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[70vh] flex">
            {/* List */}
            <div className="w-1/3 border-r border-gray-100 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-100 font-bold text-lg text-gray-700">Messages</div>
                <div className="overflow-y-auto flex-1">
                    {conversations.length === 0 ? <div className="p-4 text-gray-400 text-sm">No conversations yet.</div> : conversations.map(uid => {
                        const otherUser = chatPartners[uid];
                        if (!otherUser) return null;
                        return (
                            <div 
                                key={uid} 
                                onClick={() => setSelectedChat(uid)}
                                className={`p-4 flex items-center cursor-pointer hover:bg-indigo-50 transition ${selectedChat === uid ? 'bg-white border-l-4 border-indigo-600' : ''}`}
                            >
                                <img src={otherUser.avatar} className="w-10 h-10 rounded-full mr-3" alt="ava"/>
                                <div className="font-medium text-sm text-gray-800">{otherUser.username}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedChat ? (
                    <>
                        <div className="p-4 border-b border-gray-100 flex items-center bg-white">
                             <span className="font-bold text-gray-800">Chat with {chatPartners[selectedChat]?.username}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messagesInChat.map(m => (
                                <div key={m.id} className={`flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${m.senderId === user.id ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input 
                                className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                placeholder="Type a message..."
                                value={msgInput}
                                onChange={e => setMsgInput(e.target.value)}
                            />
                            <button type="submit" className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
                                <MessageCircle className="w-5 h-5"/>
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;