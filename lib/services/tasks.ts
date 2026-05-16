import { api } from '@/lib/api';
import { Task, Bucket } from '@/lib/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiTask(t: any): Task {
  return {
    id: t._id,
    title: t.title,
    bucket: t.bucket as Bucket,
    priority: 'medium', // backend doesn't store priority; default for display
    completed: t.completed,
  };
}

export const taskService = {
  fetchAll: async (): Promise<Task[]> => {
    const data = await api.get<{ tasks: unknown[] }>('/api/tasks');
    return data.tasks.map(mapApiTask);
  },

  create: async (task: Omit<Task, 'id' | 'completed'>): Promise<Task> => {
    const data = await api.post<{ task: unknown }>('/api/tasks', {
      title: task.title,
      bucket: task.bucket,
    });
    return mapApiTask(data.task);
  },

  toggle: (id: string, completed: boolean) =>
    api.patch(`/api/tasks/${id}`, { completed }),

  move: (id: string, bucket: Bucket) =>
    api.patch(`/api/tasks/${id}`, { bucket }),

  remove: (id: string) => api.delete(`/api/tasks/${id}`),
};
