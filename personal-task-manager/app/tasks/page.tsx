"use client";

import React, { useState } from 'react';
import { useTasks } from '../TasksContext';
import EditTaskForm from '../components/EditTaskForm';
import { Task } from '../types';


export default function TasksPage() {
    const { tasks, editTask } = useTasks();
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
    };
  
    const handleSaveEdit = async (id: number, updatedTask: Omit<Task, 'id'>) => {
        if (editingTask) {
            const isoDueDate = new Date(updatedTask.dueDate).toISOString();
            console.log('Editing Task:', editingTask); // Log the task currently being edited
            console.log('Updated Task:', updatedTask); // Log the updated task data
            await editTask(id, { ...updatedTask, dueDate: isoDueDate });
            console.log('Task updated'); // Confirm that the editTask function was called
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
                            <p className='text-sm text-gray-500'>Due: {task.dueDate}</p>
                            {task.priority && <span className='text-red-500 font-bold'>High Priority</span>}
                            <button
                                onClick={() => handleEditTask(task)}
                                className='bg-green-500 text-white px-2 py-1 rounded mt-2'>
                                Edit Task
                            </button>
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
