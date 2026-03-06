import { useState, useEffect } from 'react';
import { AppState, FocusTask, Goal, DecisionTask, QuickTask, UserEnergyLevel } from '../types';
import { initialFocusTasks, initialGoals, initialDecisionTasks, initialQuickTasks } from '../data/initialData';
import { recommendTasks } from '../utils';

const STORAGE_KEY = 'daily_decision_engine_v1';

const defaultState: AppState = {
  focusTasks: initialFocusTasks,
  goals: initialGoals,
  decisionTasks: initialDecisionTasks,
  quickTasks: initialQuickTasks,
  userEnergy: null,
  recommendedTasks: [],
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setEnergy = (energy: UserEnergyLevel) => {
    const recommended = recommendTasks(state.focusTasks, state.goals, energy);
    setState(prev => ({ ...prev, userEnergy: energy, recommendedTasks: recommended }));
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
    // When completing a focus task, we update its last_completed_at
    // We do NOT remove it, as it's a "long-term task pool".
    // The prompt says "Focus Tasks (Task Pool) Long-term tasks that should be actively pushed forward."
    // And "Button: Complete".
    // Usually "Complete" on a recurring task updates the date.
    // If it was a one-off, it would be deleted.
    // Given "last_completed_at" is a field, it implies recurrence or at least tracking.
    // I will update the date to today.
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
      const updatedTasks = prev.focusTasks.map(t => 
        t.id === id ? { ...t, last_completed_at: today } : t
      );
      
      // Also update recommended tasks to reflect the change (remove it from view? or just update?)
      // Usually if I complete a recommended task, I want it to disappear from "Today's" list.
      // But the spec says "Always recommend exactly 3 tasks".
      // If I remove one, do I recommend another?
      // "After selecting energy, the system recommends 3 focus tasks."
      // If I complete one, maybe it just shows as completed or disappears.
      // I'll mark it as completed in the UI or remove it from the recommended list.
      // Let's remove it from recommendedTasks.
      
      return {
        ...prev,
        focusTasks: updatedTasks,
        recommendedTasks: prev.recommendedTasks.filter(t => t.id !== id)
      };
    });
  };

  const addDecisionTask = (task: DecisionTask) => {
    setState(prev => ({ ...prev, decisionTasks: [...prev.decisionTasks, task] }));
  };

  const completeDecisionTask = (id: string) => {
    setState(prev => ({
      ...prev,
      decisionTasks: prev.decisionTasks.filter(t => t.id !== id)
    }));
  };

  const addQuickTask = (task: QuickTask) => {
    setState(prev => ({ ...prev, quickTasks: [...prev.quickTasks, task] }));
  };

  const toggleQuickTask = (id: string) => {
    setState(prev => ({
      ...prev,
      quickTasks: prev.quickTasks.filter(t => t.id !== id) // "Completed items disappear"
    }));
  };

  const updateGoal = (goal: Goal) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.goal === goal.goal ? goal : g)
    }));
  };
  
  const addGoal = (goal: Goal) => {
      setState(prev => ({ ...prev, goals: [...prev.goals, goal] }));
  };

  const deleteGoal = (goalName: string) => {
      setState(prev => ({ ...prev, goals: prev.goals.filter(g => g.goal !== goalName) }));
  };

  return {
    state,
    setEnergy,
    addFocusTask,
    updateFocusTask,
    deleteFocusTask,
    completeFocusTask,
    addDecisionTask,
    completeDecisionTask,
    addQuickTask,
    toggleQuickTask,
    updateGoal,
    addGoal,
    deleteGoal
  };
}
