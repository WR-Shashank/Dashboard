import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task, Priority } from '../../types';
import { Calendar, Clock, MoreHorizontal, Trash2, Edit3, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityConfig = {
  high: { 
    color: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800', 
    emoji: '🔴', 
    label: 'High',
    accent: 'border-l-red-500'
  },
  medium: { 
    color: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800', 
    emoji: '🟠', 
    label: 'Medium',
    accent: 'border-l-orange-500'
  },
  low: { 
    color: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800', 
    emoji: '🟢', 
    label: 'Low',
    accent: 'border-l-green-500'
  },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEdit, onDelete }) => {
  const priority = priorityConfig[task.priority as Priority];
  const isOverdue = task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), 'day') && task.stage !== 'done';

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 ${priority.accent} border-r border-t border-b border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing ${
            snapshot.isDragging 
              ? 'rotate-2 scale-105 shadow-2xl ring-2 ring-indigo-500 ring-opacity-50 z-50' 
              : 'hover:scale-[1.02] hover:-translate-y-1'
          }`}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform} rotate(2deg)` 
              : provided.draggableProps.style?.transform,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                title="Edit task"
              >
                <Edit3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${priority.color}`}>
                <span className="mr-1.5">{priority.emoji}</span>
                {priority.label}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {isOverdue && (
                <div className="flex items-center space-x-1 text-red-600 dark:text-red-400" title="Overdue">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              
              {task.dueDate && (
                <div className={`flex items-center space-x-1.5 text-xs font-medium px-2 py-1 rounded-md ${
                  isOverdue 
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' 
                    : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
                }`}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{dayjs(task.dueDate).format('MMM D')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Drag Indicator */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-30 transition-opacity">
            <div className="flex flex-col space-y-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;