"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ExerciseCard } from "@/components/ExerciseCard";
import { deleteCloudWorkout, syncWorkouts } from "@/lib/cloudSync";
import {
  calculateWorkoutVolume,
  findNewPRs,
  findPreviousBest,
  findPreviousSets,
  findAllPreviousSets,
} from "@/lib/calculations";
import {
  deleteWorkout,
  getWorkouts,
  saveExerciseName,
  saveWorkout,
  subscribeToStorage,
} from "@/lib/storage";
import type { ExerciseEntry, PRRecord, Workout } from "@/types/workout";

const emptyWorkouts: Workout[] = [];

function buildUpdatedWorkout(
  workout: Workout,
  exercises: ExerciseEntry[],
  workouts: Workout[],
  cleanHistory = false,
  customDate?: string,
) {
  const dateToUse = customDate || workout.date;
  const priorWorkouts = workouts.filter(
    (savedWorkout) =>
      savedWorkout.id !== workout.id &&
      new Date(savedWorkout.date).getTime() < new Date(dateToUse).getTime(),
  );
  const nextExercises = exercises
    .map((exercise) => ({
      ...exercise,
      name: cleanHistory ? exercise.name.trim() : exercise.name,
      sets: cleanHistory
        ? exercise.sets.filter((set) => set.completed || Boolean(set.note?.trim()))
        : exercise.sets,
    }))
    .filter((exercise) =>
      cleanHistory ? exercise.name && exercise.sets.length > 0 : true,
    );

  return {
    ...workout,
    date: dateToUse,
    exercises: nextExercises,
    totalVolume: calculateWorkoutVolume(nextExercises),
    prsAchieved: findNewPRs(nextExercises, priorWorkouts, dateToUse),
  };
}

function toDatetimeLocalValue(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) {
    return "";
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function fromDatetimeLocalValue(value: string): string {
  const d = new Date(value);
  return d.toISOString();
}

export default function HistoricalWorkoutPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const [editedDate, setEditedDate] = useState<string>("");
  const workouts = useSyncExternalStore(
    subscribeToStorage,
    getWorkouts,
    () => emptyWorkouts,
  );
  const workout = workouts.find((savedWorkout) => savedWorkout.id === params.id);



  const priorWorkouts = useMemo(() => {
    if (!workout) {
      return [];
    }

    const currentWorkoutDate = editedDate || workout.date;

    return workouts.filter(
      (savedWorkout) =>
        savedWorkout.id !== workout.id &&
        new Date(savedWorkout.date).getTime() < new Date(currentWorkoutDate).getTime(),
    );
  }, [workout, workouts, editedDate]);

  const currentPRs = useMemo(() => {
    const prs: Record<string, PRRecord | undefined> = {};
    workout?.exercises.forEach((exercise) => {
      prs[exercise.id] = findPreviousBest(priorWorkouts, exercise.name);
    });
    return prs;
  }, [priorWorkouts, workout]);

  const previousSetsByExercise = useMemo(() => {
    const previousSets: Record<string, ExerciseEntry["sets"]> = {};
    workout?.exercises.forEach((exercise) => {
      previousSets[exercise.id] = findPreviousSets(priorWorkouts, exercise.name);
    });
    return previousSets;
  }, [priorWorkouts, workout]);

  const allPreviousSetsByExercise = useMemo(() => {
    const allPrevious: Record<string, { date: string; sets: ExerciseEntry["sets"] }[]> = {};
    workout?.exercises.forEach((exercise) => {
      allPrevious[exercise.id] = findAllPreviousSets(priorWorkouts, exercise.name);
    });
    return allPrevious;
  }, [priorWorkouts, workout]);

  function updateExercises(exercises: ExerciseEntry[]) {
    if (!workout) {
      return;
    }

    const updatedWorkout = buildUpdatedWorkout(workout, exercises, workouts, false, editedDate || workout.date);
    saveWorkout(updatedWorkout);
    setMessage("Changes saved on this device.");
  }

  function updateWorkoutDate(newDate: string) {
    if (!workout) {
      return;
    }
    setEditedDate(newDate);
    const updatedWorkout = buildUpdatedWorkout(workout, workout.exercises, workouts, false, newDate);
    saveWorkout(updatedWorkout);
    setMessage("Changes saved on this device.");
  }

  async function handleSaveChanges() {
    if (!workout) {
      return;
    }

    const cleanedWorkout = buildUpdatedWorkout(
      workout,
      workout.exercises,
      workouts,
      true,
      editedDate || workout.date,
    );
    cleanedWorkout.exercises.forEach((exercise) => saveExerciseName(exercise.name));
    saveWorkout(cleanedWorkout);
    const result = await syncWorkouts();
    setMessage(result.ok ? "Changes saved and synced." : result.message);
    router.push("/");
  }

  async function handleDeleteWorkout() {
    if (!workout) {
      return;
    }

    const shouldDelete = window.confirm(
      "Delete this workout from your history? This cannot be undone.",
    );

    if (!shouldDelete) {
      return;
    }

    await deleteCloudWorkout(workout.id);
    deleteWorkout(workout.id);
    router.push("/");
  }

  if (!workout) {
    return (
      <div className="min-h-dvh bg-slate-50 px-4 py-5">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-blue-600">
          <ArrowLeft size={18} />
          Back
        </Link>
        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-slate-500">
          This workout is not on this device.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-5">
      <header className="flex items-start justify-between gap-3 pt-2">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-blue-600">
            <ArrowLeft size={18} />
            Home
          </Link>
          <p className="mt-4 text-sm font-bold uppercase tracking-wide text-blue-600">
            Workout History
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Edit Workout
          </h1>
          <div className="mt-2 flex flex-col gap-1">
            <label htmlFor="workout-date-input" className="text-xs font-black uppercase tracking-wide text-slate-400">
              Workout Date & Time
            </label>
            <input
              id="workout-date-input"
              type="datetime-local"
              value={toDatetimeLocalValue(editedDate || workout.date)}
              onChange={(e) => {
                if (e.target.value) {
                  const newIsoString = fromDatetimeLocalValue(e.target.value);
                  updateWorkoutDate(newIsoString);
                }
              }}
              className="h-10 w-full max-w-xs rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 cursor-pointer"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleDeleteWorkout}
          aria-label="Delete workout"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600"
        >
          <Trash2 size={19} />
        </button>
      </header>

      {message ? (
        <p className="mt-4 rounded-2xl bg-blue-50 p-3 text-sm font-bold text-blue-700">
          {message}
        </p>
      ) : null}

      <div className="mt-5 space-y-4">
        {workout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            previousBest={currentPRs[exercise.id]}
            previousSets={previousSetsByExercise[exercise.id]}
            allPreviousSets={allPreviousSetsByExercise[exercise.id]}
            onChange={(updatedExercise) =>
              updateExercises(
                workout.exercises.map((item) =>
                  item.id === updatedExercise.id ? updatedExercise : item,
                ),
              )
            }
            onRemove={() =>
              updateExercises(
                workout.exercises.filter((item) => item.id !== exercise.id),
              )
            }
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleSaveChanges}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 font-bold text-white shadow-lg shadow-slate-200"
      >
        <Save size={18} />
        Save Changes
      </button>
    </div>
  );
}
