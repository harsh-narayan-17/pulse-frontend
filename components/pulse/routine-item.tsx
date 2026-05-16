'use client';

import { motion } from 'framer-motion';
import { Clock, RefreshCw } from 'lucide-react';
import { RoutineItem as RoutineItemType } from '@/lib/types';

interface RoutineItemProps {
  item: RoutineItemType;
  onToggle: (id: string) => void;
}

const RECURRENCE_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekdays: 'Weekdays',
  weekly: 'Once a week',
  custom: 'Custom',
};

export function RoutineItemCard({ item, onToggle }: RoutineItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-accent/60 ${
        item.completed ? 'opacity-45' : ''
      }`}
    >
      {/* Custom checkbox */}
      <button
        onClick={() => onToggle(item.id)}
        className="relative flex h-5 w-5 shrink-0 items-center justify-center"
        aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        <div
          className={`h-[18px] w-[18px] rounded-full border-2 transition-all duration-200 ${
            item.completed
              ? 'border-foreground/40 bg-foreground/20'
              : 'border-border group-hover:border-foreground/40'
          }`}
        >
          {item.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="h-2 w-2 rounded-full bg-foreground/50" />
            </motion.div>
          )}
        </div>
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium leading-snug transition-all ${
            item.completed
              ? 'text-muted-foreground line-through decoration-muted-foreground/50'
              : 'text-foreground'
          }`}
        >
          {item.title}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
            <Clock className="h-2.5 w-2.5" />
            {item.time}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/50">
            <RefreshCw className="h-2.5 w-2.5" />
            {RECURRENCE_LABELS[item.recurrence]}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
