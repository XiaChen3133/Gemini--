import React from 'react';
import { useApp } from '../context/AppContext';
import { EnergySelector } from '../components/EnergySelector';
import { TaskCard } from '../components/TaskCard';
import { DecisionList } from '../components/DecisionList';
import { QuickTaskList } from '../components/QuickTaskList';

export function TodayPage() {
  const {
    state,
    setEnergy,
    completeFocusTask,
    addDecisionTask,
    completeDecisionTask,
    addQuickTask,
    completeQuickTask
  } = useApp();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pt-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-[#1A6840]">Todo OS</h1>
        <div className="flex space-x-4 text-sm text-gray-500">
          {/* Header links could go here if needed, but Layout handles nav */}
        </div>
      </header>

      <section>
        <EnergySelector
          currentEnergy={state.userEnergy}
          onSelect={setEnergy}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          建议Todo
        </h2>
        {state.recommendedTasks.length > 0 ? (
          <div className="space-y-3">
            {state.recommendedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={completeFocusTask}
              />
            ))}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/50">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
              {state.userEnergy ? "没有匹配当前能量的任务" : "请先选择能量状态"}
            </p>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <DecisionList
            tasks={state.decisionTasks}
            onAdd={addDecisionTask}
            onComplete={completeDecisionTask}
          />
        </section>

        <section>
          <QuickTaskList
            tasks={state.quickTasks}
            onAdd={addQuickTask}
            onComplete={completeQuickTask}
          />
        </section>
      </div>
    </div>
  );
}
