import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../api';
import { ArrowDownCircle, ArrowUpCircle, Edit2 } from 'lucide-react';
import SmartTransactionForm from '../components/SmartTransactionForm';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('ALL'); 
  const [editingTx, setEditingTx] = useState(null); // This state opens the modal

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await getAllTransactions();
      setTransactions(res.data);
    } catch (err) { console.error("Error loading history", err); }
  };

  const handleEditSuccess = () => {
    setEditingTx(null); // Close modal
    loadData(); // Refresh list to show changes
  };

  const filteredData = transactions.filter(t => filter === 'ALL' || t.type === filter);

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Financial History</h2>
        
        <div className="flex gap-2 bg-white p-1 rounded-lg border">
          {['ALL', 'EXPENSE', 'INCOME'].map(f => (
            <button
              key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
                filter === f ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredData.map((tx) => (
          <div key={tx.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow group">
            
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${tx.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                {tx.type === 'INCOME' ? <ArrowUpCircle className="text-green-600" size={24} /> : <ArrowDownCircle className="text-red-600" size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-800">{tx.category}</h4>
                  {!tx.farmId && <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">Common</span>}
                </div>
                <p className="text-sm text-gray-500">{tx.description || "No notes"} • {tx.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className={`text-lg font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                </p>
                {tx.quantity && <p className="text-xs text-gray-400 font-medium">{tx.quantity} {tx.unit}</p>}
              </div>
              
              {/* EDIT BUTTON */}
              <button 
                onClick={() => setEditingTx(tx)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
              >
                <Edit2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && <p className="text-center text-gray-500 py-10">No transactions found.</p>}
      </div>

      {/* Edit Modal */}
      {editingTx && (
        <SmartTransactionForm 
          initialData={editingTx}
          onClose={() => setEditingTx(null)} 
          onSuccess={handleEditSuccess} 
        />
      )}
    </div>
  );
}