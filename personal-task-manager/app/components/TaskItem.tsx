import React from 'react';
import { Task } from '../types';
import { useTasks } from '../TasksContext';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { markComplete } = useTasks();

  const handleCheckboxChange = () => {
    markComplete(task.id);
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleCheckboxChange}
      />
      <span>{task.name}</span>
      <p>{task.description}</p>
      <p>{task.dueDate}</p>
    </div>
  );
};

export default TaskItem;
