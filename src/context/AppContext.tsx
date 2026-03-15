import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, FocusTask, Goal, DecisionTask, QuickTask, UserEnergyLevel, TaskEnergyLevel } from '../types';
import { initialFocusTasks, initialGoals, initialDecisionTasks, initialQuickTasks } from '../data/initialData';
import { recommendTasks } from '../utils';

interface AppContextType {
  state: AppState;
  setEnergy: (energy: UserEnergyLevel) => void;
  addFocusTask: (task: FocusTask) => void;
  updateFocusTask: (task: FocusTask) => void;
  deleteFocusTask: (id: string) => void;
  completeFocusTask: (id: string) => void;
  addDecisionTask: (title: string, priority: number) => void;
  completeDecisionTask: (id: string) => void;
  addQuickTask: (title: string) => void;
  completeQuickTask: (id: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (goalName: string) => void;
  updateFutureMemo: (memo: string) => void;
  updateUserId: (id: string) => void;
  exportData: () => void;
  importData: (jsonString: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'daily_decision_engine_v1';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      userId: 'default_user',
      focusTasks: initialFocusTasks,
      goals: initialGoals,
      decisionTasks: initialDecisionTasks,
      quickTasks: initialQuickTasks,
      userEnergy: null,
      recommendedTasks: [],
      futureMemo: '',
    };
  });

  // Load from backend on mount
  useEffect(() => {
    const loadFromBackend = async () => {
      const userId = state.userId || 'default_user';
      try {
        const response = await fetch(`/api/state/${userId}`);
        if (response.ok) {
          const backendState = await response.json();
          setState(prev => ({ ...backendState, userId: prev.userId })); // Keep current userId
        }
      } catch (e) {
        console.error('Failed to load from backend:', e);
      }
    };
    loadFromBackend();
  }, []);

  // Save to backend and localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    const saveToBackend = async () => {
      const userId = state.userId || 'default_user';
      try {
        await fetch(`/api/state/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state)
        });
      } catch (e) {
        console.error('Failed to save to backend:', e);
      }
    };

    const timeoutId = setTimeout(saveToBackend, 1000); // Debounce 1s
    return () => clearTimeout(timeoutId);
  }, [state]);

  // Reactivate recurring tasks whose period has passed
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const needsRefresh = state.focusTasks.some(t => 
      t.is_completed && t.period > 0 && t.last_completed_at && 
      Math.abs(new Date(today).getTime() - new Date(t.last_completed_at).getTime()) / (1000 * 60 * 60 * 24) >= t.period
    );

    if (needsRefresh) {
      setState(prev => ({
        ...prev,
        focusTasks: prev.focusTasks.map(t => {
          if (t.is_completed && t.period > 0 && t.last_completed_at) {
            const diffDays = Math.abs(new Date(today).getTime() - new Date(t.last_completed_at).getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays >= t.period) {
              return { ...t, is_completed: false };
            }
          }
          return t;
        })
      }));
    }
  }, [state.focusTasks]);

  const setEnergy = (energy: UserEnergyLevel) => {
    const recommended = recommendTasks(state.focusTasks, state.goals, energy);
    setState(prev => ({ ...prev, userEnergy: energy, recommendedTasks: recommended }));
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addFocusTask = (task: FocusTask) => {
    setState(prev => ({ ...prev, focusTasks: [...prev.focusTasks, task] }));
  };

  const updateFocusTask = (task: FocusTask) => {
    setState(prev => ({
      ...prev,
      focusTasks: prev.focusTasks.map(t => t.id === task.id ? task : t)
    }));
  };

  const deleteFocusTask = (id: string) => {
    setState(prev => ({
      ...prev,
      focusTasks: prev.focusTasks.filter(t => t.id !== id)
    }));
  };

  const completeFocusTask = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
      const updatedTasks = prev.focusTasks.map(t => 
        t.id === id ? { ...t, last_completed_at: today, is_completed: true } : t
      );
      return {
        ...prev,
        focusTasks: updatedTasks,
        recommendedTasks: prev.recommendedTasks.filter(t => t.id !== id)
      };
    });
  };

  const addDecisionTask = (title: string, priority: number) => {
    const newTask: DecisionTask = {
      id: generateId(),
      title,
      priority,
      created_at: new Date().toISOString().split('T')[0]
    };
    setState(prev => ({ ...prev, decisionTasks: [...prev.decisionTasks, newTask] }));
  };

  const completeDecisionTask = (id: string) => {
    setState(prev => ({
      ...prev,
      decisionTasks: prev.decisionTasks.filter(t => t.id !== id)
    }));
  };

  const addQuickTask = (title: string) => {
    const newTask: QuickTask = {
      id: generateId(),
      title,
      completed: false
    };
    setState(prev => ({ ...prev, quickTasks: [...prev.quickTasks, newTask] }));
  };

  const completeQuickTask = (id: string) => {
    setState(prev => ({
      ...prev,
      quickTasks: prev.quickTasks.filter(t => t.id !== id)
    }));
  };

  const addGoal = (goal: Goal) => {
    setState(prev => ({ ...prev, goals: [...prev.goals, goal] }));
  };

  const updateGoal = (goal: Goal) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.goal === goal.goal ? goal : g)
    }));
  };

  const deleteGoal = (goalName: string) => {
    setState(prev => ({ ...prev, goals: prev.goals.filter(g => g.goal !== goalName) }));
  };

  const updateFutureMemo = (memo: string) => {
    setState(prev => ({ ...prev, futureMemo: memo }));
  };

  const updateUserId = (id: string) => {
    setState(prev => ({ ...prev, userId: id }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `decision_engine_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      // Basic validation
      if (parsed.focusTasks && parsed.goals) {
        setState(parsed);
        alert('数据导入成功！');
      } else {
        alert('无效的数据文件格式');
      }
    } catch (e) {
      alert('数据解析失败');
      console.error(e);
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      setEnergy,
      addFocusTask,
      updateFocusTask,
      deleteFocusTask,
      completeFocusTask,
      addDecisionTask,
      completeDecisionTask,
      addQuickTask,
      completeQuickTask,
      addGoal,
      updateGoal,
      deleteGoal,
      updateFutureMemo,
      updateUserId,
      exportData,
      importData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
