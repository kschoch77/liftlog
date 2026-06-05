"use client";

import {
  Folder,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ExerciseCard } from "@/components/ExerciseCard";
import { ExercisePicker } from "@/components/ExercisePicker";
import {
  deleteCloudTemplateFolder,
  deleteCloudWorkoutTemplate,
  syncWorkouts,
} from "@/lib/cloudSync";
import type { ExerciseCatalogEntry } from "@/lib/exerciseCatalog";
import { createId } from "@/lib/id";
import {
  deleteTemplateFolder,
  deleteWorkoutTemplate,
  getExerciseNames,
  getTemplateFolders,
  getWorkoutTemplates,
  saveActiveWorkoutSession,
  saveExerciseName,
  saveTemplateFolder,
  saveWorkoutTemplate,
  subscribeToStorage,
} from "@/lib/storage";
import type {
  ExerciseEntry,
  WorkoutTemplate,
  WorkoutTemplateFolder,
} from "@/types/workout";

const emptyFolders: WorkoutTemplateFolder[] = [];
const emptyTemplates: WorkoutTemplate[] = [];
const emptyExerciseNames: string[] = [];

type TemplateEditorState = {
  id?: string;
  name: string;
  folderId?: string;
  exercises: ExerciseEntry[];
  createdAt?: string;
};

function createTemplateExercise(
  name: string,
  catalogEntry?: ExerciseCatalogEntry,
): ExerciseEntry {
  return {
    id: createId("exercise"),
    name,
    primaryMuscleGroup: catalogEntry?.primaryMuscleGroup,
    additionalPrimaryMuscleGroup: catalogEntry?.additionalPrimaryMuscleGroup,
    sets: [
      {
        id: createId("set"),
        weight: 0,
        reps: 0,
        completed: false,
        weightType: catalogEntry?.defaultWeightType ?? "weight",
        includesBarWeight:
          catalogEntry?.sourceWeightType === "Barbell" ? true : undefined,
      },
    ],
  };
}

function cloneExercisesForWorkout(exercises: ExerciseEntry[]) {
  return exercises.map((exercise) => ({
    ...exercise,
    id: createId("exercise"),
    sets: exercise.sets.map((set) => ({
      ...set,
      id: createId("set"),
      completed: false,
      isPR: false,
    })),
  }));
}

function cleanTemplateExercises(exercises: ExerciseEntry[]) {
  return exercises
    .map((exercise) => ({
      ...exercise,
      name: exercise.name.trim(),
      sets: exercise.sets.map((set) => ({
        ...set,
        isPR: false,
      })),
    }))
    .filter((exercise) => exercise.name && exercise.sets.length > 0);
}

function formatTemplateSummary(template: WorkoutTemplate) {
  const names = template.exercises
    .map((exercise) => exercise.name.trim())
    .filter(Boolean);

  if (!names.length) {
    return "No exercises yet";
  }

  const visibleNames = names.slice(0, 3).join(", ");
  const remainingCount = names.length - 3;

  return remainingCount > 0
    ? `${visibleNames} & ${remainingCount} more...`
    : visibleNames;
}

