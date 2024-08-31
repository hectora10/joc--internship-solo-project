"use client";

import React, { useState } from 'react';
import { useTasks } from '../TasksContext';

export default function TasksPage() {
    const { tasks } = useTasks();
  
//  const [tasks, setTasks] = useState([
//    { id: 1, name: 'Task 1', description: 'Description for task 1', dueDate: '2024-09-01' },
//    { id: 2, name: 'Task 2', description: 'Description for task 2', dueDate: '2024-09-02' }
//  ]);

  return (
    <>
      <main className='px-5'>
        <h1 className='text-2xl font-bold mb-4'>All Tasks</h1>
        <ul className='space-y-4'>
          {tasks.map(task => (
            <li key={task.id} className='border p-4 rounded-lg shadow'>
              <h2 className='text-lg font-semibold'>{task.name}</h2>
              <p>{task.description}</p>
              <p className='text-sm text-gray-500'>Due: {task.dueDate}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
