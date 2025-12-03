import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardSummary } from '../api';
import { TrendingUp, TrendingDown, Wallet, PlusCircle, LogOut, User, X, ChevronRight, Settings, HelpCircle } from 'lucide-react';
import SmartTransactionForm from '../components/SmartTransactionForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState({ totalRevenue: 0, totalExpense: 0, profit: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar State

  useEffect(() => { loadSummary(); }, []);

  const loadSummary = async () => {
    try {
      const res = await getDashboardSummary();
      setSummary(res.data);
    } catch (err) { console.error(err); }
  };

  const chartData = [
    { name: 'Income', amount: summary.totalRevenue, color: '#10b981' }, // Emerald-500
    { name: 'Expense', amount: summary.totalExpense, color: '#ef4444' }, // Red-500
  ];

  const avatarUrl = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0f172a&color=fff&size=128&bold=true`; 

  const Card = ({ title, amount, color, icon, link }) => (
    <Link to={link} className="block group">
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
        <div className={`absolute right-0 top-0 p-16 opacity-5 rounded-full ${color.replace('text', 'bg')} -mr-8 -mt-8`}></div>
        <div className="relative z-10">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
          <div className="flex items-center justify-between">
            <h3 className={`text-3xl md:text-4xl font-extrabold ${color}`}>₹{amount.toLocaleString()}</h3>
            <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('text', 'bg')}`}>{icon}</div>
          </div>
          <p className="text-xs text-slate-400 mt-4 group-hover:text-slate-600 transition-colors">Tap to view history &rarr;</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6 pb-24 md:pb-10 min-h-screen bg-[#F8FAFC]">
      
      {/* 1. HEADER (Consistent with Home) */}
      <div className="flex justify-between items-center px-6 pt-8 pb-4 sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800">Financials</h1>

        {/* PROFILE BUTTON */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="group active:scale-95 transition-transform"
        >
           <div className="w-10 h-10 rounded-full p-0.5 border border-gray-200 bg-white shadow-sm">
             <img src={avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover"/>
           </div>
        </button>
      </div>

      {/* 2. CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4">
        <Card title="Total Revenue" amount={summary.totalRevenue} color="text-emerald-500" icon={<TrendingUp />} link="/history" />
        <Card title="Total Expense" amount={summary.totalExpense} color="text-red-500" icon={<TrendingDown />} link="/history" />
        <Card title="Net Profit" amount={summary.profit} color="text-blue-500" icon={<Wallet />} link="/history" />
      </div>

      {/* 3. CHART */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 mx-4">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Income vs Expense</h3>
        <div className="w-full h-[300px] min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `₹${value/1000}k`} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FAB */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 md:bottom-10 right-6 bg-slate-900 text-white p-4 rounded-full shadow-lg shadow-slate-900/40 hover:scale-110 transition-transform z-40 flex items-center gap-2"
      >
        <PlusCircle size={28} />
        <span className="font-bold pr-2 hidden md:inline">Add Entry</span>
      </button>

      {/* --- SIDEBAR DRAWER (Identical to Home) --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold text-slate-800">Menu</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
              <X size={20} className="text-slate-500"/>
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl flex flex-col items-center text-center mb-8 border border-slate-100">
            <img src={avatarUrl} alt="Profile" className="w-20 h-20 rounded-full shadow-lg border-4 border-white mb-4"/>
            <h3 className="font-bold text-slate-900 text-xl">{user?.name || 'User'}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Free Plan</p>
          </div>

          <div className="space-y-2 flex-1">
            <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 font-medium hover:text-slate-900">
              <div className="flex items-center gap-3"><User size={20} strokeWidth={1.5} /> Account</div>
              <ChevronRight size={16} className="text-slate-300"/>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 font-medium hover:text-slate-900">
              <div className="flex items-center gap-3"><Settings size={20} strokeWidth={1.5} /> Settings</div>
              <ChevronRight size={16} className="text-slate-300"/>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 font-medium hover:text-slate-900">
              <div className="flex items-center gap-3"><HelpCircle size={20} strokeWidth={1.5} /> Support</div>
              <ChevronRight size={16} className="text-slate-300"/>
            </button>
          </div>

          <button 
            onClick={logout}
            className="w-full bg-red-50 text-red-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors mt-auto border border-red-100"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>

      {showAddModal && <SmartTransactionForm onClose={() => setShowAddModal(false)} onSuccess={loadSummary} />}
    </div>
  );
}