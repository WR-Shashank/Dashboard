import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, Stage, TaskContextType } from '../types';
import { initialTasks, initialStages } from '../data/initialData';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { taskId: string; newStage: string } }
  | { type: 'REORDER_TASKS'; payload: { startIndex: number; endIndex: number; stageId: string } };

interface TaskState {
  tasks: Task[];
  stages: Stage[];
}

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : task
        ),
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    
    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { ...task, stage: action.payload.newStage, updatedAt: new Date().toISOString() }
            : task
        ),
      };
    
    case 'REORDER_TASKS':
      const { startIndex, endIndex, stageId } = action.payload;
      
      // Get all tasks for this stage, sorted by their current order
      const stageTasks = state.tasks
        .filter(task => task.stage === stageId)
        .sort((a, b) => {
          // If tasks don't have an order property, maintain their current array order
          const aIndex = state.tasks.findIndex(t => t.id === a.id);
          const bIndex = state.tasks.findIndex(t => t.id === b.id);
          return aIndex - bIndex;
        });
      
      const otherTasks = state.tasks.filter(task => task.stage !== stageId);
      
      // Reorder the stage tasks
      const [movedTask] = stageTasks.splice(startIndex, 1);
      stageTasks.splice(endIndex, 0, movedTask);
      
      // Update the moved task's timestamp
      const updatedMovedTask = { ...movedTask, updatedAt: new Date().toISOString() };
      const updatedStageTasks = stageTasks.map(task => 
        task.id === movedTask.id ? updatedMovedTask : task
      );
      
      return { 
        ...state, 
        tasks: [...otherTasks, ...updatedStageTasks] 
      };
    
    default:
      return state;
  }
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: initialTasks,
    stages: initialStages,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
          dispatch({ type: 'SET_TASKS', payload: parsedTasks });
        }
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem('taskflow-tasks', JSON.stringify(state.tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [state.tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const moveTask = (taskId: string, newStage: string) => {
    dispatch({ type: 'MOVE_TASK', payload: { taskId, newStage } });
  };

  const reorderTasks = (startIndex: number, endIndex: number, stageId: string) => {
    dispatch({ type: 'REORDER_TASKS', payload: { startIndex, endIndex, stageId } });
  };

  const value: TaskContextType = {
    tasks: state.tasks,
    stages: state.stages,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};