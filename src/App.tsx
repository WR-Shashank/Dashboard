import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import Layout from './components/Layout/Layout';
import KanbanBoard from './views/KanbanBoard';
import Calendar from './views/Calendar';
import Dashboard from './views/Dashboard';
import TaskTable from './views/TaskTable';

function App() {
  return (
    <TaskProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<KanbanBoard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tasks" element={<TaskTable />} />
          </Route>
        </Routes>
      </Router>
    </TaskProvider>
  );
}

export default App;