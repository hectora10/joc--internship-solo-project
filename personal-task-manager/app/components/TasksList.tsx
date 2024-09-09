import React, { useContext } from 'react';
import EditTaskForm from './EditTaskForm';
import { useTasks } from '../TasksContext';
import { Task } from '../types';


const formatLocalDate = (isoDate: string) => {
  const localDate = new Date(isoDate);
  return localDate.toISOString().split('T')[0];
};

interface TasksListProps {
  tasks : Task []
  showSortAndFilter?: boolean; 
}

const TasksList: React.FC<TasksListProps> = ({ tasks, showSortAndFilter = false }) => { 
  const { 
    handleEditTask, 
    deleteTask, 
    markComplete,
    editingTask,
    handleSaveEdit,
    handleCancelEdit,
    setSortOption, 
    setFilterOption
  } = useTasks(); 

  return (
    <div>
      {showSortAndFilter && ( 
        <>
          <div className='mb-4'>
            <label htmlFor='sort' className='mr-2'>Sort by:</label>
            <select
              id='sort'
              onChange={(e) => setSortOption(e.target.value as 'dueDate' | 'priority' | 'completed')}
              className='p-2 border rounded'
            >
              <option value=''>None</option>
              <option value='dueDate'>Due Date</option>
              <option value='priority'>Priority</option>
              <option value='completed'>Completion</option>
            </select>
          </div>

          <div className='mb-4'>
            <label htmlFor='filter' className='mr-2'>Filter by:</label>
            <select
              id='filter'
              onChange={(e) => setFilterOption(e.target.value as 'highPriority' | 'completed' | 'category')}
              className='p-2 border rounded'
            >
              <option value=''>None</option>
              <option value='highPriority'>High Priority</option>
              <option value='completed'>Completed</option>
            </select>
          </div>
        </>
      )}

      <ul className='space-y-4'>
        {tasks.map(task => (
          <li key={task.id} className={`border p-4 rounded-lg shadow ${task.priority ? 'bg-yellow-100' : ''}`}>
            <div>
              <h2 className='text-lg font-semibold'>{task.name}</h2>
              <p>{task.description}</p>
              <p className='text-sm text-gray-500'>
                Due: {formatLocalDate(task.dueDate)}
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

            {editingTask && editingTask.id === task.id && (
              <EditTaskForm
                task={editingTask}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            )}
          </li>            
        ))}
      </ul>
    </div>
  );
};

export default TasksList;
