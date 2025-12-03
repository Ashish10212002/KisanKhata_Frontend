import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
      
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-2 rounded-lg text-white">
            <Sprout size={24} />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">FarmTrack</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <a href="#features" className="hover:text-green-600">Features</a>
          <a href="#about" className="hover:text-green-600">About</a>
        </div>
        <Link to="/dashboard" className="bg-white border border-green-200 text-green-700 px-6 py-2 rounded-full font-semibold hover:bg-green-50 transition">
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col justify-center items-center text-center px-4 mt-10 mb-20">
        <div className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold mb-6 animate-fade-in-up">
          🚀 New: AI Assistant Added
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
          Smart Farming, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
            Maximized Profit.
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl">
          Track expenses, monitor crop cycles, and calculate real profits. 
          The simple tool for the modern Indian farmer.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Link to="/dashboard" className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-green-700 shadow-lg hover:shadow-green-500/30 transition flex items-center gap-2">
            Get Started <ArrowRight size={20} />
          </Link>
          <button className="bg-white text-gray-700 px-8 py-4 rounded-full text-lg font-bold border border-gray-200 hover:bg-gray-50 transition">
            View Demo
          </button>
        </div>
      </header>

      {/* Feature Grid (Floating Cards) */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<BarChart3 size={32} className="text-blue-600" />}
          title="Profit Tracking"
          desc="Know exactly how much you earn. Automatic revenue vs expense calculations."
        />
        <FeatureCard 
          icon={<Sprout size={32} className="text-green-600" />}
          title="Crop Cycles"
          desc="Track sowing dates and get harvest estimates based on real data."
        />
        <FeatureCard 
          icon={<ShieldCheck size={32} className="text-emerald-600" />}
          title="Secure Data"
          desc="Your farming data is private, secure, and accessible from any device."
        />
      </section>

    </div>
  );
}

// Simple Sub-component for clean code
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-xl hover:-translate-y-2 transition-transform duration-300">
      <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}