"use client";

import React, { useState } from 'react';
import NavBar from './NavBar';

export default function Home() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Task 1', description: 'Description for task 1', dueDate: '2024-09-01' },
    { id: 2, name: 'Task 2', description: 'Description for task 2', dueDate: '2024-09-02' }
  ]);

  const [newTask, setNewTask] = useState({ name: '', description: '', dueDate: '' });

  const handleAddTask = () => {
    setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
    setNewTask({ name: '', description: '', dueDate: '' });
  };

  return (
    <>
      <NavBar />
      <main className='px-5'>
        <h1 className='text-2xl font-bold mb-4'>Your Tasks</h1>
        <ul className='space-y-4'>
          {tasks.map(task => (
            <li key={task.id} className='border p-4 rounded-lg shadow'>
              <h2 className='text-lg font-semibold'>{task.name}</h2>
              <p>{task.description}</p>
              <p className='text-sm text-gray-500'>Due: {task.dueDate}</p>
            </li>
          ))}
        </ul>
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
          <button
            onClick={handleAddTask}
            className='bg-blue-500 text-white px-4 py-2 rounded'>
            Add Task
          </button>
        </div>
      </main>
    </>
  );
}

