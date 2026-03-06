import React from 'react';
import { UserEnergyLevel } from '../types';
import { clsx } from 'clsx';

interface EnergySelectorProps {
  currentEnergy: UserEnergyLevel | null;
  onSelect: (energy: UserEnergyLevel) => void;
}

export function EnergySelector({ currentEnergy, onSelect }: EnergySelectorProps) {
  const options: { value: UserEnergyLevel; label: string; activeClass: string; inactiveClass: string }[] = [
    { value: 'low', label: '低能量', activeClass: 'bg-[#1A6840] text-white border-[#1A6840]', inactiveClass: 'bg-white text-gray-400 border-gray-100' },
    { value: 'medium', label: '中能量', activeClass: 'bg-[#FBDC92] text-[#1A6840] border-[#FBDC92]', inactiveClass: 'bg-white text-gray-400 border-gray-100' },
    { value: 'high', label: '高能量', activeClass: 'bg-[#E44821] text-white border-[#E44821]', inactiveClass: 'bg-white text-gray-400 border-gray-100' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">能量状态</h2>
      <div className="flex space-x-3">
        {options.map((option) => {
          const isSelected = currentEnergy === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={clsx(
                "flex-1 py-2.5 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border",
                isSelected 
                  ? `${option.activeClass} shadow-md shadow-[#1A6840]/10` 
                  : `${option.inactiveClass} hover:bg-gray-50`
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
