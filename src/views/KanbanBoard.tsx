import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Plus, MoreVertical, Target } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import TaskCard from '../components/Task/TaskCard';
import TaskModal from '../components/Task/TaskModal';
import { Task } from '../types';

const KanbanBoard: React.FC = () => {
  const { tasks, stages, moveTask, reorderTasks, addTask, updateTask, deleteTask } = useTaskContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [selectedStage, setSelectedStage] = useState<string>('todo');
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleDragStart = (start: any) => {
    setDraggedTask(start.draggableId);
  };

  const handleDragEnd = (result: DropResult) => {
    setDraggedTask(null);
    
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // If dropped in the same position, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      reorderTasks(source.index, destination.index, source.droppableId);
    } else {
      // Moving to a different column
      moveTask(draggableId, destination.droppableId);
    }
  };

  const handleAddTask = (stageId: string) => {
    setSelectedTask(undefined);
    setSelectedStage(stageId);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const getTasksByStage = (stageId: string) => {
    return tasks.filter(task => task.stage === stageId);
  };

  const getStageConfig = (stageId: string) => {
    const configs = {
      'todo': { 
        color: 'bg-slate-500', 
        lightColor: 'bg-slate-50 dark:bg-slate-900/20',
        borderColor: 'border-slate-200 dark:border-slate-700',
        hoverColor: 'hover:bg-slate-100 dark:hover:bg-slate-800'
      },
      'in-progress': { 
        color: 'bg-blue-500', 
        lightColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-700',
        hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-800'
      },
      'review': { 
        color: 'bg-amber-500', 
        lightColor: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-amber-200 dark:border-amber-700',
        hoverColor: 'hover:bg-amber-100 dark:hover:bg-amber-800'
      },
      'done': { 
        color: 'bg-emerald-500', 
        lightColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        borderColor: 'border-emerald-200 dark:border-emerald-700',
        hoverColor: 'hover:bg-emerald-100 dark:hover:bg-emerald-800'
      }
    };
    return configs[stageId as keyof typeof configs] || configs.todo;
  };

  return (
    <div className="h-full p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Kanban Board
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Drag and drop tasks to organize your workflow seamlessly
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tasks: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{tasks.length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {stages.map((stage) => {
            const stageTasks = getTasksByStage(stage.id);
            const stageConfig = getStageConfig(stage.id);
            const isDraggedOver = draggedTask !== null;
            
            return (
              <div key={stage.id} className="flex flex-col h-full">
                {/* Column Header */}
                <div className={`flex items-center justify-between mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 ${stageConfig.borderColor} transition-all duration-200`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${stageConfig.color} shadow-sm`} />
                    <h2 className="font-bold text-gray-900 dark:text-white text-lg">{stage.title}</h2>
                    <div className={`${stageConfig.lightColor} text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full font-semibold border ${stageConfig.borderColor}`}>
                      {stageTasks.length}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddTask(stage.id)}
                    className={`p-2 ${stageConfig.hoverColor} rounded-lg transition-all duration-200 group`}
                    title={`Add task to ${stage.title}`}
                  >
                    <Plus className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                  </button>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={stage.id} type="TASK">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-4 rounded-xl transition-all duration-300 ease-in-out ${
                        snapshot.isDraggingOver
                          ? `${stageConfig.lightColor} border-2 border-dashed ${stageConfig.borderColor} shadow-lg scale-[1.02]`
                          : isDraggedOver
                          ? `bg-gray-50 dark:bg-gray-800/30 border-2 border-dashed border-gray-300 dark:border-gray-600`
                          : 'bg-gray-50/50 dark:bg-gray-800/20 border-2 border-transparent'
                      }`}
                      style={{ minHeight: '400px' }}
                    >
                      {/* Drop Zone Indicator */}
                      {snapshot.isDraggingOver && (
                        <div className={`flex items-center justify-center p-4 mb-4 rounded-lg ${stageConfig.lightColor} border-2 border-dashed ${stageConfig.borderColor} animate-pulse`}>
                          <Target className={`w-6 h-6 ${stageConfig.color.replace('bg-', 'text-')} mr-2`} />
                          <span className={`font-medium ${stageConfig.color.replace('bg-', 'text-')}`}>
                            Drop task here
                          </span>
                        </div>
                      )}

                      {/* Tasks */}
                      <div className="space-y-4">
                        {stageTasks.map((task, index) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            index={index}
                            onEdit={handleEditTask}
                            onDelete={deleteTask}
                          />
                        ))}
                      </div>

                      {/* Empty State */}
                      {stageTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                          <div className={`w-16 h-16 rounded-full ${stageConfig.lightColor} flex items-center justify-center mb-4`}>
                            <Target className={`w-8 h-8 ${stageConfig.color.replace('bg-', 'text-')}`} />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
                            No tasks in {stage.title.toLowerCase()}
                          </p>
                          <button
                            onClick={() => handleAddTask(stage.id)}
                            className={`text-sm ${stageConfig.color.replace('bg-', 'text-')} ${stageConfig.hoverColor} px-4 py-2 rounded-lg transition-colors font-medium`}
                          >
                            Add your first task
                          </button>
                        </div>
                      )}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        defaultStage={selectedStage}
      />
    </div>
  );
};

export default KanbanBoard;