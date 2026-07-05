"use client";

import { X } from "lucide-react";
import type { SetEntry } from "@/types/workout";

type ExerciseHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  history: { date: string; sets: SetEntry[] }[];
};

function formatWorkoutDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatSet(set: SetEntry) {
  const weightType = set.weightType ?? "weight";
  const rirLabel = set.rir === undefined ? "" : `, RIR ${set.rir}`;

  if (weightType === "bodyweight") {
    return `BW x ${set.reps}${rirLabel}`;
  }

  if (weightType === "band") {
    return `${set.band ?? "Band"} x ${set.reps}${rirLabel}`;
  }

  if (weightType === "assistance" && set.weight > 0) {
    return `-${set.weight} x ${set.reps}${rirLabel}`;
  }

  let weightLabel = `${set.weight}`;
  if (set.includesBarWeight === true) {
    weightLabel = `${set.weight} (inc. bar)`;
  } else if (set.includesBarWeight === false) {
    if (set.barWeight && set.barWeight > 0) {
      weightLabel = `${set.weight} (+${set.barWeight} bar)`;
    } else {
      weightLabel = `${set.weight} (excl. bar)`;
    }
  }

  return `${weightLabel} lbs x ${set.reps}${rirLabel}`;
}

export function ExerciseHistoryModal({
  isOpen,
  onClose,
  exerciseName,
  history,
}: ExerciseHistoryModalProps) {
  if (!isOpen) {
    return null;
  }

  // Filter history to workouts that have at least one set
  const filteredHistory = history.filter((h) => h.sets.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <div className="relative z-10 flex max-h-[80vh] w-full max-w-md flex-col rounded-t-3xl bg-white p-6 pb-8 shadow-2xl transition-transform duration-300 ease-out">
        {/* Drag handle line */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
        
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-950">
              {exerciseName}
            </h2>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Exercise History
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-4">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, workoutIdx) => (
              <div 
                key={workoutIdx} 
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <h3 className="text-sm font-black text-slate-950">
                  {formatWorkoutDate(item.date)}
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {item.sets.map((set, setIdx) => {
                    const setLabel = set.isWarmup ? "W" : `Set ${item.sets.slice(0, setIdx + 1).filter(s => !s.isWarmup).length}`;
                    return (
                      <li 
                        key={set.id || setIdx} 
                        className="flex items-center justify-between text-sm text-slate-700"
                      >
                        <span className="font-semibold text-slate-500">
                          {setLabel}
                        </span>
                        <span className="font-medium text-slate-800">
                          {formatSet(set)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm font-semibold text-slate-500">
              No previous sets recorded for this exercise.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
