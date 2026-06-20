"use client";

import { Check, MessageSquare, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  bandOptions,
  type BandOption,
  type SetEntry,
  type WeightType,
} from "@/types/workout";

type SetRowProps = {
  set: SetEntry;
  setNumber: number;
  previousSet?: SetEntry;
  isBarbellExercise: boolean;
  onChange: (set: SetEntry) => void;
  onRemove: () => void;
};

const weightTypeLabels: Record<WeightType, string> = {
  weight: "Weight (lbs.)",
  bodyweight: "Bodyweight (BW)",
  assistance: "Assistance (-lbs.)",
  band: "Band",
};

function formatPreviousSet(set?: SetEntry) {
  if (!set || set.reps <= 0) {
    return "-";
  }

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

  return `${weightLabel} x ${set.reps}${rirLabel}`;
}

function numberFromInput(value: string) {
  return value === "" ? 0 : Number(value);
}

function optionalNumberFromInput(value: string) {
  return value === "" ? undefined : Number(value);
}

export function SetRow({
  set,
  setNumber,
  previousSet,
  isBarbellExercise,
  onChange,
  onRemove,
}: SetRowProps) {
  const [isNoteOpen, setIsNoteOpen] = useState(Boolean(set.note));
  const weightType = set.weightType ?? "weight";
  const setLabel = set.isWarmup ? "W" : setNumber.toString();
  const accessibleSetLabel = set.isWarmup ? "warm-up set" : `set ${setNumber}`;
  const completedClass = set.completed
    ? set.isWarmup
      ? "bg-amber-50"
      : "bg-emerald-50"
    : "bg-white";

  function updateWeightType(nextType: WeightType) {
    onChange({
      ...set,
      weightType: nextType,
      weight: nextType === "weight" || nextType === "assistance" ? set.weight : 0,
      band: nextType === "band" ? set.band ?? bandOptions[0] : undefined,
      includesBarWeight:
        nextType === "weight" && isBarbellExercise
          ? set.includesBarWeight ?? true
          : undefined,
      barWeight:
        nextType === "weight" && isBarbellExercise ? set.barWeight : undefined,
      isPR: false,
    });
  }

  return (
    <div className={`rounded-2xl border border-slate-100 ${completedClass}`}>
      <div className="grid grid-cols-[2.25rem_1fr_2.25rem_2.25rem_2.25rem] items-center gap-1.5 p-2 pb-1">
        <button
          type="button"
          aria-label={
            set.isWarmup
              ? `Set ${setNumber} is a warm-up. Tap for working set.`
              : `Set ${setNumber} is a working set. Tap for warm-up.`
          }
          onClick={() => {
            const nextIsWarmup = !set.isWarmup;
            onChange({
              ...set,
              isWarmup: nextIsWarmup,
              isPR: false,
              ...(nextIsWarmup ? { rir: undefined } : {}),
            });
          }}
          className={`flex h-9 items-center justify-center rounded-xl text-sm font-black ${
            set.isWarmup
              ? "bg-amber-100 text-amber-600"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {setLabel}
        </button>

        <div className="min-w-0 text-center px-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Previous
          </p>
          <p className="text-xs font-semibold text-slate-500 whitespace-normal break-words leading-tight">
            {formatPreviousSet(previousSet)}
          </p>
        </div>

        <button
          type="button"
          aria-label={`Add note to ${accessibleSetLabel}`}
          onClick={() => setIsNoteOpen((current) => !current)}
          className={`flex h-9 items-center justify-center rounded-xl ${
            set.note
              ? "bg-blue-50 text-blue-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          <MessageSquare size={16} />
        </button>

        <button
          type="button"
          aria-label={`Delete ${accessibleSetLabel}`}
          onClick={onRemove}
          className="flex h-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
        >
          <Trash2 size={16} />
        </button>

        <button
          type="button"
          aria-label={`Complete ${accessibleSetLabel}`}
          onClick={() => onChange({ ...set, completed: !set.completed })}
          className={`flex h-9 items-center justify-center rounded-xl ${
            set.completed
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          <Check size={18} strokeWidth={3} />
        </button>
      </div>

      <div className="grid grid-cols-[1fr_5rem] gap-2 px-2 pb-2">
        <label className="sr-only" htmlFor={`${set.id}-weight-type`}>
          Weight type
        </label>
        <select
          id={`${set.id}-weight-type`}
          value={weightType}
          onChange={(event) => updateWeightType(event.target.value as WeightType)}
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-2 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          {Object.entries(weightTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor={`${set.id}-reps`}>
          Reps
        </label>
        <input
          id={`${set.id}-reps`}
          inputMode="numeric"
          pattern="[0-9]*"
          type="text"
          placeholder="reps"
          value={set.reps || ""}
          onChange={(event) =>
            onChange({ ...set, reps: numberFromInput(event.target.value) })
          }
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-2 text-center font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {weightType === "weight" || weightType === "assistance" ? (
        <div className="space-y-2 px-2 pb-2">
          <div className={set.isWarmup ? "" : "grid grid-cols-[1fr_5rem] gap-2"}>
            <label className="sr-only" htmlFor={`${set.id}-weight`}>
              Pounds
            </label>
            <input
              id={`${set.id}-weight`}
              inputMode="decimal"
              pattern="[0-9]*"
              type="text"
              placeholder={weightType === "assistance" ? "-lbs" : "lbs"}
              value={set.weight || ""}
              onChange={(event) =>
                onChange({
                  ...set,
                  weight: numberFromInput(event.target.value),
                  isPR: false,
                })
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-center font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            {!set.isWarmup && (
              <>
                <label className="sr-only" htmlFor={`${set.id}-rir`}>
                  Reps in reserve
                </label>
                <input
                  id={`${set.id}-rir`}
                  inputMode="decimal"
                  pattern="[0-9]*"
                  type="text"
                  placeholder="RIR"
                  value={set.rir ?? ""}
                  onChange={(event) =>
                    onChange({
                      ...set,
                      rir: optionalNumberFromInput(event.target.value),
                    })
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-2 text-center font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </>
            )}
          </div>
          {weightType === "weight" && isBarbellExercise ? (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-2">
              <label className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700">
                <span>Includes bar weight</span>
                <input
                  type="checkbox"
                  checked={set.includesBarWeight ?? true}
                  onChange={(event) =>
                    onChange({
                      ...set,
                      includesBarWeight: event.target.checked,
                      barWeight: undefined,
                      isPR: false,
                    })
                  }
                  className="h-5 w-5 rounded border-slate-300 text-blue-600"
                />
              </label>
            </div>
          ) : null}
        </div>
      ) : null}

      {weightType === "band" ? (
        <div className={set.isWarmup ? "px-2 pb-2" : "grid grid-cols-[1fr_5rem] gap-2 px-2 pb-2"}>
          <label className="sr-only" htmlFor={`${set.id}-band`}>
            Band
          </label>
          <select
            id={`${set.id}-band`}
            value={set.band ?? bandOptions[0]}
            onChange={(event) =>
              onChange({
                ...set,
                band: event.target.value as BandOption,
                weight: 0,
                isPR: false,
              })
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {bandOptions.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>
          {!set.isWarmup && (
            <>
              <label className="sr-only" htmlFor={`${set.id}-band-rir`}>
                Reps in reserve
              </label>
              <input
                id={`${set.id}-band-rir`}
                inputMode="decimal"
                pattern="[0-9]*"
                type="text"
                placeholder="RIR"
                value={set.rir ?? ""}
                onChange={(event) =>
                  onChange({
                    ...set,
                    rir: optionalNumberFromInput(event.target.value),
                  })
                }
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-2 text-center font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </>
          )}
        </div>
      ) : null}

      {weightType === "bodyweight" && !set.isWarmup ? (
        <div className="px-2 pb-2">
          <label className="sr-only" htmlFor={`${set.id}-bodyweight-rir`}>
            Reps in reserve
          </label>
          <input
            id={`${set.id}-bodyweight-rir`}
            inputMode="decimal"
            pattern="[0-9]*"
            type="text"
            placeholder="RIR"
            value={set.rir ?? ""}
            onChange={(event) =>
              onChange({
                ...set,
                rir: optionalNumberFromInput(event.target.value),
              })
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-center font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      ) : null}

      {isNoteOpen ? (
        <div className="border-t border-slate-100 p-2 pt-0">
          <label className="sr-only" htmlFor={`${set.id}-note`}>
            Set note
          </label>
          <input
            id={`${set.id}-note`}
            type="text"
            placeholder="Set note"
            value={set.note ?? ""}
            onChange={(event) => onChange({ ...set, note: event.target.value })}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      ) : null}

      {set.isPR ? (
        <div className="border-t border-blue-100 px-3 pb-2 text-xs font-bold text-blue-600">
          New PR
        </div>
      ) : null}
    </div>
  );
}
