import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useTaskContext } from '../context/TaskContext';
import { TrendingUp, Users, Calendar, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { tasks, stages } = useTaskContext();

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.stage === 'done').length;
    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.stage !== 'done';
    }).length;
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

    return { totalTasks, completedTasks, overdueTasks, highPriorityTasks };
  }, [tasks]);

  const stageData = useMemo(() => {
    return stages.map(stage => ({
      name: stage.title,
      count: tasks.filter(task => task.stage === stage.id).length,
      color: stage.id === 'todo' ? '#94a3b8' :
             stage.id === 'in-progress' ? '#3b82f6' :
             stage.id === 'review' ? '#eab308' : '#10b981'
    }));
  }, [tasks, stages]);

  const priorityData = useMemo(() => {
    const priorityCounts = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'High Priority', value: priorityCounts.high || 0, color: '#ef4444' },
      { name: 'Medium Priority', value: priorityCounts.medium || 0, color: '#f97316' },
      { name: 'Low Priority', value: priorityCounts.low || 0, color: '#22c55e' },
    ].filter(item => item.value > 0);
  }, [tasks]);

  const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number; color: string; subtitle?: string }> = ({ 
    icon, title, value, color, subtitle 
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of your task management and productivity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          title="Total Tasks"
          value={stats.totalTasks}
          color="bg-blue-500"
          subtitle="All tasks in system"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          title="Completed"
          value={stats.completedTasks}
          color="bg-green-500"
          subtitle={`${stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% completion rate`}
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-white" />}
          title="Overdue"
          value={stats.overdueTasks}
          color="bg-red-500"
          subtitle="Need immediate attention"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-white" />}
          title="High Priority"
          value={stats.highPriorityTasks}
          color="bg-orange-500"
          subtitle="Critical tasks"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tasks per Stage Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tasks per Stage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Priority Distribution</h3>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              No tasks to display
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Tasks</h3>
        <div className="space-y-3">
          {tasks
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5)
            .map((task) => {
              const priorityEmoji = task.priority === 'high' ? '🔴' : 
                                 task.priority === 'medium' ? '🟠' : '🟢';
              
              return (
                <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{priorityEmoji}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stages.find(s => s.id === task.stage)?.title || task.stage}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;