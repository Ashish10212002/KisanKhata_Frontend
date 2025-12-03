import React, { useState } from 'react';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, ArrowLeft, User, Mail, Lock } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await registerUser(formData);
      login(res.data.token, res.data.name);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Email might be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE: Brand Panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-emerald-900 to-green-800 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute bottom-10 left-10 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <div className="mt-10">
             <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm mb-4">
                <Sprout size={28} className="text-white" />
             </div>
             <h1 className="text-4xl font-bold tracking-tight">Join FarmTrack</h1>
             <p className="mt-2 text-green-100/80">Start your journey to profitable farming.</p>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="bg-green-500 rounded-full p-1"><svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
            <span className="font-medium">Track Unlimited Farms</span>
          </div>
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="bg-green-500 rounded-full p-1"><svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
            <span className="font-medium">AI Farming Assistant</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-gray-50/50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-2">It takes less than 30 seconds.</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input type="text" required placeholder="Ramesh Kumar" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input type="email" required placeholder="you@example.com" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input type="password" required placeholder="Create a password" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>
            <button disabled={loading} className="w-full bg-green-700 text-white py-3.5 rounded-xl font-bold hover:bg-green-800 transition-all shadow-lg shadow-green-700/20 mt-2">
              {loading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account? <Link to="/login" className="text-green-700 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}