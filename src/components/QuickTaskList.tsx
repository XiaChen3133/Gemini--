import React, { useState } from 'react';
import { QuickTask } from '../types';
import { Plus, CheckSquare, Square } from 'lucide-react';

interface QuickTaskListProps {
  tasks: QuickTask[];
  onAdd: (title: string) => void;
  onComplete: (id: string) => void;
}

export function QuickTaskList({ tasks, onAdd, onComplete }: QuickTaskListProps) {
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAdd(newTitle);
      setNewTitle('');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full flex flex-col shadow-sm">
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
        快速任务 (≤5分钟)
      </h3>

      <form onSubmit={handleSubmit} className="relative mb-4">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="快速任务..."
          className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1A6840]/40 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#1A6840] transition-colors"
        >
          <Plus size={18} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto min-h-[100px]">
        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center group p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <button
                  onClick={() => onComplete(task.id)}
                  className="flex-shrink-0 mr-3 text-gray-300 hover:text-[#1A6840] transition-colors"
                >
                  {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
                <span className={`text-xs ${task.completed ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-300 text-[10px] font-bold uppercase tracking-wider">
            空
          </div>
        )}
      </div>
    </div>
  );
}
