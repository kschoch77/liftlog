"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  calculateBestSetsByRepTarget,
  calculateExercisePRs,
  calculateHardSetsByMuscleGroup,
  calculateMuscleGroupFrequency,
  calculateRecentPRCount,
  calculateThirtyDayE1RMChange,
  calculateTotalHardSetsThisWeek,
  calculateWeeklyWorkoutCount,
  getExerciseOneRepMaxProgress,
  getRecentPRs,
} from "@/lib/calculations";
import {
  getExerciseNames,
  getWorkouts,
  subscribeToStorage,
} from "@/lib/storage";
import type { Workout } from "@/types/workout";

const emptyWorkouts: Workout[] = [];
const emptyExerciseNames: string[] = [];

type LinePoint = {
  key: string;
  label: string;
  value: number;
  weight: number;
  reps: number;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatSigned(value: number) {
  if (value > 0) {
    return `+${value}`;
  }

  return `${value}`;
}

function SectionCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div>
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950">
          {title}
        </h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function OverviewCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p>
    </div>
  );
}

function ExerciseProgressChart({ data }: { data: LinePoint[] }) {
  const values = data.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = Math.max(1, maxValue - minValue);
  const points = data.map((point, index) => {
    const x = data.length === 1 ? 160 : 32 + (index / (data.length - 1)) * 256;
    const y = 132 - ((point.value - minValue) / range) * 92;
    return { ...point, x, y };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="mt-4 h-56">
      {data.length ? (
        <svg viewBox="0 0 320 190" className="h-full w-full" role="img">
          <title>Estimated 1RM progress line chart</title>
          {[0, 1, 2].map((line) => (
            <line
              key={line}
              x1="28"
              x2="304"
              y1={40 + line * 46}
              y2={40 + line * 46}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          <text x="306" y="43" fontSize="10" fontWeight="700" fill="#64748b">
            {Math.round(maxValue)}
          </text>
          <text x="306" y="134" fontSize="10" fontWeight="700" fill="#64748b">
            {Math.round(minValue)}
          </text>
          {data.length > 1 ? (
            <polyline
              points={polyline}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
          {points.map((point) => (
            <g key={point.key}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#ffffff"
                stroke="#2563eb"
                strokeWidth="3"
              />
              <text
                x={point.x}
                y="166"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#64748b"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      ) : (
        <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50 px-5 text-center text-sm font-medium text-slate-500">
          Log completed weighted working sets to chart estimated 1RM progress.
        </div>
      )}
    </div>
  );
}

function TargetBadge({ status }: { status: "below" | "in-range" | "above" }) {
  const className =
    status === "in-range"
      ? "bg-blue-50 text-blue-700"
      : status === "above"
        ? "bg-sky-50 text-sky-700"
        : "bg-slate-100 text-slate-600";

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-black ${className}`}>
      {status === "in-range"
        ? "In range"
        : status === "above"
          ? "Above target"
          : "Below target"}
    </span>
  );
}

export default function MetricsPage() {
  const [selectedExerciseName, setSelectedExerciseName] = useState("");
  const workouts = useSyncExternalStore(
    subscribeToStorage,
    getWorkouts,
    () => emptyWorkouts,
  );
  const exerciseNames = useSyncExternalStore(
    subscribeToStorage,
    getExerciseNames,
    () => emptyExerciseNames,
  );

  const exercisePRs = useMemo(() => calculateExercisePRs(workouts), [workouts]);
  const selectableExerciseNames =
    exerciseNames.length > 0
      ? exerciseNames
      : exercisePRs.map((pr) => pr.exerciseName);
  const selectedExercise =
    selectedExerciseName || selectableExerciseNames[0] || "";

  const weeklyWorkoutCount = useMemo(
    () => calculateWeeklyWorkoutCount(workouts),
    [workouts],
  );
  const totalHardSets = useMemo(
    () => calculateTotalHardSetsThisWeek(workouts),
    [workouts],
  );
  const hardSetsByMuscleGroup = useMemo(
    () => calculateHardSetsByMuscleGroup(workouts),
    [workouts],
  );
  const topMuscleGroup = [...hardSetsByMuscleGroup].sort(
    (a, b) => b.hardSets - a.hardSets,
  )[0];
  const recentPRCount = useMemo(
    () => calculateRecentPRCount(workouts),
    [workouts],
  );
  const progressData = useMemo(
    () =>
      selectedExercise
        ? getExerciseOneRepMaxProgress(workouts, selectedExercise)
        : [],
    [selectedExercise, workouts],
  );
  const strengthProgression = useMemo(
    () =>
      selectedExercise
        ? calculateThirtyDayE1RMChange(workouts, selectedExercise)
        : { bestAllTime: undefined, bestLastThirtyDays: undefined, change: null },
    [selectedExercise, workouts],
  );
  const bestSets = useMemo(
    () =>
      selectedExercise
        ? calculateBestSetsByRepTarget(workouts, selectedExercise)
        : [],
    [selectedExercise, workouts],
  );
  const volumeFrequency = useMemo(
    () =>
      calculateMuscleGroupFrequency(workouts).filter(
        (item) => item.hardSets > 0 || item.volume > 0 || item.sessions > 0,
      ),
    [workouts],
  );
  const recentPRs = useMemo(() => getRecentPRs(workouts).slice(0, 5), [workouts]);
  const chartData = progressData.slice(-8);
  const hasStrengthData =
    strengthProgression.bestAllTime || strengthProgression.bestLastThirtyDays;

  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-5">
      <header className="pt-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            Metrics
          </p>
          <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-black text-blue-700">
            v1.2
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Lifter dashboard
        </h1>
      </header>

      <section className="mt-5">
        <h2 className="sr-only">Training Overview</h2>
        <div className="grid grid-cols-2 gap-3">
          <OverviewCard
            label="Workouts"
            value={weeklyWorkoutCount}
            detail="this week"
          />
          <OverviewCard
            label="Hard sets"
            value={totalHardSets}
            detail="working sets"
          />
          <OverviewCard
            label="Top group"
            value={topMuscleGroup?.hardSets ? topMuscleGroup.group : "-"}
            detail={
              topMuscleGroup?.hardSets
                ? `${topMuscleGroup.hardSets} sets`
                : "no sets yet"
            }
          />
          <OverviewCard
            label="Recent PRs"
            value={recentPRCount}
            detail="last 30 days"
          />
        </div>
      </section>

      <div className="mt-4">
        <SectionCard title="Weekly Hard Sets" eyebrow="Primary metric">
          <div className="space-y-4">
            {hardSetsByMuscleGroup.map((item) => {
              const width =
                item.hardSets > 0
                  ? Math.min(100, Math.max(6, (item.hardSets / item.target.max) * 100))
                  : 0;

              return (
                <div key={item.group}>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-950">{item.group}</p>
                      <p className="text-xs font-semibold text-slate-500">
                        Target {item.target.min}-{item.target.max} sets
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-lg font-black text-slate-950">
                        {item.hardSets}
                      </p>
                      <TargetBadge status={item.status} />
                    </div>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <div className="mt-4">
        <SectionCard title="Strength Progression" eyebrow="Estimated 1RM">
          <label className="sr-only" htmlFor="exercise-progress-select">
            Choose exercise
          </label>
          <select
            id="exercise-progress-select"
            value={selectedExercise}
            onChange={(event) => setSelectedExerciseName(event.target.value)}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {selectableExerciseNames.length ? (
              selectableExerciseNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))
            ) : (
              <option value="">No exercises yet</option>
            )}
          </select>

          {hasStrengthData ? (
            <>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-500">All-time</p>
                  <p className="mt-1 font-mono text-xl font-black text-slate-950">
                    {strengthProgression.bestAllTime?.value ?? "-"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-500">30 days</p>
                  <p className="mt-1 font-mono text-xl font-black text-slate-950">
                    {strengthProgression.bestLastThirtyDays?.value ?? "-"}
                  </p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-3">
                  <p className="text-xs font-bold text-blue-700">Change</p>
                  <p className="mt-1 font-mono text-xl font-black text-blue-700">
                    {strengthProgression.change
                      ? formatSigned(strengthProgression.change.value)
                      : "-"}
                  </p>
                </div>
              </div>
              {strengthProgression.change ? (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  {formatSigned(strengthProgression.change.percent)}% from{" "}
                  {formatDate(strengthProgression.change.start.date)} to{" "}
                  {formatDate(strengthProgression.change.end.date)}
                </p>
              ) : (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Add another weighted session in the last 30 days to show change.
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
              Choose an exercise with completed weighted working sets to see
              strength progression.
            </p>
          )}

          <ExerciseProgressChart data={chartData} />
        </SectionCard>
      </div>

      <div className="mt-4">
        <SectionCard title="Best Sets" eyebrow={selectedExercise || "Exercise"}>
          <div className="grid grid-cols-2 gap-3">
            {bestSets.length ? (
              bestSets.map((item) => (
                <div key={item.repTarget} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Best {item.repTarget}
                  </p>
                  {item.bestSet ? (
                    <>
                      <p className="mt-2 font-mono text-lg font-black text-slate-950">
                        {item.bestSet.weight} x {item.bestSet.reps}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {formatDate(item.bestSet.date)}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      No data yet
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="col-span-2 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
                Log weighted working sets to see best sets by rep target.
              </p>
            )}
          </div>
        </SectionCard>
      </div>

      <div className="mt-4">
        <SectionCard title="Volume & Frequency" eyebrow="This week">
          <div className="divide-y divide-slate-100">
            {volumeFrequency.length ? (
              volumeFrequency.map((item) => (
                <div
                  key={item.group}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-black text-slate-950">{item.group}</p>
                    <p className="text-xs font-semibold text-slate-500">
                      {item.sessions} session{item.sessions === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-950">
                      {item.hardSets} hard sets
                    </p>
                    <p className="font-mono text-xs font-semibold text-slate-500">
                      {item.volume.toLocaleString()} lb
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
                Finish a workout with muscle groups selected to fill this in.
              </p>
            )}
          </div>
        </SectionCard>
      </div>

      <div className="mt-4">
        <SectionCard title="Recent PRs">
          <div className="divide-y divide-slate-100">
            {recentPRs.length ? (
              recentPRs.map((pr) => (
                <div key={pr.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">{pr.exerciseName}</p>
                      <p className="text-sm font-medium text-slate-500">
                        {pr.weight} x {pr.reps}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-black text-blue-600">
                        {pr.estimatedOneRepMax}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {formatDate(pr.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
                PRs will appear after you beat a previous estimated 1RM.
              </p>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
