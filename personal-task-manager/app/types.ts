export interface Task {
    id: number;
    name: string;
    description: string;
    dueDate: string;
    priority: boolean;
    completed: boolean;
    category?: string;
  }
  