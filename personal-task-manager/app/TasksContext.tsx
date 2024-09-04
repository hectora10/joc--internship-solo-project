"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Task } from './types';


interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (id: number) => Promise<void>;
  editTask: (id: number, updatedTask: Omit<Task, 'id'>) => Promise<void>;
  markComplete: (id: number) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const useTasks = () => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
}

export const TasksProvider = ({ children }: { children: ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('/api/tasks');
            if (!response.ok) {
                console.error('Error fetching tasks:', response.status, await response.text());
                return;
            }
            const data = await response.json();
            setTasks(data);
        };
        fetchTasks();
    }, []);


    const addTask = useCallback(async (newTask: Omit<Task, 'id'>) => {
        const { dueDate, ...rest } = newTask;
        const formattedDueDate = new Date(dueDate).toISOString(); 

        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...rest, dueDate: formattedDueDate }),
        }); 

        if (!response.ok) {
            const text = await response.text();
            console.error('Error adding task:', response.status, text);
            return;
        }

        const taskWithId = await response.json();
        setTasks((prevTasks) => [...prevTasks, taskWithId]);
    }, []);


    const deleteTask = useCallback(async (id: number) => {
        setTasks((prevTasks) => prevTasks.filter(task => task.id !==id));

        const response = await fetch('/api/tasks', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        
        if (!response.ok) {
            console.error('Error deleting task:', response.status, await response.text());
        }    
    }, [tasks]);

    const editTask = useCallback(async (id: number, updatedTask: Omit<Task, 'id'>) => {
        const response = await fetch('/api/tasks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updatedTask }),
        });

        if (!response.ok) {
            console.error('Error updating task:', response.status, await response.text());
            return;
        }

        const task = await response.json();
        setTasks((prevTasks) => prevTasks.map(t => (t.id === id ? task : t)));
    }, []);

    const markComplete = useCallback(async (id: number) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        const updatedCompletedStatus = !task.completed;

        setTasks((prevTasks) =>
            prevTasks.map((t) =>
                t.id === id ? { ...t, completed: updatedCompletedStatus } : t
            )
        );
        const response = await fetch('/api/tasks/complete', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, completed: updatedCompletedStatus }),
        });

        if (!response.ok) {
            console.error('Error marking task as complete:', response.status, await response.text());
        
            setTasks((prevTasks) =>
                prevTasks.map((t) =>
                    t.id === id ? { ...t, completed: task.completed } : t
                )
            );
        }
    }, [tasks]);

  return (
    <TasksContext.Provider value={{ tasks, addTask, deleteTask, editTask, markComplete }}>
      {children}
    </TasksContext.Provider>
  );
};

