import { useState } from 'react';
import { Task } from './types';
import { useTasks } from './TasksContext';

export const useTaskHandlers = () => {
  const { editTask, tasks, setTasks } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = async (id: number, updatedTask: Partial<Omit<Task, 'id'>>) => {
    if (editingTask) {
        const taskToSave = {
            name: updatedTask.name ?? editingTask.name,
            description: updatedTask.description ?? editingTask.description,
            priority: updatedTask.priority ?? editingTask.priority,
            completed: updatedTask.completed ?? editingTask.completed,
            dueDate: new Date(updatedTask.dueDate ?? editingTask.dueDate).toISOString(),
          };



//        const isoDueDate = new Date(updatedTask.dueDate ?? editingTask.dueDate).toISOString();
        try{
            await editTask(id, taskToSave);

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === id ? { ...task, ...taskToSave } : task
                )
            );

            setEditingTask(null);
        } catch (error) {
            console.error('Error saving edit:', error);
        }
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return { editingTask, handleEditTask, handleSaveEdit, handleCancelEdit, setEditingTask };
};
