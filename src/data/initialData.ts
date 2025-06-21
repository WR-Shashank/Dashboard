import { Task, Stage } from '../types';

export const initialStages: Stage[] = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-100', order: 0 },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100', order: 1 },
  { id: 'review', title: 'Review', color: 'bg-yellow-100', order: 2 },
  { id: 'done', title: 'Done', color: 'bg-green-100', order: 3 },
];

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design landing page mockups',
    description: 'Create wireframes and high-fidelity mockups for the new landing page',
    priority: 'high',
    stage: 'todo',
    dueDate: '2025-01-15',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'Set up database schema',
    description: 'Design and implement the database structure for user management',
    priority: 'high',
    stage: 'in-progress',
    dueDate: '2025-01-12',
    createdAt: '2025-01-10T11:00:00Z',
    updatedAt: '2025-01-10T11:00:00Z',
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST endpoints with examples and response formats',
    priority: 'medium',
    stage: 'todo',
    dueDate: '2025-01-20',
    createdAt: '2025-01-10T12:00:00Z',
    updatedAt: '2025-01-10T12:00:00Z',
  },
  {
    id: '4',
    title: 'Implement user authentication',
    description: 'Add login, signup, and password reset functionality',
    priority: 'high',
    stage: 'review',
    dueDate: '2025-01-14',
    createdAt: '2025-01-10T13:00:00Z',
    updatedAt: '2025-01-10T13:00:00Z',
  },
  {
    id: '5',
    title: 'Update project dependencies',
    description: 'Review and update all npm packages to latest stable versions',
    priority: 'low',
    stage: 'done',
    createdAt: '2025-01-10T14:00:00Z',
    updatedAt: '2025-01-10T14:00:00Z',
  },
];