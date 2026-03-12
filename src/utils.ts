import { FocusTask, Goal, TaskEnergyLevel, UserEnergyLevel } from './types';

export function daysSince(dateStr: string): number {
  if (!dateStr) return 1000; // If never done, treat as long time ago
  const today = new Date();
  const date = new Date(dateStr);
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
}

export function energyMatch(taskEnergy: TaskEnergyLevel, userEnergy: UserEnergyLevel): number {
  if (userEnergy === 'low') {
    return taskEnergy === 'low' ? 1 : 0;
  }
  if (userEnergy === 'medium') {
    return taskEnergy === 'medium' ? 1 : (taskEnergy === 'low' ? 0.8 : 0);
  }
  if (userEnergy === 'high') {
    return taskEnergy === 'high' ? 1 : (taskEnergy === 'medium' ? 0.8 : 0.6);
  }
  return 0;
}

export function recommendTasks(tasks: FocusTask[], goals: Goal[], userEnergy: UserEnergyLevel): FocusTask[] {
  const today = new Date().toISOString().split('T')[0];

  // 1. Filter tasks by energy level and completion status (including recurring logic)
  const candidates = tasks.filter(task => {
    // Recurring logic: if period > 0, check if it's time to reactivate
    let isAvailable = !task.is_completed;
    
    if (task.is_completed && task.period > 0 && task.last_completed_at) {
      const days = daysSince(task.last_completed_at);
      if (days >= task.period) {
        isAvailable = true;
      }
    }

    if (!isAvailable) return false;

    // Energy filter: 
    // Low: only low
    // Medium: low + medium
    // High: all
    let energyPass = true;
    if (userEnergy === 'low') {
      energyPass = task.energy === 'low';
    } else if (userEnergy === 'medium') {
      energyPass = ['low', 'medium'].includes(task.energy);
    } else if (userEnergy === 'high') {
      energyPass = true;
    }
    
    return energyPass;
  });

  // 2. Calculate score
  const scoredTasks = candidates.map(task => {
    const goalObj = goals.find(g => g.goal === task.goal);
    const goalWeight = goalObj ? goalObj.weight : 0;
    const days = daysSince(task.last_completed_at || '');
    const match = energyMatch(task.energy, userEnergy);

    // Priority: 1 is highest, 5 is lowest. We want higher score for lower number.
    const priorityScore = 6 - task.priority;

    const score =
      (goalWeight * 0.35) +
      (priorityScore * 0.25) +
      (days * 0.20) +
      (match * 0.20);

    return { ...task, score };
  });

  // 3. Sort by score descending
  scoredTasks.sort((a, b) => b.score - a.score);

  // 4. Return top 3
  return scoredTasks.slice(0, 3).map(({ score, ...task }) => task);
}
