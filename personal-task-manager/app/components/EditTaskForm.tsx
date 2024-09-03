import React, { useState } from 'react';
import { Task } from '../types';

interface EditTaskProps {
  task: Task;
  onSave: (id: number, updatedTask: Omit<Task, 'id'>) => void;
  onCancel: () => void;
}

const EditTaskForm: React.FC<EditTaskProps> = ({ task, onSave, onCancel }) => {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [priority, setPriority] = useState(task.priority);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting edit with data:', { name, description, dueDate, priority });
    onSave(task.id, { name, description, dueDate, priority });
  };

  return (
    <div className='border p-4 rounded-lg shadow mt-4 bg-white'>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <input
            type="text"
            id='taskName'
            name='taskName'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Task Name"
            className='border p-2 w-full rounded'
          />
        </div>
        <div className='mb-4'>
            <label htmlFor="taskDescription">Description</label>
  
            <textarea
                id='taskDescription'
                name='taskDescription'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className='border p-2 w-full rounded'
            />
        </div>
        <div className='mb-4'>
            <label htmlFor="taskDueDate">Due Date</label>

            <input
                type="date"
                id='taskDueDate'
                name='taskDueDate'
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className='border p-2 w-full rounded'
            />
        </div>
        <div className='flex items-center mb-4'>
          <input
            type="checkbox"
            id='taskPriority'
            name='taskPriority'
            checked={priority}
            onChange={(e) => setPriority(e.target.checked)}
            className='mr-2'
          />
          <label htmlFor='taskPriority'>High Priority</label>
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className='bg-green-500 text-white px-4 py-2 rounded'
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className='bg-gray-500 text-white px-4 py-2 rounded'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskForm;
