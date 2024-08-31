"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: string;
}

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const addTask = (newTask: Omit<Task, 'id'>) => {
        setTasks([...tasks, { ...newTask, id: tasks.length +1 }]);
    };
  
//  const [tasks, setTasks] = useState<Task[]>([
//    { id: 1, name: 'Task 1', description: 'Description for task 1', dueDate: '2024-09-01' },
//    { id: 2, name: 'Task 2', description: 'Description for task 2', dueDate: '2024-09-02' }
//  ]);

  return (
    <TasksContext.Provider value={{ tasks, addTask }}>
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
