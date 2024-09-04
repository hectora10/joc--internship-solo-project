"use client";

import React, { useState } from 'react';
import { useTasks } from '../TasksContext';
import EditTaskForm from '../components/EditTaskForm';
import { Task } from '../types';
import TasksList from '../components/TasksList';
import { useTaskHandlers } from '../useTaskHandlers';


export default function TasksPage() {
    const { tasks, deleteTask, markComplete } = useTasks();
    const { editingTask, handleEditTask, handleSaveEdit, setEditingTask } = useTaskHandlers();

    return (
        <>
            <main className='px-5'>
                <h1 className='text-2xl font-bold mb-4'>All Tasks</h1>

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
