"use client";

import { Plus, Trash2 } from "lucide-react";
import { SetRow } from "@/components/SetRow";
import { countsTowardWeightMetrics, estimateOneRepMax } from "@/lib/calculations";
import { findCatalogExercise } from "@/lib/exerciseCatalog";
import { createId } from "@/lib/id";
import {
  muscleGroups,
  type ExerciseEntry,
  type MuscleGroup,
  type PRRecord,
  type SetEntry,
} from "@/types/workout";

type ExerciseCardProps = {
  exercise: ExerciseEntry;
  previousBest?: PRRecord;
  previousSets?: SetEntry[];
  onChange: (exercise: ExerciseEntry) => void;
  onRemove: () => void;
};

function isBarbellExerciseName(name: string) {
  return findCatalogExercise(name)?.sourceWeightType === "Barbell";
}

function createSet(isBarbellExercise: boolean): SetEntry {
  return {
    id: createId("set"),
    weight: 0,
    reps: 0,
    completed: false,
    weightType: "weight",
    includesBarWeight: isBarbellExercise ? true : undefined,
  };
}

function normalizeBarWeightFields(set: SetEntry, isBarbellExercise: boolean) {
  if ((set.weightType ?? "weight") !== "weight" || !isBarbellExercise) {
    return {
      ...set,
      includesBarWeight: undefined,
      barWeight: undefined,
    };
  }

  return {
    ...set,
    includesBarWeight: set.includesBarWeight ?? true,
    barWeight: set.includesBarWeight === false ? set.barWeight : undefined,
  };
}

export function ExerciseCard({
  exercise,
  previousBest,
  previousSets = [],
  onChange,
  onRemove,
}: ExerciseCardProps) {
  const isBarbellExercise = isBarbellExerciseName(exercise.name);

  function updateSet(updatedSet: SetEntry) {
    const normalizedSet = normalizeBarWeightFields(
      updatedSet,
      isBarbellExercise,
    );
    const nextSets = exercise.sets.map((set) =>
      set.id === updatedSet.id ? normalizedSet : set,
    );

    onChange({ ...exercise, sets: markPRs(nextSets) });
  }

  function updateExerciseName(name: string) {
    const nextIsBarbellExercise = isBarbellExerciseName(name);

    onChange({
      ...exercise,
      name,
      sets: exercise.sets.map((set) =>
        normalizeBarWeightFields(set, nextIsBarbellExercise),
      ),
    });
  }

  function removeSet(setId: string) {
    onChange({
      ...exercise,
      sets: markPRs(exercise.sets.filter((set) => set.id !== setId)),
    });
  }

  function markPRs(sets: SetEntry[]) {
    let bestOneRepMax = previousBest?.estimatedOneRepMax ?? 0;

    return sets.map((set) => {
      const oneRepMax = estimateOneRepMax(set.weight, set.reps);
      const isPR =
        countsTowardWeightMetrics(set) &&
        oneRepMax > 0 &&
        oneRepMax > bestOneRepMax;

      if (isPR) {
        bestOneRepMax = oneRepMax;
      }

      return { ...set, isPR };
    });
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor={`${exercise.id}-name`}>
            Exercise name
          </label>
          <input
            id={`${exercise.id}-name`}
            type="text"
            value={exercise.name}
            onChange={(event) => updateExerciseName(event.target.value)}
            className="h-10 w-full rounded-2xl border border-transparent bg-blue-50 px-3 text-lg font-black tracking-tight text-blue-600 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
          <p className="mt-1 text-sm text-slate-500">
            {previousBest
              ? `Best: ${previousBest.weight} x ${previousBest.reps} (${previousBest.estimatedOneRepMax} est. 1RM)`
              : "No PR yet"}
          </p>
          <label
            className="mt-3 block text-xs font-black uppercase tracking-wide text-slate-400"
            htmlFor={`${exercise.id}-muscle-group`}
          >
            Primary muscle
          </label>
          <select
            id={`${exercise.id}-muscle-group`}
            value={exercise.primaryMuscleGroup ?? ""}
            onChange={(event) =>
              onChange({
                ...exercise,
                primaryMuscleGroup: event.target.value
                  ? (event.target.value as MuscleGroup)
                  : undefined,
              })
            }
            className="mt-1 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Choose muscle group</option>
            {muscleGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <label
            className="mt-3 block text-xs font-black uppercase tracking-wide text-slate-400"
            htmlFor={`${exercise.id}-additional-muscle-group`}
          >
            Additional primary muscle
          </label>
          <select
            id={`${exercise.id}-additional-muscle-group`}
            value={exercise.additionalPrimaryMuscleGroup ?? ""}
            onChange={(event) =>
              onChange({
                ...exercise,
                additionalPrimaryMuscleGroup: event.target.value
                  ? (event.target.value as MuscleGroup)
                  : undefined,
              })
            }
            className="mt-1 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">None</option>
            {muscleGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          aria-label={`Remove ${exercise.name}`}
          onClick={onRemove}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="border-y border-slate-100 bg-slate-50 px-2 py-2">
        <div className="grid grid-cols-[2.25rem_1fr_2.25rem_2.25rem_2.25rem] gap-1.5 text-center text-xs font-black text-slate-500">
          <span>Set</span>
          <span>Previous</span>
          <span>Note</span>
          <span>Del</span>
          <span>Done</span>
        </div>
      </div>

      <div className="space-y-2 bg-slate-50 p-2">
        {exercise.sets.map((set, index) => (
          <SetRow
            key={set.id}
            set={set}
            setNumber={
              exercise.sets
                .slice(0, index + 1)
                .filter((currentSet) => !currentSet.isWarmup).length || 1
            }
            previousSet={previousSets[index]}
            isBarbellExercise={isBarbellExercise}
            onChange={updateSet}
            onRemove={() => removeSet(set.id)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          onChange({
            ...exercise,
            sets: markPRs([...exercise.sets, createSet(isBarbellExercise)]),
          })
        }
        className="m-2 flex h-11 w-[calc(100%-1rem)] items-center justify-center gap-2 rounded-2xl bg-slate-100 font-bold text-slate-800"
      >
        <Plus size={19} />
        Add Set
      </button>
    </section>
  );
}
