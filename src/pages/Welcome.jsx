import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFarms } from '../api'; 
import WeatherWidget from '../components/WeatherWidget';
import SmartTransactionForm from '../components/SmartTransactionForm';
import { differenceInDays } from 'date-fns';
import { 
  PlusCircle, LayoutDashboard, Sprout, ArrowRight, Activity, TrendingUp, LogOut, User, X, ChevronRight, Settings, HelpCircle, ArrowLeft, Mail, Phone, Shield
} from 'lucide-react';

export default function Welcome() {
  const { user, logout } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Sidebar Logic
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState('menu'); // 'menu', 'account', 'settings', 'support'

  const [farms, setFarms] = useState([]);

  useEffect(() => { loadFarms(); }, []);

  // Reset sidebar to main menu when closed
  useEffect(() => {
    if (!isSidebarOpen) {
      setTimeout(() => setSidebarView('menu'), 300); // Delay reset for smooth animation
    }
  }, [isSidebarOpen]);

  const loadFarms = async () => {
    try {
      const res = await getFarms();
      setFarms(res.data);
    } catch (err) { console.error("Error loading farms"); }
  };

  const getProgress = (sowingDate) => {
    if (!sowingDate) return null;
    const start = new Date(sowingDate);
    const today = new Date();
    const daysPassed = differenceInDays(today, start);
    const totalDays = 120; 
    let percentage = (daysPassed / totalDays) * 100;
    if (percentage > 100) percentage = 100;
    
    let stage = "Seedling";
    if (daysPassed > 30) stage = "Vegetative";
    if (daysPassed > 60) stage = "Flowering";
    if (daysPassed > 90) stage = "Maturity";
    
    return { daysPassed, percentage, stage };
  };

  const mandiRates = [
    { crop: 'Wheat (Gehu)', price: 2275, change: '+15', up: true },
    { crop: 'Mustard (Sarson)', price: 5450, change: '-40', up: false },
    { crop: 'Cotton (Kapas)', price: 6800, change: '+120', up: true },
    { crop: 'Soybean', price: 4600, change: '-20', up: false },
    { crop: 'Gram (Chana)', price: 5800, change: '+50', up: true },
  ];

  const todayDate = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  const avatarUrl = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0f172a&color=fff&size=128&bold=true`; 

  // --- SIDEBAR CONTENT COMPONENTS ---
  
  const MainMenu = () => (
    <>
      <div className="bg-slate-50 p-6 rounded-3xl flex flex-col items-center text-center mb-8 border border-slate-100">
        <img src={avatarUrl} alt="Profile" className="w-20 h-20 rounded-full shadow-lg border-4 border-white mb-4"/>
        <h3 className="font-bold text-slate-900 text-xl">{user?.name || 'User'}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Free Plan</p>
      </div>

      <div className="space-y-2 flex-1">
        <button onClick={() => setSidebarView('account')} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 font-medium hover:text-slate-900">
          <div className="flex items-center gap-3"><User size={20} strokeWidth={1.5} /> Account Details</div>
          <ChevronRight size={16} className="text-slate-300"/>
        </button>
        <button onClick={() => setSidebarView('settings')} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 font-medium hover:text-slate-900">
          <div className="flex items-center gap-3"><Settings size={20} strokeWidth={1.5} /> App Settings</div>
          <ChevronRight size={16} className="text-slate-300"/>
        </button>
        <button onClick={() => setSidebarView('support')} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 font-medium hover:text-slate-900">
          <div className="flex items-center gap-3"><HelpCircle size={20} strokeWidth={1.5} /> Support</div>
          <ChevronRight size={16} className="text-slate-300"/>
        </button>
      </div>

      <button onClick={logout} className="w-full bg-red-50 text-red-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors mt-auto border border-red-100">
        <LogOut size={20} /> Sign Out
      </button>
    </>
  );

  const AccountView = () => (
    <div className="flex-1 flex flex-col">
      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Full Name</label>
          <p className="text-slate-800 font-medium text-lg">{user?.name}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Role</label>
          <p className="text-slate-800 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Farmer
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Member Since</label>
          <p className="text-slate-800 font-medium">December 2024</p>
        </div>
      </div>
    </div>
  );

  const SupportView = () => (
    <div className="flex-1 flex flex-col">
      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center mb-8">
        <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm">
          <HelpCircle size={28} />
        </div>
        <h3 className="font-bold text-blue-900 text-lg">Need Help?</h3>
        <p className="text-sm text-blue-700/80 mt-2">Contact the developer directly for any issues or feature requests.</p>
      </div>

      <div className="space-y-4">
        <a href="mailto:patelap0108@gmail.com" className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-colors">
          <div className="bg-slate-100 p-3 rounded-full text-slate-600"><Mail size={20}/></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Email Support</p>
            <p className="text-slate-800 font-medium text-sm">patelap0108@gmail.com</p>
          </div>
        </a>
        <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="bg-slate-100 p-3 rounded-full text-slate-600"><Phone size={20}/></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Phone</p>
            <p className="text-slate-800 font-medium text-sm">+91 7773086059</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="flex-1 flex flex-col space-y-4">
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg text-slate-600 shadow-sm"><Activity size={18}/></div>
          <span className="font-medium text-slate-700">Notifications</span>
        </div>
        <div className="w-10 h-6 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
      </div>
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg text-slate-600 shadow-sm"><Shield size={18}/></div>
          <span className="font-medium text-slate-700">Dark Mode</span>
        </div>
        <div className="w-10 h-6 bg-slate-300 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-10 relative overflow-x-hidden font-sans">
      
      {/* HEADER */}
      <div className="px-6 pt-8 pb-2 flex justify-between items-center bg-[#F8FAFC] sticky top-0 z-40">
        <div>
           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{todayDate}</p>
           <h1 className="text-xl text-gray-500 font-medium">
             Namaste, <span className="text-slate-800 font-bold block text-2xl">{user?.name?.split(' ')[0] || 'Kisan'} ji</span>
           </h1>
        </div>
        
        <button onClick={() => setIsSidebarOpen(true)} className="group active:scale-95 transition-transform">
           <div className="w-12 h-12 rounded-full p-0.5 border border-gray-200 bg-white shadow-sm">
             <img src={avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover"/>
           </div>
        </button>
      </div>

      {/* PAGE CONTENT */}
      <div className="space-y-8 px-5 pt-4">
        <div className="w-full"><WeatherWidget /></div>

        {/* Mandi Ticker */}
        <div>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-800">Market Rates</h2>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Live Updates</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide">
            {mandiRates.map((rate, index) => (
              <div key={index} className="min-w-[150px] bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between shrink-0 hover:shadow-md transition-shadow">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{rate.crop}</span>
                <div className="mt-3">
                  <span className="text-xl font-bold text-slate-800">₹{rate.price}</span>
                  <div className={`text-xs font-semibold flex items-center gap-1 mt-1 ${rate.up ? 'text-emerald-600' : 'text-red-500'}`}>
                    {rate.up ? '▲' : '▼'} ₹{rate.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Manage Farm</h2>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setShowAddModal(true)} className="bg-slate-900 text-white p-6 rounded-[1.5rem] shadow-xl shadow-slate-900/20 flex flex-col justify-between h-40 active:scale-95 transition-transform group relative overflow-hidden">
              <div className="bg-white/10 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md group-hover:bg-white/20 transition-colors"><PlusCircle size={20}/></div>
              <span className="font-semibold text-lg leading-tight text-left relative z-10">Add <br/>Transaction</span>
              <div className="absolute -bottom-4 -right-4 text-white/5 transform rotate-12 group-hover:scale-110 transition-transform"><LayoutDashboard size={80} /></div>
            </button>

            <div className="flex flex-col gap-3 h-40">
              <Link to="/dashboard" className="flex-1 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-3 active:scale-95 transition-transform hover:border-slate-300">
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><LayoutDashboard size={20}/></div>
                <span className="font-semibold text-slate-700 text-sm">Financials</span>
              </Link>
              <Link to="/farms" className="flex-1 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-3 active:scale-95 transition-transform hover:border-slate-300">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg"><Sprout size={20}/></div>
                <span className="font-semibold text-slate-700 text-sm">My Farms</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Active Crops */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] mx-1">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold text-slate-800">Crop Cycles</h2>
             <Link to="/farms" className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"><ArrowRight size={16}/></Link>
          </div>
          <div className="space-y-6">
            {farms.filter(f => f.sowingDate).map(farm => {
              const progress = getProgress(farm.sowingDate);
              if(!progress) return null;
              return (
                <div key={farm.id}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{farm.name}</h4>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md tracking-wide">{progress.stage}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{progress.percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress.percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
            {farms.filter(f => f.sowingDate).length === 0 && (
               <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Sprout className="mx-auto text-slate-300 mb-2" size={28} />
                  <p className="text-xs text-slate-400 font-medium">No active crops.</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* --- SLIDE-OUT SIDEBAR --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          
          {/* Sidebar Header with Back Button logic */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-800">
              {sidebarView === 'menu' ? 'Menu' : (
                <button onClick={() => setSidebarView('menu')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                  <ArrowLeft size={20} /> Back
                </button>
              )}
            </h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
              <X size={20} className="text-slate-500"/>
            </button>
          </div>

          {/* DYNAMIC CONTENT AREA */}
          <div className="flex-1 overflow-y-auto">
            {sidebarView === 'menu' && <MainMenu />}
            {sidebarView === 'account' && <AccountView />}
            {sidebarView === 'settings' && <SettingsView />}
            {sidebarView === 'support' && <SupportView />}
          </div>

        </div>
      </div>

      {showAddModal && <SmartTransactionForm onClose={() => setShowAddModal(false)} onSuccess={() => {}} />}
    </div>
  );
}