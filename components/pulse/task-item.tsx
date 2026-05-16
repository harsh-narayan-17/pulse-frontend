'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Task, Priority } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  high: 'bg-rose-400/80 dark:bg-rose-500/70',
  medium: 'bg-amber-400/80 dark:bg-amber-500/70',
  low: 'bg-sky-400/70 dark:bg-sky-500/60',
};

export function TaskItemCard({ task, onToggle }: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: task.completed ? 0.45 : 1, x: 0 }}
      exit={{ opacity: 0, x: 4, transition: { duration: 0.15 } }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-accent/60"
    >
      {/* Custom checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="relative flex h-5 w-5 shrink-0 items-center justify-center"
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        <div
          className={`h-[17px] w-[17px] rounded-md border-2 transition-all duration-200 ${
            task.completed
              ? 'border-foreground/30 bg-foreground/15'
              : 'border-border group-hover:border-foreground/40'
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg
                viewBox="0 0 10 8"
                className="h-2.5 w-2.5 text-foreground/50"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 4l2.5 2.5L9 1" />
              </svg>
            </motion.div>
          )}
        </div>
      </button>

      {/* Priority dot */}
      <div
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_COLORS[task.priority]}`}
        title={`${task.priority} priority`}
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm leading-snug transition-all ${
            task.completed
              ? 'text-muted-foreground line-through decoration-muted-foreground/40'
              : 'font-medium text-foreground'
          }`}
        >
          {task.title}
        </p>
      </div>

      {/* Time */}
      {task.time && (
        <span className="ml-auto flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground/60">
          <Clock className="h-2.5 w-2.5" />
          {task.time}
        </span>
      )}
    </motion.div>
  );
}
