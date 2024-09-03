"use client";

import React, { useState } from 'react';
import { useTasks } from './TasksContext';
import EditTaskForm from './components/EditTaskForm';
import { Task } from './types';

const Home: React.FC = () => {
  const { tasks, addTask, editTask } = useTasks();
  const [newTask, setNewTask] = useState({ name: '', description:'', dueDate: '', priority: false });
  const [editingTask, setEditingTask] = useState<Task | null>(null);


  const handleAddTask = () => {
    if (!newTask.name.trim() || !newTask.dueDate.trim()) {
      alert("Please fill in the task name and due date.");
      return;
    }
    addTask(newTask);
    setNewTask({ name: '', description:'', dueDate: '', priority: false });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = async (id: number, updatedTask: Omit<Task, 'id'>) => {
    if (editingTask) {
      await editTask(id, updatedTask);
      setEditingTask(null);
    }
  };

  return (
    <>
      <main className='px-5'>
        <h1 className='text-2xl font-bold mb-4'>Your Tasks</h1>
        {tasks.length === 0 ? (
          <p className='text-gray-500'>No pending tasks</p>
        ) : (
          <ul className='space-y-4'>
            {tasks.map(task => (
              <li key={task.id} className={`border p-4 rounded-lg shadow ${task.priority ? 'bg-yellow-100' : ''}`}>
                <h2 className='text-lg font-semibold'>{task.name}</h2>
                <p>{task.description}</p>
                <p className='text-sm text-gray-500'>Due: {task.dueDate}</p>
                {task.priority && <span className='text-red-500 font-bold'>High Priority</span>}
                <button onClick={() => handleEditTask(task)} className='bg-green-500 text-white px-2 py-1 rounded mt-2'>
                  Edit Task
                </button>
              </li>            
            ))}
          </ul>
        )}

        {editingTask && (
          <EditTaskForm 
            task={editingTask} 
            onSave={handleSaveEdit}
            onCancel={() => setEditingTask(null)}
          />
        )}

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
      </main>
    </>
  );
}

export default Home;