import React from 'react';
import { useApp } from '../context/AppContext';
import { GoalList } from '../components/GoalList';

export function GoalsPage() {
  const { state, addGoal, updateGoal, deleteGoal } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-4">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-[#1A6840]">成长</h1>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">DEFINE WHAT MATTERS TO YOU</p>
      </header>

      <GoalList
        goals={state.goals}
        onAdd={addGoal}
        onUpdate={updateGoal}
        onDelete={deleteGoal}
      />
    </div>
  );
}
