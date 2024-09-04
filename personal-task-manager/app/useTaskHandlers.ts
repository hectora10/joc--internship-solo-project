import { useState } from 'react';
import { Task } from './types';
import { useTasks } from './TasksContext';

export const useTaskHandlers = () => {
  const { editTask, tasks, setTasks } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = async (id: number, updatedTask: Omit<Task, 'id'>) => {
    if (editingTask) {
        const isoDueDate = new Date(updatedTask.dueDate).toISOString();
        try{
            const updatedTaskResponse = await editTask(id, { ...updatedTask, dueDate: isoDueDate });
        
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === id ? { ...task, ...updatedTask, dueDate: isoDueDate } : task
                )
            );

            setEditingTask(null);
        } catch (error) {
            console.error('Error saving edit:', error);
        }
    }
  };

  return { editingTask, handleEditTask, handleSaveEdit, setEditingTask };
};
