import React from 'react';
import { FocusTask } from '../types';
import { CheckCircle2, Clock, Tag } from 'lucide-react';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: FocusTask;
  onComplete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  const energyColors = {
    low: 'bg-[#1A6840] text-white border-[#1A6840]',
    medium: 'bg-[#FBDC92] text-[#1A6840] border-[#FBDC92]',
    high: 'bg-[#E44821] text-white border-[#E44821]'
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#1A6840]/20 transition-all duration-200 group shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={clsx(
              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
              energyColors[task.energy as keyof typeof energyColors]
            )}>
              {task.energy === 'high' ? '高能量' : task.energy === 'medium' ? '中能量' : '低能量'}
            </span>
          </div>
          <h3 className="text-base font-medium text-gray-900 leading-tight mb-3">{task.title}</h3>
          
          <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase tracking-wider space-x-4">
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
              <Clock size={12} className="mr-1.5" />
              <span>{task.estimated_time} MIN</span>
            </div>
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
              <Tag size={12} className="mr-1.5" />
              <span>{task.goal}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onComplete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-300 hover:text-[#1A6840]"
          title="完成"
        >
          <CheckCircle2 size={24} />
        </button>
      </div>
    </div>
  );
}
