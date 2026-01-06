import React, { useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { api } from '../services/api';
import {
    ArrowLeft,
    Wallet,
    CreditCard,
    ArrowUpRight,
    AlertCircle,
    ShieldCheck
} from 'lucide-react';

// 自定义 Visa 图标组件
const VisaIcon = () => (
    <svg viewBox="0 0 48 48" className="h-5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.15 31.85h3.63L24.1 19h-3.63l-2.32 12.85zM38.16 19.34c-.75-.3-1.92-.62-3.34-.62-3.69 0-6.28 1.86-6.3 4.49-.03 1.96 1.85 3.06 3.26 3.71 1.45.67 1.94 1.1 1.93 1.7-.01.91-1.16 1.33-2.22 1.33-1.48 0-2.28-.22-3.49-.73l-.49-.22-.53 3.12c.88.38 2.52.71 4.22.73 3.93 0 6.49-1.84 6.53-4.69.03-1.57-.99-2.76-3.16-3.74-1.32-.63-2.13-1.05-2.12-1.69.01-.58.68-1.2 2.15-1.2 1.23-.02 2.13.25 2.82.53l.34.16.52-3.04zM47.11 19h-3.37c-1.04 0-1.83.29-2.28 1.31l-6.49 14.6h3.81s.62-1.63.76-2.01h4.64c.11.47.45 2.01.45 2.01h3.36L47.11 19zm-6.23 10.65c.31-.8 2.1-5.41 2.1-5.41l1.19 5.41h-3.29zM12.92 19H9.17L5.7 28.52 4.14 20.25C3.96 19.56 3.42 19 2.74 19H0l.04.18c5.63 1.36 9.36 4.63 10.87 8.44L12.92 19z" fill="#1A1F71"/>
    </svg>
);

// 自定义 Mastercard 图标组件
const MastercardIcon = () => (
    <svg viewBox="0 0 48 48" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="24" r="12" fill="#EB001B" fillOpacity="0.8"/>
        <circle cx="30" cy="24" r="12" fill="#F79E1B" fillOpacity="0.8"/>
    </svg>
);

const WithdrawPage = () => {
    const { user, t, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!user) return <Navigate to="/auth" />;

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        const withdrawAmount = Number(amount);

        if (withdrawAmount <= 0) return alert("Please enter a valid amount.");
        if (withdrawAmount > (user.walletBalance || 0)) return alert("Insufficient balance.");
        if (!cardNumber.trim()) return alert("Please enter your card number.");

        setIsProcessing(true);
        try {
            const res = await api.users.withdraw(user.id, withdrawAmount, cardNumber);
            setUser({ ...user, walletBalance: res.newBalance });
            alert(t.admin.withdrawSuccess || "Withdrawal successful!");
            navigate('/profile');
        } catch (err: any) {
            alert(err.response?.data?.error || "Withdrawal failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            {/* 返回上一页按钮 */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-indigo-600 transition mb-6 group"
            >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                {t.nav.return}
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* 余额卡片区 */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white">
                    <div className="flex items-center gap-2 opacity-80 mb-2">
                        <Wallet className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase tracking-widest">{t.admin.wallet}</span>
                    </div>
                    <div className="text-4xl font-black tabular-nums">
                        ${user.walletBalance?.toFixed(2) || '0.00'}
                    </div>
                </div>

                <form onSubmit={handleWithdraw} className="p-8 space-y-6">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">{t.admin.withdraw}</h1>
                        <p className="text-gray-500 text-sm mt-1">Transfer your earnings securely to your bank card.</p>
                    </div>

                    <div className="space-y-4">
                        {/* 提现金额输入 */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Amount to Withdraw</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    className="w-full pl-8 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-xl transition"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 卡号输入及品牌图标 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Card Number</label>
                                {/* 增加的 Visa & Mastercard 图标 */}
                                <div className="flex items-center gap-3">
                                    <VisaIcon />
                                    <MastercardIcon />
                                </div>
                            </div>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing || !amount || !cardNumber}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition flex justify-center items-center disabled:opacity-50 transform active:scale-95"
                    >
                        {isProcessing ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <><ArrowUpRight className="w-5 h-5 mr-2" /> {t.admin.withdraw}</>
                        )}
                    </button>

                    {/* 安全提示 */}
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500 text-[10px] leading-relaxed italic">
                        <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-indigo-600" />
                        <p>Your transaction is encrypted. We support major card networks including Visa and Mastercard. Please double-check your account details to avoid transfer delays.</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WithdrawPage;