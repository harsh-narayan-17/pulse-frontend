export type Recurrence = 'daily' | 'weekdays' | 'weekly' | 'custom';

export interface RoutineItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  recurrence: Recurrence;
  completed: boolean;
  days?: number[]; // 0=Sun, 1=Mon, ...6=Sat for custom
}

export type Priority = 'low' | 'medium' | 'high';
export type Bucket = 'today' | 'tomorrow' | 'someday';

export interface Task {
  id: string;
  title: string;
  description?: string;
  bucket: Bucket;
  priority: Priority;
  time?: string;
  completed: boolean;
}
