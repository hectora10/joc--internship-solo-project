"use client";

import React, { useState } from 'react';
import { useTasks } from './TasksContext';
import EditTaskForm from './components/EditTaskForm';
import { Task } from './types';
import TasksList from './components/TasksList';
import { useTaskHandlers } from './useTaskHandlers';


const Home: React.FC = () => {
  const { tasks, addTask, deleteTask, markComplete } = useTasks();
  const { editingTask, handleEditTask, handleSaveEdit, setEditingTask } = useTaskHandlers();
  const [newTask, setNewTask] = useState({ name: '', description:'', dueDate: '', priority: false, completed: false });

  const handleAddTask = () => {
    if (!newTask.name.trim() || !newTask.dueDate.trim()) {
      alert("Please fill in the task name and due date.");
      return;
    }
    addTask(newTask);
    setNewTask({ name: '', description:'', dueDate: '', priority: false, completed: false });
  };

  return (
    <>
      <main className='px-5'>
        <div className='mt-8'>
          <h2 className='text-xl font-semibold mb-2'>Add New Task</h2>
          <input
            type='text'
            placeholder='Task Name'
            className='border p-2 mb-2 w-full'
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <input
            type='text'
            placeholder='Description'
            className='border p-2 mb-2 w-full'
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <input
            type='date'
            className='border p-2 mb-4 w-full'
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
          <label className='block mb-4'>
            <input
              type='checkbox'
              className='mr-2'
              checked={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.checked })}
            />
            Mark as High Priority
          </label>
          <button
            onClick={handleAddTask}
            className='bg-blue-500 text-white px-4 py-2 rounded'>
            Add Task
          </button>
        </div>

        <h2 className='text-2xl font-bold mt-8 mb-4'>Your Tasks</h2>
        {tasks.length === 0 ? (
          <p className='text-gray-500'>No pending tasks</p>
        ) : (

          <TasksList
            tasks={tasks}
            handleEditTask={handleEditTask}
            deleteTask={deleteTask}
            markComplete={markComplete}
          />
        )}

        {editingTask && (
          <EditTaskForm 
            task={editingTask} 
            onSave={handleSaveEdit}
            onCancel={() => setEditingTask(null)}
          />
        )}

      </main>
    </>
  );
}

export default Home;