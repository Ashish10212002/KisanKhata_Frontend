import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTransactionsByFarm } from '../api';
import { ArrowDownCircle, ArrowUpCircle, Edit2 } from 'lucide-react';
import SmartTransactionForm from '../components/SmartTransactionForm';

export default function FarmDetails() {
  const { id } = useParams(); 
  const [transactions, setTransactions] = useState([]);
  
  // State for the "Add New" modal and "Edit" modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  useEffect(() => { loadTransactions(); }, [id]);

  const loadTransactions = async () => {
    try {
      const res = await getTransactionsByFarm(id);
      setTransactions(res.data);
    } catch (err) { console.error("Error loading transactions:", err); }
  };

  const handleSuccess = () => {
    setShowAddModal(false);
    setEditingTx(null);
    loadTransactions();
  };

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Farm Transactions</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-gray-800"
        >
          + Add Entry
        </button>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm group">
            <div className="flex items-center gap-3">
              {tx.type === 'INCOME' 
                ? <ArrowUpCircle className="text-green-500" /> 
                : <ArrowDownCircle className="text-red-500" />
              }
              <div>
                <p className="font-semibold text-gray-800">{tx.category}</p>
                <p className="text-xs text-gray-500">{tx.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className={`block font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'} ₹{tx.amount}
                </span>
                {tx.description && <span className="text-xs text-gray-400 max-w-[100px] truncate block">{tx.description}</span>}
              </div>
              
              {/* EDIT BUTTON */}
              <button 
                onClick={() => setEditingTx(tx)}
                className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <Edit2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {transactions.length === 0 && <p className="text-center text-gray-400 py-10 italic">No records yet.</p>}
      </div>

      {/* Modal for Creating NEW Entry */}
      {showAddModal && (
        <SmartTransactionForm 
          // We pass this so the form auto-selects the current farm
          initialData={{ farmId: id, type: 'EXPENSE', amount: '', category: 'Diesel', date: new Date().toISOString().split('T')[0] }}
          // Wait, passing ID here might trigger Edit Mode? 
          // NO, because we check for 'id' property in SmartTransactionForm. 
          // Our manually created object doesn't have a transaction 'id', so it works as "Create".
          onClose={() => setShowAddModal(false)} 
          onSuccess={handleSuccess} 
        />
      )}

      {/* Modal for EDITING Entry */}
      {editingTx && (
        <SmartTransactionForm 
          initialData={editingTx}
          onClose={() => setEditingTx(null)} 
          onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
}