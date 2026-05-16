'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/pulse/navbar';
import { RoutinePanel } from '@/components/pulse/routine-panel';
import { TaskPanel } from '@/components/pulse/task-panel';
import { RoutineItem, Task } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { routineService } from '@/lib/services/routines';
import { taskService } from '@/lib/services/tasks';

export default function PulsePage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !token) router.replace('/login');
  }, [token, isLoading, router]);

  // Fetch initial data once authenticated
  const loadData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [fetchedRoutines, fetchedTasks] = await Promise.all([
        routineService.fetchToday(),
        taskService.fetchAll(),
      ]);
      setRoutines(fetchedRoutines);
      setTasks(fetchedTasks);
    } catch {
      // token may have expired — send back to login
      router.replace('/login');
    } finally {
      setDataLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (token) loadData();
  }, [token, loadData]);

  const progress = useMemo(() => {
    const total = routines.length + tasks.filter(t => t.bucket === 'today').length;
    const done =
      routines.filter(r => r.completed).length +
      tasks.filter(t => t.bucket === 'today' && t.completed).length;
    return total === 0 ? 0 : (done / total) * 100;
  }, [routines, tasks]);

  const toggleRoutine = async (id: string) => {
    const routine = routines.find(r => r.id === id);
    if (!routine) return;
    const next = !routine.completed;
    // Optimistic update
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, completed: next } : r));
    try {
      await routineService.complete(id, next);
    } catch {
      // Rollback on failure
      setRoutines(prev => prev.map(r => r.id === id ? { ...r, completed: !next } : r));
    }
  };

  const addRoutine = async (data: Omit<RoutineItem, 'id' | 'completed'>) => {
    try {
      const created = await routineService.create(data);
      // Only show in today's list if it matches today's schedule
      // Re-fetch to let the server decide what appears today
      const updated = await routineService.fetchToday();
      setRoutines(updated);
      // If the new routine wasn't scheduled for today, still add it to local state
      // so the user sees the create succeeded (it will vanish on next full load if not today)
      const appearsToday = updated.some(r => r.id === created.id);
      if (!appearsToday) {
        setRoutines(prev => [...prev, { ...created, completed: false }]);
      }
    } catch (err) {
      console.error('Failed to create routine:', err);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const next = !task.completed;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: next } : t));
    try {
      await taskService.toggle(id, next);
    } catch {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !next } : t));
    }
  };

  const addTask = async (data: Omit<Task, 'id' | 'completed'>) => {
    try {
      const created = await taskService.create(data);
      setTasks(prev => [...prev, created]);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  // Show nothing while auth hydrates
  if (isLoading || (!token && !isLoading)) return null;

  if (dataLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
          <p className="text-xs text-muted-foreground">Loading your day…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Navbar progress={progress} />

      <main className="flex flex-1 overflow-hidden">
        <div className="mx-auto flex w-full max-w-screen-xl flex-1 overflow-hidden">
          {/* Left panel — 40% */}
          <section className="flex w-full flex-shrink-0 flex-col overflow-hidden border-r border-border/60 p-6 md:w-2/5">
            <RoutinePanel
              routines={routines}
              onToggle={toggleRoutine}
              onAdd={addRoutine}
            />
          </section>

          {/* Right panel — 60% */}
          <section className="flex flex-1 flex-col overflow-hidden p-6">
            <TaskPanel
              tasks={tasks}
              onToggle={toggleTask}
              onAdd={addTask}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
