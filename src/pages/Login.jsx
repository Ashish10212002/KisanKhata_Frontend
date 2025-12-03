import React, { useState } from 'react';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, ArrowLeft, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(formData);
      login(res.data.token, res.data.name);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE: Visual Brand Panel (Hidden on Mobile) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-800 to-emerald-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
           <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-400 rounded-full mix-blend-overlay filter blur-3xl opacity-50"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <div className="mt-10">
             <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm mb-4">
                <Sprout size={28} className="text-white" />
             </div>
             <h1 className="text-4xl font-bold tracking-tight">FarmTrack</h1>
             <p className="mt-2 text-green-100/80">The modern operating system for Indian Agriculture.</p>
          </div>
        </div>

        <div className="relative z-10">
          <blockquote className="text-lg font-medium italic text-green-50/90">
            "Before FarmTrack, I guessed my profits. Now I know exactly where every Rupee goes. It changed my farming forever."
          </blockquote>
          <p className="mt-4 font-bold text-white">— Rajesh Kumar, Wheat Farmer (Punjab)</p>
        </div>
      </div>

      {/* RIGHT SIDE: The Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-gray-50/50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          
          <div className="mb-8 text-center">
            <div className="md:hidden flex justify-center mb-4 text-green-600"><Sprout size={48} /></div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-2">Enter your details to access your farm.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 border border-red-100">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input 
                  type="email" required placeholder="you@example.com"
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-green-700 text-white py-3.5 rounded-xl font-bold hover:bg-green-800 transition-all shadow-lg shadow-green-700/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-700 font-bold hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}