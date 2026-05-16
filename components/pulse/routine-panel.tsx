'use client';

import { useState } from 'react';
import { Plus, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { RoutineItem } from '@/lib/types';
import { RoutineItemCard } from './routine-item';
import { AddRoutineModal } from './add-routine-modal';

interface RoutinePanelProps {
  routines: RoutineItem[];
  onToggle: (id: string) => void;
  onAdd: (routine: Omit<RoutineItem, 'id' | 'completed'>) => void;
}

export function RoutinePanel({ routines, onToggle, onAdd }: RoutinePanelProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const pending = routines.filter(r => !r.completed);
  const completed = routines.filter(r => r.completed);
  const total = routines.length;
  const doneCount = completed.length;

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Panel header */}
        <div className="flex items-center justify-between pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Routine
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {doneCount} of {total} done
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:bg-accent hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto scrollbar-hide -mx-1 px-1">
          {routines.length === 0 ? (
            <EmptyState onAdd={() => setModalOpen(true)} />
          ) : (
            <AnimatePresence initial={false}>
              {/* Pending */}
              {pending.map(item => (
                <RoutineItemCard key={item.id} item={item} onToggle={onToggle} />
              ))}

              {/* Divider */}
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

              {/* Completed */}
              {completed.map(item => (
                <RoutineItemCard key={item.id} item={item} onToggle={onToggle} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <AddRoutineModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={onAdd}
      />
    </>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
        <Zap className="h-5 w-5 text-muted-foreground/60" />
      </div>
      <p className="text-sm font-medium text-foreground">No routines yet</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Build habits that stick, one routine at a time.
      </p>
      <button
        onClick={onAdd}
        className="mt-4 rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
      >
        + Add your first routine
      </button>
    </motion.div>
  );
}
