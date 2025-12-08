import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sprout, MessageSquareText, Home } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  
  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/welcome' }, 
    { icon: <LayoutDashboard size={24} />, label: 'Finance', path: '/dashboard' },
    { icon: <Sprout size={24} />, label: 'Farms', path: '/farms' },
    { icon: <MessageSquareText size={24} />, label: 'AI', path: '/ai' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-24 md:pb-0 md:flex">
      
      {/* --- 📱 MOBILE TOP HEADER (New!) --- */}
      {/* Visible only on mobile (md:hidden). Fixed at top. */}
      <header className="fixed top-0 left-0 w-full bg-white border-b z-50 md:hidden h-16 flex items-center px-4 shadow-sm">
        <Link to="/welcome" className="flex items-center gap-2 text-green-700 active:opacity-70 transition-opacity">
          <Sprout size={24} />
          <h1 className="text-xl font-bold">Kishan Khata</h1>
        </Link>
      </header>

      {/* --- 📱 MOBILE BOTTOM NAV --- */}
      <nav className="fixed bottom-0 w-full bg-white border-t z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-4 h-20"> 
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-all active:scale-95 ${
                location.pathname === item.path 
                  ? 'text-green-600 border-t-4 border-green-600 bg-green-50' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className="mb-1">{item.icon}</div>
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* --- 💻 DESKTOP SIDEBAR --- */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r h-screen fixed left-0 top-0 z-40">
        <div className="p-6">
          <Link to="/welcome" className="hover:opacity-80 transition-opacity block">
            <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
              <Sprout /> Kishan Khata
            </h1>
          </Link>
        </div>
        <div className="flex-1 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-4 mx-2 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'text-green-700 bg-green-100 font-bold shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span className="ml-3 text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      {/* Added pt-20 (padding-top) on mobile so content isn't hidden behind the header */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto min-h-screen bg-gray-50/50">
        {children}
      </main>
    </div>
  );
}