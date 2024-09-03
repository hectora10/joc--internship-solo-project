"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  priority: boolean;
}

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (id: number) => Promise<void>;
  editTask: (id: number, updatedTask: Omit<Task, 'id'>) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

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


    const addTask = async (newTask: Omit<Task, 'id'>) => {
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
    };


    const deleteTask = async (id: number) => {
        const response = await fetch('/api/tasks', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            console.error('Error deleting task:', response.status, await response.text());
            return;
        }

        setTasks((prevTasks) => prevTasks.filter(task => task.id !==id));
    };

    const editTask = async (id: number, updatedTask: Omit<Task, 'id'>) => {
        console.log('Updating Task:', id, updatedTask); // Log the task ID and updated task data
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
        console.log('Task from server:', task); // Log the updated task returned from the server
        setTasks((prevTasks) => prevTasks.map(t => (t.id === id ? task : t)));
    };

  return (
    <TasksContext.Provider value={{ tasks, addTask, deleteTask, editTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