export default function TemplatesPage() {
  const router = useRouter();
  const folders = useSyncExternalStore(
    subscribeToStorage,
    getTemplateFolders,
    () => emptyFolders,
  );
  const templates = useSyncExternalStore(
    subscribeToStorage,
    getWorkoutTemplates,
    () => emptyTemplates,
  );
  const exerciseNames = useSyncExternalStore(
    subscribeToStorage,
    getExerciseNames,
    () => emptyExerciseNames,
  );
  const [folderName, setFolderName] = useState("");
  const [editor, setEditor] = useState<TemplateEditorState | null>(null);
  const [message, setMessage] = useState("");

  const folderCounts = useMemo(() => {
    const counts = new Map<string, number>();
    folders.forEach((folder) => counts.set(folder.id, 0));
    templates.forEach((template) => {
      if (template.folderId) {
        counts.set(template.folderId, (counts.get(template.folderId) ?? 0) + 1);
      }
    });
    return counts;
  }, [folders, templates]);

  function createFolder(event: FormEvent) {
    event.preventDefault();
    const name = folderName.trim();

    if (!name) {
      return;
    }

    const now = new Date().toISOString();
    saveTemplateFolder({
      id: createId("folder"),
      name,
      createdAt: now,
      updatedAt: now,
    });
    setFolderName("");
    void syncWorkouts();
  }

  function startNewTemplate(folderId?: string) {
    setMessage("");
    setEditor({
      name: "",
      folderId,
      exercises: [],
    });
  }

  function editTemplate(template: WorkoutTemplate) {
    setMessage("");
    setEditor({
      id: template.id,
      name: template.name,
      folderId: template.folderId,
      exercises: template.exercises,
      createdAt: template.createdAt,
    });
  }

  function updateEditorExercises(exercises: ExerciseEntry[]) {
    setEditor((current) => (current ? { ...current, exercises } : current));
  }

  function addExercise(name: string, catalogEntry?: ExerciseCatalogEntry) {
    const trimmedName = name.trim();

    if (!trimmedName || !editor) {
      return;
    }

    saveExerciseName(trimmedName);
    updateEditorExercises([
      ...editor.exercises,
      createTemplateExercise(trimmedName, catalogEntry),
    ]);
  }

  function saveTemplate() {
    if (!editor) {
      return;
    }

    const name = editor.name.trim();
    const exercises = cleanTemplateExercises(editor.exercises);

    if (!name || !exercises.length) {
      setMessage("Name the template and add at least one exercise.");
      return;
    }

    exercises.forEach((exercise) => saveExerciseName(exercise.name));
    const now = new Date().toISOString();
    saveWorkoutTemplate({
      id: editor.id ?? createId("template"),
      name,
      folderId: editor.folderId,
      exercises,
      createdAt: editor.createdAt ?? now,
      updatedAt: now,
    });
    setEditor(null);
    setMessage("Template saved.");
    void syncWorkouts();
  }

  function startWorkoutFromTemplate(template: WorkoutTemplate) {
    saveActiveWorkoutSession({
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: cloneExercisesForWorkout(template.exercises),
    });
    router.push("/workout");
  }

  async function removeTemplate(template: WorkoutTemplate) {
    const shouldDelete = window.confirm(`Delete "${template.name}"?`);

    if (!shouldDelete) {
      return;
    }

    await deleteCloudWorkoutTemplate(template.id);
    deleteWorkoutTemplate(template.id);
  }

  async function removeFolder(folder: WorkoutTemplateFolder) {
    const shouldDelete = window.confirm(
      `Delete "${folder.name}"? Templates in this folder will move back to My Templates.`,
    );

    if (!shouldDelete) {
      return;
    }

    await deleteCloudTemplateFolder(folder.id);
    deleteTemplateFolder(folder.id);
  }

  function moveTemplate(template: WorkoutTemplate, folderId: string) {
    saveWorkoutTemplate({
      ...template,
      folderId: folderId || undefined,
      updatedAt: new Date().toISOString(),
    });
    void syncWorkouts();
  }

  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-5">
      <header className="flex items-start justify-between gap-4 pt-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            Templates
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Templates
          </h1>
        </div>
        <button
          type="button"
          onClick={() => startNewTemplate()}
          className="flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-blue-50 px-3 font-black text-blue-600"
        >
          <Plus size={21} />
          Template
        </button>
      </header>

      {message ? (
        <p className="mt-4 rounded-2xl bg-blue-50 p-3 text-sm font-bold text-blue-700">
          {message}
        </p>
      ) : null}

      {editor ? (
        <section className="mt-5 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black tracking-tight text-slate-950">
              {editor.id ? "Edit Template" : "New Template"}
            </h2>
            <button
              type="button"
              aria-label="Close template editor"
              onClick={() => setEditor(null)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            <label className="sr-only" htmlFor="template-name">
              Template name
            </label>
            <input
              id="template-name"
              type="text"
              placeholder="Template name"
              value={editor.name}
              onChange={(event) =>
                setEditor({ ...editor, name: event.target.value })
              }
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <label className="sr-only" htmlFor="template-folder">
              Folder
            </label>
            <select
              id="template-folder"
              value={editor.folderId ?? ""}
              onChange={(event) =>
                setEditor({
                  ...editor,
                  folderId: event.target.value || undefined,
                })
              }
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">No folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <ExercisePicker
            customExerciseNames={exerciseNames}
            onAddExercise={addExercise}
          />

          <div className="mt-4 space-y-4">
            {editor.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onChange={(updatedExercise) =>
                  updateEditorExercises(
                    editor.exercises.map((item) =>
                      item.id === updatedExercise.id ? updatedExercise : item,
                    ),
                  )
                }
                onRemove={() =>
                  updateEditorExercises(
                    editor.exercises.filter((item) => item.id !== exercise.id),
                  )
                }
              />
            ))}
          </div>

          <button
            type="button"
            onClick={saveTemplate}
            className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 font-bold text-white shadow-lg shadow-slate-200"
          >
            <Save size={18} />
            Save Template
          </button>
        </section>
      ) : null}

      <section className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            My Folders ({folders.length})
          </h2>
        </div>

        <form onSubmit={createFolder} className="mt-3 flex gap-2">
          <label className="sr-only" htmlFor="folder-name">
            Folder name
          </label>
          <input
            id="folder-name"
            type="text"
            placeholder="New folder"
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-3 font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <button
            type="submit"
            disabled={!folderName.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white disabled:bg-blue-300"
            aria-label="Create folder"
          >
            <Folder size={20} />
          </button>
        </form>

        <div className="mt-3 grid grid-cols-1 gap-3">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Folder className="shrink-0 text-slate-700" size={24} />
                  <div className="min-w-0">
                    <p className="truncate text-lg font-black text-slate-950">
                      {folder.name} ({folderCounts.get(folder.id) ?? 0})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void removeFolder(folder)}
                  aria-label={`Delete ${folder.name}`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => startNewTemplate(folder.id)}
                className="mt-4 flex h-24 w-full items-center justify-center rounded-3xl border border-dashed border-blue-100 bg-blue-50/40 px-4 text-center text-lg font-black text-blue-500"
              >
                Tap to Add
              </button>
            </div>
          ))}

          {!folders.length ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm font-semibold text-slate-500">
              Create folders to organize saved templates.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-7">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            My Templates ({templates.length})
          </h2>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {templates.map((template) => (
            <article
              key={template.id}
              className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl font-black leading-tight text-slate-950">
                    {template.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold leading-snug text-slate-500">
                    {formatTemplateSummary(template)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void removeTemplate(template)}
                  aria-label={`Delete ${template.name}`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-500"
                >
                  <MoreHorizontal size={19} />
                </button>
              </div>

              <label className="sr-only" htmlFor={`${template.id}-folder`}>
                Move template to folder
              </label>
              <select
                id={`${template.id}-folder`}
                value={template.folderId ?? ""}
                onChange={(event) => moveTemplate(template, event.target.value)}
                className="mt-4 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">No folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => startWorkoutFromTemplate(template)}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-bold text-white"
                >
                  <Play size={16} />
                  Start
                </button>
                <button
                  type="button"
                  onClick={() => editTemplate(template)}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-100 text-sm font-bold text-slate-800"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              </div>
              <button
                type="button"
                onClick={() => void removeTemplate(template)}
                className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-red-50 text-sm font-bold text-red-600"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </article>
          ))}

          {!templates.length ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm font-semibold text-slate-500 sm:col-span-2">
              Saved workout templates will show up here.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-7 pb-4">
        <h2 className="text-2xl font-black tracking-tight text-slate-950">
          LiftLog Templates
        </h2>
        <div className="mt-3 rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm font-semibold text-slate-500">
          LiftLog templates will be added in future versions of the app.
        </div>
      </section>
    </div>
  );
}
