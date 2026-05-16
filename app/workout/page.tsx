"use client";

import { useRouter } from "next/navigation";
import { ClipboardList, Plus, Save, Trophy, X } from "lucide-react";
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import { ExerciseCard } from "@/components/ExerciseCard";
import {
  calculateWorkoutVolume,
  countsTowardWeightMetrics,
  findNewPRs,
  findPreviousBest,
  findPreviousSets,
} from "@/lib/calculations";
import { createId } from "@/lib/id";
import {
  getExerciseNames,
  getWorkoutDraft,
  getWorkouts,
  clearWorkoutDraft,
  saveExerciseName,
  saveWorkout,
  saveWorkoutDraft,
  subscribeToStorage,
} from "@/lib/storage";
import type { ExerciseEntry, PRRecord, SetEntry, Workout, WorkoutDraft } from "@/types/workout";

const emptyExerciseNames: string[] = [];
const emptyWorkouts: Workout[] = [];
const emptyDraft: WorkoutDraft | null = null;

function createExercise(name: string): ExerciseEntry {
  return {
    id: createId("exercise"),
    name,
    sets: [
      {
        id: createId("set"),
        weight: 0,
        reps: 0,
        completed: false,
        weightType: "weight",
      },
    ],
  };
}

function sanitizeDraftSet(set: SetEntry): SetEntry {
  return {
    ...set,
    weight: 0,
    reps: 0,
    completed: false,
    isPR: false,
    note: "",
  };
}

function sanitizeDraftExercises(exercises: ExerciseEntry[]) {
  return exercises
    .filter((exercise) => exercise.name.trim())
    .map((exercise) => ({
      ...exercise,
      name: exercise.name.trim(),
      sets: exercise.sets.map(sanitizeDraftSet),
    }));
}

