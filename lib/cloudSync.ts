import type { User } from "@supabase/supabase-js";
import type {
  ExerciseEntry,
  PRRecord,
  Workout,
  WorkoutTemplate,
  WorkoutTemplateFolder,
} from "@/types/workout";
import { getSupabase, isCloudConfigured } from "@/lib/supabase";
import {
  getTemplateFolders,
  getWorkouts,
  getWorkoutTemplates,
  mergeExerciseNames,
  replaceTemplateFolders,
  replaceWorkoutTemplates,
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

type TemplateFolderRow = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

type WorkoutTemplateRow = {
  id: string;
  user_id: string;
  name: string;
  folder_id: string | null;
  exercises: ExerciseEntry[];
  created_at: string;
  updated_at: string;
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

function rowToTemplateFolder(row: TemplateFolderRow): WorkoutTemplateFolder {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function templateFolderToRow(
  folder: WorkoutTemplateFolder,
  user: User,
): TemplateFolderRow {
  return {
    id: folder.id,
    user_id: user.id,
    name: folder.name,
    created_at: folder.createdAt,
    updated_at: folder.updatedAt,
  };
}

function rowToWorkoutTemplate(row: WorkoutTemplateRow): WorkoutTemplate {
  return {
    id: row.id,
    name: row.name,
    folderId: row.folder_id ?? undefined,
    exercises: row.exercises,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function workoutTemplateToRow(
  template: WorkoutTemplate,
  user: User,
): WorkoutTemplateRow {
  return {
    id: template.id,
    user_id: user.id,
    name: template.name,
    folder_id: template.folderId ?? null,
    exercises: template.exercises,
    created_at: template.createdAt,
    updated_at: template.updatedAt,
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

function mergeByNewestUpdatedAt<T extends { id: string; updatedAt: string }>(
  localItems: T[],
  cloudItems: T[],
) {
  const itemsById = new Map<string, T>();

  [...cloudItems, ...localItems].forEach((item) => {
    const current = itemsById.get(item.id);
    if (!current || item.updatedAt >= current.updatedAt) {
      itemsById.set(item.id, item);
    }
  });

  return Array.from(itemsById.values());
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

  const { data: folderData, error: folderError } = await supabase
    .from("template_folders")
    .select("*")
    .order("created_at", { ascending: true });

  if (folderError) {
    return { ok: false, message: folderError.message };
  }

  const cloudFolders = ((folderData ?? []) as TemplateFolderRow[]).map(
    rowToTemplateFolder,
  );
  const mergedFolders = mergeByNewestUpdatedAt(getTemplateFolders(), cloudFolders);
  replaceTemplateFolders(mergedFolders);

  if (mergedFolders.length) {
    const { error: folderUpsertError } = await supabase
      .from("template_folders")
      .upsert(
        mergedFolders.map((folder) => templateFolderToRow(folder, user)),
        { onConflict: "id" },
      );

    if (folderUpsertError) {
      return { ok: false, message: folderUpsertError.message };
    }
  }

  const { data: templateData, error: templateError } = await supabase
    .from("workout_templates")
    .select("*")
    .order("updated_at", { ascending: false });

  if (templateError) {
    return { ok: false, message: templateError.message };
  }

  const cloudTemplates = ((templateData ?? []) as WorkoutTemplateRow[]).map(
    rowToWorkoutTemplate,
  );
  const mergedTemplates = mergeByNewestUpdatedAt(
    getWorkoutTemplates(),
    cloudTemplates,
  );
  replaceWorkoutTemplates(mergedTemplates);

  if (mergedTemplates.length) {
    const { error: templateUpsertError } = await supabase
      .from("workout_templates")
      .upsert(
        mergedTemplates.map((template) => workoutTemplateToRow(template, user)),
        { onConflict: "id" },
      );

    if (templateUpsertError) {
      return { ok: false, message: templateUpsertError.message };
    }
  }

  return {
    ok: true,
    message: `Synced ${mergedWorkouts.length} workout${
      mergedWorkouts.length === 1 ? "" : "s"
    } and ${mergedTemplates.length} template${
      mergedTemplates.length === 1 ? "" : "s"
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

export async function deleteCloudWorkoutTemplate(
  templateId: string,
): Promise<SyncResult> {
  if (!isCloudConfigured()) {
    return { ok: false, message: "Cloud sync is not configured yet." };
  }

  const supabase = getSupabase();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return { ok: false, message: "Sign in to delete synced templates." };
  }

  const { error } = await supabase
    .from("workout_templates")
    .delete()
    .eq("id", templateId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Deleted template from cloud sync." };
}

export async function deleteCloudTemplateFolder(
  folderId: string,
): Promise<SyncResult> {
  if (!isCloudConfigured()) {
    return { ok: false, message: "Cloud sync is not configured yet." };
  }

  const supabase = getSupabase();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return { ok: false, message: "Sign in to delete synced folders." };
  }

  const { error } = await supabase
    .from("template_folders")
    .delete()
    .eq("id", folderId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Deleted folder from cloud sync." };
}
