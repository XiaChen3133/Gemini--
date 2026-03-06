import { FocusTask, Goal, DecisionTask, QuickTask } from '../types';

export const initialFocusTasks: FocusTask[] = [
  {
    id: "task_001",
    title: "镁活动效果复盘",
    goal: "职业",
    priority: 1,
    energy: "high",
    estimated_time: 90,
    last_completed_at: "2026-02-28",
    is_completed: false,
    period: 0
  },
  {
    id: "task_002",
    title: "学习占星课程",
    goal: "成长",
    priority: 2,
    energy: "medium",
    estimated_time: 30,
    last_completed_at: "2026-03-02",
    is_completed: false,
    period: 0
  },
  {
    id: "task_003",
    title: "每周营销反思",
    goal: "职业",
    priority: 2,
    energy: "medium",
    estimated_time: 45,
    last_completed_at: "2026-02-27",
    is_completed: false,
    period: 7
  },
  {
    id: "task_004",
    title: "运动",
    goal: "健康",
    priority: 3,
    energy: "medium",
    estimated_time: 30,
    last_completed_at: "2026-03-01",
    is_completed: false,
    period: 1
  },
  {
    id: "task_005",
    title: "阅读研究论文",
    goal: "成长",
    priority: 3,
    energy: "low",
    estimated_time: 20,
    last_completed_at: "2026-03-04",
    is_completed: false,
    period: 0
  }
];

export const initialGoals: Goal[] = [
  { goal: "职业", weight: 40 },
  { goal: "成长", weight: 30 },
  { goal: "健康", weight: 20 },
  { goal: "生活", weight: 10 }
];

export const initialDecisionTasks: DecisionTask[] = [
  {
    id: "decision_001",
    title: "决定是否与创作者A合作",
    priority: 3,
    created_at: "2026-03-05"
  }
];

export const initialQuickTasks: QuickTask[] = [
  {
    id: "quick_001",
    title: "遛狗",
    completed: false
  }
];
