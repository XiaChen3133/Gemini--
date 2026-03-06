import React, { useState, useEffect } from 'react';
import { FocusTask, Goal, TaskEnergyLevel } from '../types';
import { X } from 'lucide-react';

interface TaskFormProps {
  initialTask?: FocusTask | null;
  goals: Goal[];
  onSubmit: (task: FocusTask) => void;
  onCancel: () => void;
}

export function TaskForm({ initialTask, goals, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [goal, setGoal] = useState(initialTask?.goal || (goals[0]?.goal || ''));
  const [priority, setPriority] = useState(initialTask?.priority || 3);
  const [energy, setEnergy] = useState<TaskEnergyLevel>(initialTask?.energy || 'medium');
  const [estimatedTime, setEstimatedTime] = useState(initialTask?.estimated_time || 30);
  const [period, setPeriod] = useState(initialTask?.period || 0);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setGoal(initialTask.goal);
      setPriority(initialTask.priority);
      setEnergy(initialTask.energy);
      setEstimatedTime(initialTask.estimated_time);
      setPeriod(initialTask.period || 0);
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const task: FocusTask = {
      id: initialTask?.id || Date.now().toString(36) + Math.random().toString(36).substr(2),
      title,
      goal,
      priority,
      energy,
      estimated_time: estimatedTime,
      last_completed_at: initialTask?.last_completed_at,
      is_completed: initialTask?.is_completed || false,
      period
    };
    onSubmit(task);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-50">
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-widest">
            {initialTask ? '编辑任务' : '新建聚焦任务'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">标题</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1A6840]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">目标</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1A6840]/40"
              >
                {goals.map(g => (
                  <option key={g.goal} value={g.goal}>{g.goal}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">优先级 (1-5)</label>
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1A6840]/40"
              >
                {[1, 2, 3, 4, 5].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">能量需求</label>
              <select
                value={energy}
                onChange={(e) => setEnergy(e.target.value as TaskEnergyLevel)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1A6840]/40"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">预估时间 (MIN)</label>
              <input
                type="number"
                min="1"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1A6840]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">周期 (天, 0为一次性)</label>
            <input
              type="number"
              min="0"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1A6840]/40"
              placeholder="0"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-400 bg-gray-50 rounded-xl hover:bg-gray-100 font-bold text-[10px] uppercase tracking-widest transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-white bg-[#1A6840] rounded-xl hover:bg-[#1A6840]/90 font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-[#1A6840]/20 transition-all"
            >
              保存任务
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
