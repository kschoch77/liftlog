import type { Workout, WorkoutDraft } from "@/types/workout";
import {
  calculateExercisePRs,
  calculateWeeklyWorkoutCount,
  calculateWorkoutVolume,
  findPreviousSets,
  getCurrentWeekMuscleGroupVolume,
  getExerciseOneRepMaxProgress,
  getWorkoutMuscleGroups,
  getWorkoutWeeks,
} from "@/lib/calculations";

const WORKOUTS_KEY = "liftlog.workouts";
const EXERCISE_NAMES_KEY = "liftlog.exerciseNames";
const DRAFT_KEY = "liftlog.activeDraft";
const STORAGE_EVENT = "liftlog-storage";
let workoutsCacheRaw: string | null = null;
let workoutsCacheValue: Workout[] = [];
let exerciseNamesCacheRaw: string | null = null;
let exerciseNamesCacheValue: string[] = [];
let draftCacheRaw: string | null = null;
let draftCacheValue: WorkoutDraft | null = null;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function subscribeToStorage(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(STORAGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(STORAGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getWorkouts() {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(WORKOUTS_KEY);
  if (rawValue === workoutsCacheRaw) {
    return workoutsCacheValue;
  }

  workoutsCacheRaw = rawValue;
  workoutsCacheValue = readJson<Workout[]>(WORKOUTS_KEY, []).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return workoutsCacheValue;
}

export function replaceWorkouts(workouts: Workout[]) {
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  writeJson(WORKOUTS_KEY, sortedWorkouts);
}

export function saveWorkout(workout: Workout) {
  const workouts = getWorkouts().filter((savedWorkout) => savedWorkout.id !== workout.id);
  replaceWorkouts([workout, ...workouts]);
}

export function getWorkout(workoutId: string) {
  return getWorkouts().find((workout) => workout.id === workoutId);
}

export function deleteWorkout(workoutId: string) {
  replaceWorkouts(getWorkouts().filter((workout) => workout.id !== workoutId));
}

export function getExerciseNames() {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(EXERCISE_NAMES_KEY);
  if (rawValue === exerciseNamesCacheRaw) {
    return exerciseNamesCacheValue;
  }

  exerciseNamesCacheRaw = rawValue;
  exerciseNamesCacheValue = readJson<string[]>(EXERCISE_NAMES_KEY, []).sort((a, b) =>
    a.localeCompare(b),
  );
  return exerciseNamesCacheValue;
}

export function saveExerciseName(name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return;
  }

  const existingNames = getExerciseNames();
  const alreadySaved = existingNames.some(
    (exerciseName) => exerciseName.toLowerCase() === trimmedName.toLowerCase(),
  );

  if (!alreadySaved) {
    writeJson(EXERCISE_NAMES_KEY, [...existingNames, trimmedName]);
  }
}

export function mergeExerciseNames(names: string[]) {
  const existingNames = getExerciseNames();
  const mergedNames = [...existingNames];

  names.forEach((name) => {
    const trimmedName = name.trim();
    const alreadySaved = mergedNames.some(
      (exerciseName) => exerciseName.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (trimmedName && !alreadySaved) {
      mergedNames.push(trimmedName);
    }
  });

  writeJson(
    EXERCISE_NAMES_KEY,
    mergedNames.sort((a, b) => a.localeCompare(b)),
  );
}

export function getPRs() {
  return calculateExercisePRs(getWorkouts());
}

export function getWorkoutDraft() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(DRAFT_KEY);
  if (rawValue === draftCacheRaw) {
    return draftCacheValue;
  }

  draftCacheRaw = rawValue;
  draftCacheValue = readJson<WorkoutDraft | null>(DRAFT_KEY, null);
  return draftCacheValue;
}

export function saveWorkoutDraft(draft: WorkoutDraft) {
  writeJson(DRAFT_KEY, draft);
}

export function clearWorkoutDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(DRAFT_KEY);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export {
  calculateExercisePRs,
  calculateWeeklyWorkoutCount,
  calculateWorkoutVolume,
  findPreviousSets,
  getCurrentWeekMuscleGroupVolume,
  getExerciseOneRepMaxProgress,
  getWorkoutMuscleGroups,
  getWorkoutWeeks,
};
