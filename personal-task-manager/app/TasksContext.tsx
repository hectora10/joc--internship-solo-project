"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Task } from './types';


interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (id: number) => Promise<void>;
  editTask: (id: number, updatedTask: Omit<Task, 'id'>) => Promise<Task>;
  markComplete: (id: number) => Promise<void>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  editingTask: Task | null;  
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
  sortOption: 'dueDate' | 'priority' | 'completed' | null;
  setSortOption: React.Dispatch<React.SetStateAction<'dueDate' | 'priority' | 'completed' | null>>;
  filterOption: 'highPriority' | 'completed' | 'category' | null;
  setFilterOption: React.Dispatch<React.SetStateAction<'highPriority' | 'completed' | 'category' | null>>; 
  handleEditTask: (task: Task) => void;
  handleSaveEdit: (id: number, updatedTask: Omit<Task, 'id'>) => Promise<void>;
  handleCancelEdit: () => void;
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
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [sortOption, setSortOption] = useState<'dueDate' | 'priority' | 'completed' | null>(null);
    const [filterOption, setFilterOption] = useState<'highPriority' | 'completed' | 'category' | null>(null);

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

    const sortTasks = (tasks: Task[]) => {
        if (sortOption === 'dueDate') {
            return [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        }
        if (sortOption === 'priority') {
            return [...tasks].sort((a, b) => (b.priority ? 1 : -1));
        }
        if (sortOption === 'completed') {
            return [...tasks].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
        }
        return tasks;
    };

    const filterTasks = (tasks: Task[]) => {
        if (filterOption === 'highPriority') {
            return tasks.filter(task => task.priority);
        }
        if (filterOption === 'completed') {
            return tasks.filter(task => task.completed);
        }
        return tasks;
    };

    const getProcessedTasks = () => {
        let processedTasks = [...tasks];
        processedTasks = filterTasks(processedTasks);
        processedTasks = sortTasks(processedTasks);
        return processedTasks;
    };

    const addTask = useCallback(async (newTask: Omit<Task, 'id'>) => {
        const { dueDate, ...rest } = newTask;

        const localDate = new Date(dueDate);
        const formattedDueDate = localDate.toISOString().split('T')[0];

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
    }, []);

    const editTask = useCallback(async (id: number, updatedTask: Omit<Task, 'id'>): Promise<Task> => {
        const response = await fetch('/api/tasks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updatedTask }),
        });

        if (!response.ok) {
            console.error('Error updating task:', response.status, await response.text());
            return Promise.reject('Failed to update task');
        }

        const task = await response.json();
        setTasks((prevTasks) => prevTasks.map((t) => (t.id === id ? task : t)));
        return task;
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

    const processedTasks = getProcessedTasks();

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
      };
      
      const handleSaveEdit = async (id: number, updatedTask: Omit<Task, 'id'>) => {
        await editTask(id, updatedTask);
        setEditingTask(null);
      };
      
      const handleCancelEdit = () => {
        setEditingTask(null);
      };

  return (
    <TasksContext.Provider value={{ 
        tasks: processedTasks, 
        addTask, 
        deleteTask, 
        editTask, 
        markComplete, 
        setTasks, 
        editingTask, 
        setEditingTask,
        sortOption,
        setSortOption,
        filterOption,
        setFilterOption,
        handleEditTask,    
        handleSaveEdit,    
        handleCancelEdit 
    }}>
      {children}
    </TasksContext.Provider>
  );
};

