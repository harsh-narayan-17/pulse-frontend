import { api } from '@/lib/api';
import { RoutineItem, Recurrence } from '@/lib/types';

// Day name arrays for index ↔ string conversion
const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// "07:30" → "7:30 AM"
function toAmPm(hhmm: string): string {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

// "7:30 AM" → "07:30"
function toHHMM(display: string): string {
  if (!display) return '';
  const parts = display.trim().split(' ');
  if (parts.length === 1) return display; // already HH:MM
  const [time, ampm] = parts;
  const [h, m] = time.split(':').map(Number);
  const hour24 = ampm === 'PM' ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
  return `${String(hour24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiRoutine(r: any): RoutineItem {
  return {
    id: r._id,
    title: r.title,
    time: r.time ? toAmPm(r.time) : '',
    recurrence: (r.recurrenceType === 'custom_days' ? 'custom' : r.recurrenceType) as Recurrence,
    completed: r.completedToday ?? r.completed ?? false,
    days: r.selectedDays?.length
      ? r.selectedDays.map((d: string) => DAY_NAMES.indexOf(d)).filter((i: number) => i !== -1)
      : undefined,
  };
}

function mapRoutineToApi(r: Omit<RoutineItem, 'id' | 'completed'>) {
  return {
    title: r.title,
    time: r.time ? toHHMM(r.time) : undefined,
    recurrenceType: r.recurrence === 'custom' ? 'custom_days' : r.recurrence,
    selectedDays: r.days?.map(i => DAY_NAMES[i]).filter(Boolean) ?? [],
  };
}

export const routineService = {
  fetchToday: async (): Promise<RoutineItem[]> => {
    const data = await api.get<{ routines: unknown[] }>('/api/routines/today');
    return data.routines.map(mapApiRoutine);
  },

  create: async (routine: Omit<RoutineItem, 'id' | 'completed'>): Promise<RoutineItem> => {
    const data = await api.post<{ routine: unknown }>('/api/routines', mapRoutineToApi(routine));
    return mapApiRoutine(data.routine);
  },

  complete: (id: string, completed: boolean, date?: string) =>
    api.post(`/api/routines/${id}/complete`, { completed, date }),

  remove: (id: string) => api.delete(`/api/routines/${id}`),
};
