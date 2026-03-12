export type TaskEnergyLevel = 'low' | 'medium' | 'high';
export type UserEnergyLevel = 'low' | 'medium' | 'high';

export interface FocusTask {
  id: string;
  title: string;
  goal: string;
  priority: number; // 1-5 (1 is highest)
  energy: TaskEnergyLevel;
  estimated_time: number; // minutes
  last_completed_at?: string; // YYYY-MM-DD
  is_completed: boolean;
  period: number; // 0 = one-off, >0 = recurring days
}

export interface Goal {
  goal: string;
  weight: number; // 1-100
}

export interface DecisionTask {
  id: string;
  title: string;
  priority: number; // 1-5
  created_at: string; // YYYY-MM-DD
}

export interface QuickTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface AppState {
  focusTasks: FocusTask[];
  goals: Goal[];
  decisionTasks: DecisionTask[];
  quickTasks: QuickTask[];
  userEnergy: UserEnergyLevel | null;
  recommendedTasks: FocusTask[];
  futureMemo: string;
}
