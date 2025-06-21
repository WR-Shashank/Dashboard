export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  stage: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stage {
  id: string;
  title: string;
  color: string;
  order: number;
}

export interface TaskContextType {
  tasks: Task[];
  stages: Stage[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStage: string) => void;
  reorderTasks: (startIndex: number, endIndex: number, stageId: string) => void;
}