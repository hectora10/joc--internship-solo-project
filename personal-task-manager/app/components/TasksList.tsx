import React from 'react';
import { Task } from '../types';

interface TasksListProps {
  tasks: Task[];
  handleEditTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  markComplete: (id: number) => void;
}

const TasksList: React.FC<TasksListProps> = ({ tasks, handleEditTask, deleteTask, markComplete }) => {
  return (
    <ul className='space-y-4'>
      {tasks.map(task => (
        <li key={task.id} className={`border p-4 rounded-lg shadow ${task.priority ? 'bg-yellow-100' : ''}`}>
          <div>
            <h2 className='text-lg font-semibold'>{task.name}</h2>
            <p>{task.description}</p>
            <p className='text-sm text-gray-500'>
              Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })}
            </p>
            {task.priority && (
              <div>
                <span className='text-red-500 font-bold'>High Priority</span>
              </div>
            )}
            <div>
              <button onClick={() => handleEditTask(task)} className='bg-green-500 text-white px-2 py-1 text-sm rounded mr-2'>
                Edit Task
              </button>
              <button onClick={() => deleteTask(task.id)} className='bg-red-500 text-white px-2 py-1 text-sm rounded'>
                Delete Task
              </button>
            </div>
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
  );
};

export default TasksList;
