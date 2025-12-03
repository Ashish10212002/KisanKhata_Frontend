import React, { useState, useEffect } from 'react';
import { createTransaction, updateTransaction, getFarms } from '../api';
import { X, Calculator } from 'lucide-react';

export default function SmartTransactionForm({ onClose, onSuccess, initialData = null }) {
  const [farms, setFarms] = useState([]);
  const isEditing = !!initialData; // Logic: If data exists, we are editing
  
  // State initialization
  const [type, setType] = useState('EXPENSE');
  const [farmId, setFarmId] = useState('common'); 
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Quintal'); 
  const [rate, setRate] = useState('');

  useEffect(() => {
    getFarms().then(res => setFarms(res.data)).catch(console.error);
    
    // IF EDITING: Fill the form with existing data
    if (initialData) {
      setType(initialData.type);
      setFarmId(initialData.farmId || 'common');
      setCategory(initialData.category);
      setDate(initialData.date);
      setDescription(initialData.description || '');
      setAmount(initialData.amount);
      if(initialData.quantity) {
        setQuantity(initialData.quantity);
        setUnit(initialData.unit);
      }
    }
  }, [initialData]);

  // Calculator Logic
  useEffect(() => {
    if (type === 'INCOME' && quantity && rate) {
      setAmount((parseFloat(quantity) * parseFloat(rate)).toFixed(2));
    }
  }, [quantity, rate, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return alert("Please enter an amount");

    const payload = {
      farmId: farmId === 'common' ? null : farmId,
      type,
      category,
      amount: parseFloat(amount),
      date,
      description,
      quantity: quantity ? parseFloat(quantity) : null,
      unit: quantity ? unit : null
    };

    try {
      if (isEditing) {
        await updateTransaction(initialData.id, payload); // Calls your new Java PUT endpoint
      } else {
        await createTransaction(payload);
      }
      onSuccess(); 
      onClose();   
    } catch (err) {
      alert("Failed to save. Check backend.");
    }
  };

  const categories = type === 'EXPENSE' 
    ? ['Diesel', 'Seed', 'Fertilizer', 'Labor', 'Pesticide', 'Repair', 'Electricity', 'Other']
    : ['Grain (Anaaj)', 'Fodder (Bhusa)', 'Vegetables', 'Fruits', 'Other'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        <div className={`p-4 flex justify-between items-center ${type === 'INCOME' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          <h3 className="font-bold text-lg flex items-center gap-2">
            {isEditing ? 'Edit Transaction' : (type === 'INCOME' ? 'Add Income' : 'Add Expense')}
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['EXPENSE', 'INCOME'].map(t => (
              <button
                key={t} type="button" onClick={() => setType(t)}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${type === t ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Apply To</label>
            <select 
              value={farmId} onChange={e => setFarmId(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-50 outline-none"
            >
              <option value="common">🏠 Common / Shared Expense</option>
              <option disabled>──────────</option>
              {farms.map(f => <option key={f.id} value={f.id}>🌱 {f.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl">
                <option value="">Select...</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {type === 'INCOME' && (
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-2 text-green-700 font-bold text-sm">
                <Calculator size={16}/> Yield Calculator
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input placeholder="Qty" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="p-2 border rounded-lg" />
                <select value={unit} onChange={e => setUnit(e.target.value)} className="p-2 border rounded-lg bg-white">
                  <option>Quintal</option> <option>Kg</option> <option>Ton</option>
                </select>
                <input placeholder="Rate" type="number" value={rate} onChange={e => setRate(e.target.value)} className="p-2 border rounded-lg" />
              </div>
            </div>
          )}

          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Amount (₹)</label>
            <input 
              type="number" value={amount} onChange={e => setAmount(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-2xl font-bold text-gray-800 focus:border-green-500 outline-none"
              placeholder="0.00"
            />
          </div>

          <textarea 
            placeholder="Add a note..." value={description} onChange={e => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-20 text-sm resize-none"
          />

          <button className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity ${type === 'INCOME' ? 'bg-green-600' : 'bg-red-600'}`}>
            {isEditing ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}