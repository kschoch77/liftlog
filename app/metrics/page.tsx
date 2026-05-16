"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { MetricCard } from "@/components/MetricCard";
import {
  calculateExercisePRs,
  calculateWeeklyWorkoutCount,
  getCurrentWeekMuscleGroupVolume,
  getExerciseOneRepMaxProgress,
  getRecentPRs,
  getWorkoutWeeks,
} from "@/lib/calculations";
import {
  getExerciseNames,
  getWorkouts,
  subscribeToStorage,
} from "@/lib/storage";
import type { Workout } from "@/types/workout";

const emptyWorkouts: Workout[] = [];
const emptyExerciseNames: string[] = [];

type BarPoint = {
  key: string;
  label: string;
  count: number;
};

type LinePoint = {
  key: string;
  label: string;
  value: number;
  weight: number;
  reps: number;
};

function WorkoutsPerWeekChart({ data }: { data: BarPoint[] }) {
  const maxCount = Math.max(1, ...data.map((point) => point.count));

  return (
    <div className="mt-4 h-52">
      <svg viewBox="0 0 320 180" className="h-full w-full" role="img">
        <title>Workouts per week bar chart</title>
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="24"
            x2="304"
            y1={24 + line * 36}
            y2={24 + line * 36}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        {data.map((point, index) => {
          const barWidth = 20;
          const gap = 15;
          const x = 34 + index * (barWidth + gap);
          const height = point.count ? (point.count / maxCount) * 104 : 8;
          const y = 132 - height;

          return (
            <g key={point.key}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={height}
                rx="5"
                fill={index === data.length - 1 ? "#bfdbfe" : "#2563eb"}
              />
              <text
                x={x + barWidth / 2}
                y="158"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#64748b"
              >
                {point.label}
              </text>
              <text
                x={x + barWidth / 2}
                y={Math.max(18, y - 6)}
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                fill="#334155"
              >
                {point.count || ""}
              </text>
            </g>
          );
        })}
      </svg>
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
              <circle cx={point.x} cy={point.y} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
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
        <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50 text-center text-sm font-medium text-slate-500">
          Log completed working sets to chart progress.
        </div>
      )}
    </div>
  );
}

function MuscleGroupVolumeWidget({
  data,
}: {
  data: { group: string; volume: number }[];
}) {
  const activeData = data.filter((item) => item.volume > 0);
  const maxVolume = Math.max(1, ...activeData.map((item) => item.volume));

  return (
    <section className="mt-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black">Volume By Muscle Group</h2>
          <p className="text-sm font-medium text-slate-500">This week</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {activeData.length ? (
          activeData.map((item) => (
            <div key={item.group}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm font-bold">
                <span>{item.group}</span>
                <span className="font-mono text-slate-500">
                  {item.volume.toLocaleString()} lb
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${Math.max(8, (item.volume / maxVolume) * 100)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
            Choose primary muscle groups while logging workouts to fill this in.
          </p>
        )}
      </div>
    </section>
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

  const weeklyCount = calculateWeeklyWorkoutCount(workouts);
  const exercisePRs = useMemo(() => calculateExercisePRs(workouts), [workouts]);
  const recentPRs = getRecentPRs(workouts).slice(0, 5);
  const weeklyStats = getWorkoutWeeks(workouts);
  const muscleGroupVolume = getCurrentWeekMuscleGroupVolume(workouts);
  const topMuscleGroup = [...muscleGroupVolume].sort(
    (a, b) => b.volume - a.volume,
  )[0];
  const selectableExerciseNames =
    exerciseNames.length > 0
      ? exerciseNames
      : exercisePRs.map((pr) => pr.exerciseName);
  const selectedExercise =
    selectedExerciseName || selectableExerciseNames[0] || "";
  const progressData = useMemo(
    () =>
      selectedExercise
        ? getExerciseOneRepMaxProgress(workouts, selectedExercise).slice(-8)
        : [],
    [selectedExercise, workouts],
  );

  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-5">
      <header className="pt-2">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
          Metrics
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Progress snapshot
        </h1>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MetricCard label="This week" value={weeklyCount} detail="workouts" />
        <MetricCard
          label="Top group"
          value={topMuscleGroup?.volume ? topMuscleGroup.group : "-"}
          detail={
            topMuscleGroup?.volume
              ? `${topMuscleGroup.volume.toLocaleString()} lb this week`
              : "no muscle volume yet"
          }
        />
      </div>

      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black">Workouts Per Week</h2>
            <p className="text-sm font-medium text-slate-500">Activity</p>
          </div>
          <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-black text-blue-600">
            {weeklyCount} this week
          </span>
        </div>
        <WorkoutsPerWeekChart data={weeklyStats} />
      </section>

      <MuscleGroupVolumeWidget data={muscleGroupVolume} />

      <section className="mt-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black">
              {selectedExercise || "Exercise Progress"}
            </h2>
            <p className="text-sm font-medium text-slate-500">
              PR Progression as estimated 1RM
            </p>
          </div>
        </div>
        <label className="sr-only" htmlFor="exercise-progress-select">
          Choose exercise
        </label>
        <select
          id="exercise-progress-select"
          value={selectedExercise}
          onChange={(event) => setSelectedExerciseName(event.target.value)}
          className="mt-3 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
        <ExerciseProgressChart data={progressData} />
      </section>

      <section className="mt-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-bold">Estimated 1RM by exercise</h2>
        <div className="mt-3 divide-y divide-slate-100">
          {exercisePRs.length ? (
            exercisePRs.map((pr) => (
              <div key={pr.exerciseName} className="flex justify-between gap-4 py-3">
                <div>
                  <p className="font-bold">{pr.exerciseName}</p>
                  <p className="text-sm text-slate-500">
                    {pr.weight} x {pr.reps}
                  </p>
                </div>
                <p className="font-mono font-black text-blue-600">
                  {pr.estimatedOneRepMax}
                </p>
              </div>
            ))
          ) : (
            <p className="py-3 text-sm text-slate-500">No exercise PRs yet.</p>
          )}
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-bold">Recent PRs</h2>
        <div className="mt-3 divide-y divide-slate-100">
          {recentPRs.length ? (
            recentPRs.map((pr) => (
              <div key={pr.id} className="py-3">
                <p className="font-bold">{pr.exerciseName}</p>
                <p className="text-sm text-slate-500">
                  {pr.weight} x {pr.reps} for {pr.estimatedOneRepMax} est. 1RM
                </p>
              </div>
            ))
          ) : (
            <p className="py-3 text-sm text-slate-500">PRs will appear here.</p>
          )}
        </div>
      </section>
    </div>
  );
}
