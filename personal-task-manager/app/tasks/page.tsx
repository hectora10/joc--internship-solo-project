"use client";

import React, { useState } from 'react';
import { useTasks } from '../TasksContext';
import EditTaskForm from '../components/EditTaskForm';
import { Task } from '../types';


export default function TasksPage() {
    const { tasks, editTask, deleteTask, markComplete } = useTasks();
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
    };
  
    const handleSaveEdit = async (id: number, updatedTask: Omit<Task, 'id'>) => {
        if (editingTask) {
            const isoDueDate = new Date(updatedTask.dueDate).toISOString();
            await editTask(id, { ...updatedTask, dueDate: isoDueDate });
            setEditingTask(null);
        }    
    };

    return (
        <>
            <main className='px-5'>
                <h1 className='text-2xl font-bold mb-4'>All Tasks</h1>
                <ul className='space-y-4'>
                    {tasks.map(task => (
                        <li key={task.id} className='border p-4 rounded-lg shadow'>
                            <h2 className='text-lg font-semibold'>{task.name}</h2>
                            <p>{task.description}</p>
                            <p className='text-sm text-gray-500'>
                                Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                })}
                            </p>
                            {task.priority && (
                                <div>
                                    <span className='text-red-500 font-bold'>High Priority</span>
                                </div>
                            )}
                            <div>
                                <button
                                    onClick={() => handleEditTask(task)}
                                    className='bg-green-500 text-white text-sm px-2 py-1 rounded mr-2'>
                                    Edit Task
                                </button>
                                <button
                                    onClick ={() => deleteTask(task.id)} 
                                    className='bg-red-500 text-white text-sm px-2 py-1 rounded'>
                                    Delete Task
                                </button>
                            </div>
                            <div>
                                <input
                                    type='checkbox'
                                    checked={task.completed}
                                    onChange={() => markComplete(task.id)}
                                    className='mr-2'
                                />
                                <label>Complete</label>
                            </div>
                        </li>
                    ))}
                </ul>

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
