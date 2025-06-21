import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import TaskModal from '../components/Task/TaskModal';
import { Task } from '../types';
import dayjs from 'dayjs';

const Calendar: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf('month');
  const startDate = firstDayOfMonth.startOf('week');
  
  const calendarDays = useMemo(() => {
    const days = [];
    let current = startDate;
    
    // Generate 6 weeks of days
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        days.push(current);
        current = current.add(1, 'day');
      }
    }
    
    return days;
  }, [startDate]);

  const getTasksForDate = (date: dayjs.Dayjs) => {
    const dateString = date.format('YYYY-MM-DD');
    return tasks.filter(task => task.dueDate === dateString);
  };

  const handleDateClick = (date: dayjs.Dayjs) => {
    const dateString = date.format('YYYY-MM-DD');
    setSelectedDate(dateString);
    setSelectedTask(undefined);
    setIsModalOpen(true);
  };

  const handleTaskClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const finalTaskData = {
      ...taskData,
      dueDate: selectedDate || taskData.dueDate,
    };

    if (selectedTask) {
      updateTask(selectedTask.id, finalTaskData);
    } else {
      addTask(finalTaskData);
    }
  };

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-orange-500',
    low: 'bg-green-500',
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => prev.add(direction === 'next' ? 1 : -1, 'month'));
  };

  return (
    <div className="h-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Calendar</h1>
            <p className="text-gray-600 dark:text-gray-400">Schedule and track your tasks by date</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
                {currentDate.format('MMMM YYYY')}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <button
              onClick={() => {
                setSelectedDate(dayjs().format('YYYY-MM-DD'));
                setSelectedTask(undefined);
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-4 text-center font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            const isCurrentMonth = date.month() === currentDate.month();
            const isToday = date.isSame(dayjs(), 'day');
            const dayTasks = getTasksForDate(date);
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={`min-h-[120px] p-3 border-b border-r border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  !isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday 
                    ? 'text-blue-600 dark:text-blue-400 font-bold' 
                    : isCurrentMonth 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-400 dark:text-gray-600'
                }`}>
                  {date.format('D')}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      onClick={(e) => handleTaskClick(task, e)}
                      className={`text-xs p-1.5 rounded text-white cursor-pointer hover:opacity-80 transition-opacity ${
                        priorityColors[task.priority]
                      }`}
                      title={task.title}
                    >
                      {task.title.length > 15 ? `${task.title.substring(0, 15)}...` : task.title}
                    </div>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-1.5">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        defaultStage="todo"
      />
    </div>
  );
};

export default Calendar;