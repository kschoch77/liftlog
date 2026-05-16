import type { User } from "@supabase/supabase-js";
import type { ExerciseEntry, PRRecord, Workout } from "@/types/workout";
import { getSupabase, isCloudConfigured } from "@/lib/supabase";
import {
  getWorkouts,
  mergeExerciseNames,
  replaceWorkouts,
} from "@/lib/storage";

type WorkoutRow = {
  id: string;
  user_id: string;
  date: string;
  exercises: ExerciseEntry[];
  total_volume: number;
  prs_achieved: PRRecord[];
};

export type SyncResult = {
  ok: boolean;
  message: string;
};

export async function getCurrentUser() {
  const supabase = getSupabase();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function signUp(email: string, password: string) {
  const supabase = getSupabase();

  if (!supabase) {
    return { ok: false, message: "Cloud sync is not configured yet." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        typeof window === "undefined" ? undefined : window.location.origin,
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return {
    ok: true,
    message: "Account created. If Supabase asks for confirmation, check your email.",
  };
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabase();

  if (!supabase) {
    return { ok: false, message: "Cloud sync is not configured yet." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Signed in." };
}

export async function signOut() {
  const supabase = getSupabase();

  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}

export function subscribeToAuth(callback: () => void) {
  const supabase = getSupabase();

  if (!supabase) {
    return () => {};
  }

  const { data } = supabase.auth.onAuthStateChange(() => callback());
  return () => data.subscription.unsubscribe();
}

function rowToWorkout(row: WorkoutRow): Workout {
  return {
    id: row.id,
    date: row.date,
    exercises: row.exercises,
    totalVolume: row.total_volume,
    prsAchieved: row.prs_achieved,
  };
}

function workoutToRow(workout: Workout, user: User): WorkoutRow {
  return {
    id: workout.id,
    user_id: user.id,
    date: workout.date,
    exercises: workout.exercises,
    total_volume: workout.totalVolume,
    prs_achieved: workout.prsAchieved,
  };
}

function mergeWorkouts(localWorkouts: Workout[], cloudWorkouts: Workout[]) {
  const workoutsById = new Map<string, Workout>();

  [...cloudWorkouts, ...localWorkouts].forEach((workout) => {
    workoutsById.set(workout.id, workout);
  });

  return Array.from(workoutsById.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

function exerciseNamesFromWorkouts(workouts: Workout[]) {
  return workouts.flatMap((workout) =>
    workout.exercises.map((exercise) => exercise.name),
  );
}

export async function syncWorkouts(): Promise<SyncResult> {
  if (!isCloudConfigured()) {
    return { ok: false, message: "Add Supabase keys to .env.local to turn on sync." };
  }

  const supabase = getSupabase();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return { ok: false, message: "Sign in to sync workouts." };
  }

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    return { ok: false, message: error.message };
  }

  const cloudWorkouts = ((data ?? []) as WorkoutRow[]).map(rowToWorkout);
  const mergedWorkouts = mergeWorkouts(getWorkouts(), cloudWorkouts);
  replaceWorkouts(mergedWorkouts);
  mergeExerciseNames(exerciseNamesFromWorkouts(mergedWorkouts));

  if (mergedWorkouts.length) {
    const { error: upsertError } = await supabase
      .from("workouts")
      .upsert(
        mergedWorkouts.map((workout) => workoutToRow(workout, user)),
        { onConflict: "id" },
      );

    if (upsertError) {
      return { ok: false, message: upsertError.message };
    }
  }

  return {
    ok: true,
    message: `Synced ${mergedWorkouts.length} workout${
      mergedWorkouts.length === 1 ? "" : "s"
    }.`,
  };
}

export async function deleteCloudWorkout(workoutId: string): Promise<SyncResult> {
  if (!isCloudConfigured()) {
    return { ok: false, message: "Cloud sync is not configured yet." };
  }

  const supabase = getSupabase();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return { ok: false, message: "Sign in to delete synced workouts." };
  }

  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", workoutId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Deleted workout from cloud sync." };
}
