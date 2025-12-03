import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFarms, createFarm, updateFarm } from '../api';
import { Plus, MapPin, Sprout, Calendar, Edit2, X, Clock } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '', crop: '', area: '', sowingDate: '' });

  useEffect(() => { loadFarms(); }, []);

  const loadFarms = async () => {
    try {
      const res = await getFarms();
      setFarms(res.data);
    } catch (err) { console.error("Failed to load farms"); }
  };

  const openEdit = (farm) => {
    setEditingId(farm.id);
    setFormData({ 
      name: farm.name, location: farm.location, 
      crop: farm.crop, area: farm.area, sowingDate: farm.sowingDate || '' 
    });
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({ name: '', location: '', crop: '', area: '', sowingDate: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, area: parseFloat(formData.area) };
      if (editingId) await updateFarm(editingId, payload);
      else await createFarm(payload);
      setIsModalOpen(false);
      loadFarms();
    } catch (err) { alert("Error saving farm."); }
  };

  // --- SMART LOGIC: Calculate Crop Progress ---
  const getProgress = (sowingDate) => {
    if (!sowingDate) return null;
    
    const start = new Date(sowingDate);
    const today = new Date();
    const daysPassed = differenceInDays(today, start);
    
    // Assumption: Average crop cycle is ~120 days (4 months)
    const totalDays = 120; 
    let percentage = (daysPassed / totalDays) * 100;
    if (percentage > 100) percentage = 100; // Cap at 100%

    // Determine Stage
    let stage = "Seedling";
    if (daysPassed > 30) stage = "Vegetative";
    if (daysPassed > 60) stage = "Flowering";
    if (daysPassed > 90) stage = "Maturity";
    if (daysPassed > 110) stage = "Ready to Harvest";

    return { daysPassed, percentage, stage };
  };

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Farms</h2>
        <button onClick={openCreate} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-lg shadow-green-200">
          <Plus size={20} /> Add Farm
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => {
          const progress = getProgress(farm.sowingDate);

          return (
            <div key={farm.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
              <Link to={`/farms/${farm.id}`} className="block p-6">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-green-50 p-3 rounded-xl text-green-700"><Sprout size={24} /></div>
                  <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">{farm.area} Acres</span>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-1">{farm.name}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1"><MapPin size={14}/> {farm.location}</p>
                
                {/* Crop Info */}
                <div className="mt-4 flex gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                     <span className="font-semibold">Crop:</span> {farm.crop}
                  </div>
                </div>

                {/* Progress Bar (Visual Magic) */}
                {progress ? (
                  <div className="mt-6">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-green-700">{progress.stage}</span>
                      <span className="text-gray-400">{progress.daysPassed} Days</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 flex items-center gap-2 text-xs text-orange-500 bg-orange-50 p-2 rounded-lg">
                    <Clock size={14}/> Add sowing date to track progress
                  </div>
                )}
              </Link>
              
              {/* Footer Edit */}
              <div className="border-t border-gray-100 bg-gray-50/50 mt-4">
                <button onClick={() => openEdit(farm)} className="w-full py-3 text-sm font-semibold text-gray-600 hover:bg-white hover:text-blue-600 transition-colors flex justify-center items-center gap-2">
                  <Edit2 size={16} /> Manage Farm
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Logic (Same as before) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Farm' : 'Add New Farm'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600"/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full p-3 border rounded-xl" placeholder="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input className="w-full p-3 border rounded-xl" placeholder="Crop" required value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})} />
                <input type="number" step="0.1" className="w-full p-3 border rounded-xl" placeholder="Area" required value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sowing Date (Required for Progress)</label>
                   <input type="date" className="w-full p-3 border rounded-xl" value={formData.sowingDate} onChange={e => setFormData({...formData, sowingDate: e.target.value})} />
                </div>
                
                <input className="w-full p-3 border rounded-xl" placeholder="Location" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                
              <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg mt-4 hover:bg-green-700">
                {editingId ? 'Update Farm' : 'Create Farm'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}