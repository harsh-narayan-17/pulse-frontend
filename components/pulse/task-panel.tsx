'use client';

import { useState, useRef } from 'react';
import { SquareCheck as CheckSquare2, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Task, Bucket, Priority } from '@/lib/types';
import { TaskItemCard } from './task-item';

interface TaskPanelProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onAdd: (task: Omit<Task, 'id' | 'completed'>) => void;
}

const BUCKETS: { value: Bucket; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'someday', label: 'Someday' },
];

export function TaskPanel({ tasks, onToggle, onAdd }: TaskPanelProps) {
  const [activeBucket, setActiveBucket] = useState<Bucket>('today');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = tasks.filter(t => t.bucket === activeBucket);
  const pending = filtered.filter(t => !t.completed);
  const completed = filtered.filter(t => t.completed);

  const handleAdd = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const title = inputValue.trim();
    if (!title) return;
    onAdd({ title, bucket: activeBucket, priority: 'medium' });
    setInputValue('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Panel header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <CheckSquare2 className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Tasks</h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {pending.length} remaining
        </span>
      </div>

      {/* Bucket tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-muted p-1">
        {BUCKETS.map(bucket => {
          const count = tasks.filter(t => t.bucket === bucket.value && !t.completed).length;
          return (
            <button
              key={bucket.value}
              onClick={() => setActiveBucket(bucket.value)}
              className={`relative flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeBucket === bucket.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {bucket.label}
              {count > 0 && (
                <span
                  className={`ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums ${
                    activeBucket === bucket.value
                      ? 'bg-foreground text-background'
                      : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick-add input */}
      <form onSubmit={handleAdd} className="mb-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 transition-colors focus-within:border-foreground/30">
          <Plus className="h-4 w-4 shrink-0 text-muted-foreground/50" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a task…"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd(e);
              if (e.key === 'Escape') setInputValue('');
            }}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
          />
          {inputValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              type="submit"
              className="rounded-md bg-foreground px-2 py-0.5 text-[10px] font-medium text-background"
            >
              Add
            </motion.button>
          )}
        </div>
      </form>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide -mx-1 px-1">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <BucketEmptyState bucket={activeBucket} />
          ) : (
            <>
              {pending.map(task => (
                <TaskItemCard key={task.id} task={task} onToggle={onToggle} />
              ))}

              {completed.length > 0 && pending.length > 0 && (
                <motion.div
                  key="divider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="my-2 flex items-center gap-2"
                >
                  <div className="h-px flex-1 bg-border/60" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
                    Completed
                  </span>
                  <div className="h-px flex-1 bg-border/60" />
                </motion.div>
              )}

              {completed.map(task => (
                <TaskItemCard key={task.id} task={task} onToggle={onToggle} />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BucketEmptyState({ bucket }: { bucket: Bucket }) {
  const messages: Record<Bucket, { title: string; sub: string }> = {
    today: { title: 'All clear for today', sub: 'Add something you want to get done.' },
    tomorrow: { title: 'Tomorrow looks free', sub: 'Plan ahead and add tasks for tomorrow.' },
    someday: { title: 'Dream big', sub: 'Capture ideas and goals for the future.' },
  };
  const msg = messages[bucket];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      key={`empty-${bucket}`}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
        <CheckSquare2 className="h-5 w-5 text-muted-foreground/60" />
      </div>
      <p className="text-sm font-medium text-foreground">{msg.title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{msg.sub}</p>
    </motion.div>
  );
}
