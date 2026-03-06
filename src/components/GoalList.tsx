import React, { useState } from 'react';
import { Goal } from '../types';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface GoalListProps {
  goals: Goal[];
  onAdd: (goal: Goal) => void;
  onUpdate: (goal: Goal) => void;
  onDelete: (goalName: string) => void;
}

export function GoalList({ goals, onAdd, onUpdate, onDelete }: GoalListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(10);

  const startAdd = () => {
    setName('');
    setWeight(10);
    setIsAdding(true);
    setEditingGoal(null);
  };

  const startEdit = (goal: Goal) => {
    setName(goal.goal);
    setWeight(goal.weight);
    setEditingGoal(goal.goal);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    if (isAdding) {
      onAdd({ goal: name, weight });
    } else if (editingGoal) {
      // If name changed, we might need to handle ID change or just update properties.
      // The prompt says "Tasks reference one goal". If I change goal name, tasks might break.
      // For MVP, I'll assume goal name is the ID and immutable, or I update tasks too.
      // But `Goal` type has `goal` as the key.
      // I'll just update the weight for now to be safe, or allow name change if I had a real ID.
      // Let's assume name is immutable for edit, only weight changes.
      // Or I delete and re-add.
      // I'll just update weight for simplicity in MVP.
      onUpdate({ goal: editingGoal, weight });
    }
    
    setIsAdding(false);
    setEditingGoal(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Long-term Goals</h2>
        <button
          onClick={startAdd}
          className="flex items-center px-3 py-1.5 bg-[#1A6840] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#1A6840]/90 transition-all shadow-md shadow-[#1A6840]/10"
        >
          <Plus size={14} className="mr-1" />
          Add Goal
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-50">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Goal</th>
              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Weight</th>
              <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {goals.map((g) => (
              <tr key={g.goal} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-900">
                  {g.goal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                  {editingGoal === g.goal ? (
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-20 px-2 py-1 bg-gray-50 border border-gray-100 rounded text-gray-900 text-xs focus:outline-none focus:ring-1 focus:ring-[#1A6840]/40"
                    />
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#1A6840]/5 text-[#1A6840] border border-[#1A6840]/10">
                      {g.weight}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                  {editingGoal === g.goal ? (
                    <div className="flex justify-end space-x-2">
                      <button onClick={handleSave} className="text-[#1A6840] hover:text-[#1A6840]/80 transition-colors"><Save size={18} /></button>
                      <button onClick={() => setEditingGoal(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => startEdit(g)} className="text-[#1A6840] hover:text-[#1A6840]/80 transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => onDelete(g.goal)} className="text-[#E44821]/60 hover:text-[#E44821] transition-colors"><Trash2 size={18} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-lg animate-in fade-in slide-in-from-top-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">New Goal</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Goal Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1A6840]/40"
            />
            <input
              type="number"
              placeholder="Weight"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-24 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1A6840]/40"
            />
            <button onClick={handleSave} className="px-4 py-2 bg-[#1A6840] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A6840]/90 transition-all shadow-md shadow-[#1A6840]/10">
              Save
            </button>
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-50 border border-gray-100 text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