export default function WorkoutPage() {
  const router = useRouter();
  const [exerciseName, setExerciseName] = useState("");
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const exerciseNames = useSyncExternalStore(
    subscribeToStorage,
    getExerciseNames,
    () => emptyExerciseNames,
  );
  const savedWorkouts = useSyncExternalStore(
    subscribeToStorage,
    getWorkouts,
    () => emptyWorkouts,
  );
  const workoutDraft = useSyncExternalStore(
    subscribeToStorage,
    getWorkoutDraft,
    () => emptyDraft,
  );

  const currentPRs = useMemo(() => {
    const prs: Record<string, PRRecord | undefined> = {};
    exercises.forEach((exercise) => {
      prs[exercise.id] = findPreviousBest(savedWorkouts, exercise.name);
    });
    return prs;
  }, [exercises, savedWorkouts]);

  const previousSetsByExercise = useMemo(() => {
    const previousSets: Record<string, ExerciseEntry["sets"]> = {};
    exercises.forEach((exercise) => {
      previousSets[exercise.id] = findPreviousSets(savedWorkouts, exercise.name);
    });
    return previousSets;
  }, [exercises, savedWorkouts]);

  const livePRCount = exercises.reduce(
    (count, exercise) =>
      count +
      exercise.sets.filter((set) => set.isPR && countsTowardWeightMetrics(set))
        .length,
    0,
  );

  function addExercise(event: FormEvent) {
    event.preventDefault();
    const trimmedName = exerciseName.trim();

    if (!trimmedName) {
      return;
    }

    saveExerciseName(trimmedName);
    setExercises((current) => [...current, createExercise(trimmedName)]);
    setExerciseName("");
  }

  function finishWorkout() {
    const completedExercises = exercises
      .map((exercise) => ({
        ...exercise,
        name: exercise.name.trim(),
        sets: exercise.sets.filter(
          (set) => set.completed || Boolean(set.note?.trim()),
        ),
      }))
      .filter((exercise) => exercise.name && exercise.sets.length > 0);

    if (!completedExercises.length) {
      return;
    }

    const date = new Date().toISOString();
    const prsAchieved = findNewPRs(completedExercises, savedWorkouts, date);
    const workout: Workout = {
      id: createId("workout"),
      date,
      exercises: completedExercises,
      totalVolume: calculateWorkoutVolume(completedExercises),
      prsAchieved,
    };

    saveWorkout(workout);
    clearWorkoutDraft();
    router.push("/");
  }

  function saveDraft() {
    const draftExercises = sanitizeDraftExercises(exercises);

    if (!draftExercises.length) {
      return;
    }

    draftExercises.forEach((exercise) => saveExerciseName(exercise.name));
    saveWorkoutDraft({
      exercises: draftExercises,
      updatedAt: new Date().toISOString(),
    });
  }

  function loadDraft() {
    if (!workoutDraft) {
      return;
    }

    setExercises(
      workoutDraft.exercises.map((exercise) => ({
        ...exercise,
        id: createId("exercise"),
        sets: exercise.sets.map((set) => ({
          ...set,
          id: createId("set"),
          completed: false,
          isPR: false,
        })),
      })),
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-5">
      <header className="flex items-start justify-between gap-4 pt-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            Workout
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Today&apos;s Workout
          </h1>
        </div>
        <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            PRs
          </p>
          <p className="font-mono text-2xl font-black text-blue-600">
            {livePRCount}
          </p>
        </div>
      </header>

      <form onSubmit={addExercise} className="mt-5 rounded-3xl bg-white p-3 shadow-sm">
        <label className="sr-only" htmlFor="exercise-name">
          Exercise name
        </label>
        <div className="flex gap-2">
          <input
            id="exercise-name"
            list="exercise-suggestions"
            placeholder="Add exercise"
            value={exerciseName}
            onChange={(event) => setExerciseName(event.target.value)}
            className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <datalist id="exercise-suggestions">
            {exerciseNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
          <button
            type="submit"
            aria-label="Add exercise"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white"
          >
            <Plus size={22} />
          </button>
        </div>
      </form>

      {workoutDraft ? (
        <section className="mt-4 rounded-3xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-black text-blue-950">Draft workout saved</p>
              <p className="mt-1 text-sm font-medium text-blue-700">
                {workoutDraft.exercises.length} planned exercise
                {workoutDraft.exercises.length === 1 ? "" : "s"}
              </p>
            </div>
            <ClipboardList className="text-blue-600" size={22} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={loadDraft}
              className="flex h-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white"
            >
              Load Draft
            </button>
            <button
              type="button"
              onClick={clearWorkoutDraft}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-bold text-blue-700"
            >
              <X size={16} />
              Clear
            </button>
          </div>
        </section>
      ) : null}

      <div className="mt-4 space-y-4">
        {exercises.length ? (
          exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              previousBest={currentPRs[exercise.id]}
              previousSets={previousSetsByExercise[exercise.id]}
              onChange={(updatedExercise) =>
                setExercises((current) =>
                  current.map((item) =>
                    item.id === updatedExercise.id ? updatedExercise : item,
                  ),
                )
              }
              onRemove={() =>
                setExercises((current) =>
                  current.filter((item) => item.id !== exercise.id),
                )
              }
            />
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <Trophy className="mx-auto text-blue-500" size={32} />
            <p className="mt-3 font-bold text-slate-950">Add your first exercise</p>
            <p className="mt-1 text-sm text-slate-500">
              Type a lift name above to start logging sets.
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={finishWorkout}
        disabled={!exercises.some((exercise) => exercise.sets.some((set) => set.completed))}
        className="mt-6 h-14 w-full rounded-2xl bg-slate-950 font-bold text-white shadow-lg shadow-slate-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        Finish Workout
      </button>

      <button
        type="button"
        onClick={saveDraft}
        disabled={!exercises.some((exercise) => exercise.name.trim())}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white font-bold text-slate-800 shadow-sm disabled:cursor-not-allowed disabled:text-slate-300"
      >
        <Save size={18} />
        Save Draft
      </button>
    </div>
  );
}
