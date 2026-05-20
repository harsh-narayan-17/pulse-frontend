import { RoutineItem, Task } from './types';

export const initialRoutines: RoutineItem[] = [
  { id: 'r1', title: 'Wake up', time: '7:00 AM', recurrence: 'daily', completed: true },
  { id: 'r2', title: 'Eat banana', time: '7:15 AM', recurrence: 'daily', completed: true },
  { id: 'r3', title: 'Running', time: '7:30 AM', recurrence: 'weekdays', completed: false },
  { id: 'r4', title: 'Office', time: '10:00 AM', recurrence: 'weekdays', completed: false },
  { id: 'r5', title: 'Lunch break', time: '1:00 PM', recurrence: 'weekdays', completed: false },
  { id: 'r6', title: 'Evening walk', time: '6:30 PM', recurrence: 'daily', completed: false },
  { id: 'r7', title: 'Dinner', time: '8:00 PM', recurrence: 'daily', completed: false },
  { id: 'r8', title: 'Read', time: '9:30 PM', recurrence: 'daily', completed: false },
];

export const initialTasks: Task[] = [
  { id: 't1', title: 'Buy shampoo', bucket: 'today', priority: 'low', completed: false, order: 1000 },
  { id: 't2', title: 'Call friend', bucket: 'today', priority: 'high', time: '5:00 PM', completed: false, order: 2000 },
  { id: 't3', title: 'Finish reading book', bucket: 'today', priority: 'medium', completed: false, order: 3000 },
  { id: 't4', title: 'Reply to emails', bucket: 'today', priority: 'high', time: '11:00 AM', completed: true, order: 4000 },
  { id: 't5', title: 'Grocery shopping', bucket: 'tomorrow', priority: 'medium', time: '10:00 AM', completed: false, order: 1000 },
  { id: 't6', title: 'Dentist appointment', bucket: 'tomorrow', priority: 'high', time: '3:00 PM', completed: false, order: 2000 },
  { id: 't7', title: 'Review project proposal', bucket: 'tomorrow', priority: 'high', completed: false, order: 3000 },
  { id: 't8', title: 'Learn guitar', bucket: 'someday', priority: 'low', completed: false, order: 1000 },
  { id: 't9', title: 'Goa trip', bucket: 'someday', priority: 'medium', completed: false, order: 2000 },
  { id: 't10', title: 'Build a side project', bucket: 'someday', priority: 'medium', completed: false, order: 3000 },
  { id: 't11', title: 'Read Atomic Habits', bucket: 'someday', priority: 'low', completed: false, order: 4000 },
];
