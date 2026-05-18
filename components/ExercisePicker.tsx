"use client";

import { Plus, Search } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import {
  exerciseCatalog,
  findCatalogExercise,
  type ExerciseCatalogEntry,
} from "@/lib/exerciseCatalog";

type ExercisePickerProps = {
  customExerciseNames: string[];
  onAddExercise: (name: string, catalogEntry?: ExerciseCatalogEntry) => void;
};

function uniqueNames(names: string[]) {
  const seen = new Set<string>();
  return names.filter((name) => {
    const key = name.trim().toLowerCase();
    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function ExercisePicker({
  customExerciseNames,
  onAddExercise,
}: ExercisePickerProps) {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const options = useMemo(() => {
    if (!trimmedQuery) {
      return [];
    }

    const catalogNames = exerciseCatalog.map((exercise) => exercise.name);
    const allNames = uniqueNames([...catalogNames, ...customExerciseNames]);
    const normalizedQuery = trimmedQuery.toLowerCase();

    return allNames.filter((name) => name.toLowerCase().includes(normalizedQuery));
  }, [customExerciseNames, trimmedQuery]);
  const exactMatch = options.some(
    (name) => name.toLowerCase() === trimmedQuery.toLowerCase(),
  );

  function addExercise(name: string) {
    const cleanedName = name.trim();
    if (!cleanedName) {
      return;
    }

    onAddExercise(cleanedName, findCatalogExercise(cleanedName));
    setQuery("");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    addExercise(trimmedQuery || options[0] || "");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 rounded-3xl bg-white p-3 shadow-sm">
      <label className="sr-only" htmlFor="exercise-search">
        Search exercises
      </label>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            id="exercise-search"
            type="text"
            placeholder="Search or add exercise"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <button
          type="submit"
          aria-label="Add exercise"
          disabled={!trimmedQuery && !options.length}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white disabled:bg-blue-300"
        >
          <Plus size={22} />
        </button>
      </div>

      {trimmedQuery || options.length ? (
        <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
          {options.map((name) => {
            const catalogEntry = findCatalogExercise(name);

            return (
              <button
                type="button"
                key={name}
                onClick={() => addExercise(name)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-3 text-left"
              >
                <span>
                  <span className="block font-bold text-slate-950">{name}</span>
                  <span className="block text-xs font-semibold text-slate-500">
                    {catalogEntry?.primaryMuscleGroup ?? "Custom"}{" "}
                    {catalogEntry?.movementCategory
                      ? `- ${catalogEntry.movementCategory}`
                      : ""}
                  </span>
                </span>
                <Plus className="shrink-0 text-blue-600" size={17} />
              </button>
            );
          })}

          {trimmedQuery && !exactMatch ? (
            <button
              type="button"
              onClick={() => addExercise(trimmedQuery)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-3 py-3 text-left"
            >
              <span>
                <span className="block font-bold text-blue-950">
                  Add &quot;{trimmedQuery}&quot;
                </span>
                <span className="block text-xs font-semibold text-blue-600">
                  Save as a custom exercise
                </span>
              </span>
              <Plus className="shrink-0 text-blue-600" size={17} />
            </button>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
