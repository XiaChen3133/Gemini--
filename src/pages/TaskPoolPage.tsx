import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskForm } from '../components/TaskForm';
import { FocusTask } from '../types';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

export function TaskPoolPage() {
  const { state, addFocusTask, updateFocusTask, deleteFocusTask } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<FocusTask | null>(null);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'uncompleted'>('uncompleted');

  const filteredTasks = state.focusTasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(filter.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'completed') {
      matchesStatus = t.is_completed;
    } else if (statusFilter === 'uncompleted') {
      matchesStatus = !t.is_completed;
    }

    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEdit = (task: FocusTask) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSubmit = (task: FocusTask) => {
    if (editingTask) {
      updateFocusTask(task);
    } else {
      addFocusTask(task);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-4">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#1A6840]">任务池</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{state.focusTasks.length} TASKS</p>
        </div>
        <button
          onClick={handleAdd}
          className="p-3 bg-[#1A6840] text-white rounded-full shadow-lg shadow-[#1A6840]/20 hover:bg-[#1A6840]/90 transition-colors"
        >
          <Plus size={20} />
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="搜索任务..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1A6840]/40"
        />
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { value: 'all', label: '全部' },
          { value: 'uncompleted', label: '未完成' },
          { value: 'completed', label: '已完成' }
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setStatusFilter(option.value as any)}
            className={clsx(
              "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap border",
              statusFilter === option.value
                ? "bg-[#1A6840] text-white border-[#1A6840]"
                : "bg-white text-gray-400 border-gray-100 hover:bg-gray-50"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 pb-20">
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-start group hover:border-[#1A6840]/20 transition-all shadow-sm">
            <div className="flex-1 min-w-0 mr-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className={clsx(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                  task.energy === 'high' ? "bg-[#E44821] text-white border-[#E44821]" :
                  task.energy === 'medium' ? "bg-[#FBDC92] text-[#1A6840] border-[#FBDC92]" :
                  "bg-[#1A6840] text-white border-[#1A6840]"
                )}>
                  {task.energy === 'high' ? '高能量' : task.energy === 'medium' ? '中能量' : '低能量'}
                </span>
                {task.is_completed && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-400 border border-gray-200">
                    已完成
                  </span>
                )}
                <span className="text-xs text-gray-200">•</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{task.goal}</span>
              </div>
              <h3 className="text-base font-medium text-gray-900 truncate mb-2">{task.title}</h3>
              <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider space-x-3">
                <span>PRIORITY {task.priority}</span>
                <span>{task.estimated_time} MIN</span>
                {task.period > 0 && <span>CYCLE: {task.period}D</span>}
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => handleEdit(task)} 
                className="p-2 bg-[#1A6840]/5 text-[#1A6840]/60 rounded-lg hover:bg-[#1A6840]/10 hover:text-[#1A6840] transition-colors"
                title="编辑"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => deleteFocusTask(task.id)} 
                className="p-2 bg-[#E44821]/5 text-[#E44821]/60 rounded-lg hover:bg-[#E44821]/10 hover:text-[#E44821] transition-colors"
                title="删除"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-10 text-gray-300 text-[10px] font-bold uppercase tracking-widest">
            没有找到任务
          </div>
        )}
      </div>

      {isFormOpen && (
        <TaskForm
          initialTask={editingTask}
          goals={state.goals}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
