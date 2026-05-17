"use client";

import Link from "next/link";
import { ArrowRight, Dumbbell } from "lucide-react";
import { useSyncExternalStore } from "react";
import { CloudSyncCard } from "@/components/CloudSyncCard";
import {
  calculateRecentPRCount,
  calculateTopMuscleGroupThisWeek,
  calculateTotalHardSetsThisWeek,
  calculateWeeklyWorkoutCount,
  calculateWorkoutHardSetCount,
  getWorkoutMuscleGroups,
} from "@/lib/calculations";
import {
  getActiveWorkoutSession,
  getWorkouts,
  subscribeToStorage,
} from "@/lib/storage";
import type { ActiveWorkoutSession, Workout } from "@/types/workout";

const emptyWorkouts: Workout[] = [];
const emptyActiveSession: ActiveWorkoutSession | null = null;

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

function formatWorkoutDate(date: string) {
  const workoutDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (workoutDate.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (workoutDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return workoutDate.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatActiveWorkoutStatus(activeSession: ActiveWorkoutSession | null) {
  if (!activeSession) {
    return "";
  }

  const updatedDate = new Date(activeSession.updatedAt);
  const today = new Date();

  if (updatedDate.toDateString() === today.toDateString()) {
    return "Last edited today";
  }

  return "Workout in progress";
}

function formatWorkoutExercises(workout: Workout) {
  const names = workout.exercises
    .map((exercise) => exercise.name.trim())
    .filter(Boolean)
    .slice(0, 3);

  return names.length ? names.join(", ") : "No exercises logged";
}

function formatWorkoutMuscles(workout: Workout) {
  const muscleGroups = getWorkoutMuscleGroups(workout);

  if (muscleGroups.length) {
    return muscleGroups.slice(0, 3).join(" / ");
  }

  return "Muscle groups not set";
}

function formatWorkoutVolume(workout: Workout) {
  return `${workout.totalVolume.toLocaleString()} lbs`;
}

function buildTrainingSummary({
  workoutCount,
  hardSets,
  recentPRs,
  hasWorkouts,
}: {
  workoutCount: number;
  hardSets: number;
  recentPRs: number;
  hasWorkouts: boolean;
}) {
  if (!hasWorkouts) {
    return "Ready for your first workout?";
  }

  if (workoutCount === 0) {
    return recentPRs > 0
      ? `No workouts this week • ${recentPRs} recent ${pluralize(recentPRs, "PR")}`
      : "No workouts this week";
  }

  return `${workoutCount} ${pluralize(
    workoutCount,
    "workout",
  )} this week • ${hardSets} hard ${pluralize(hardSets, "set")}`;
}

function DashboardMetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="min-h-28 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      {detail ? (
        <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  const workouts = useSyncExternalStore(
    subscribeToStorage,
    getWorkouts,
    () => emptyWorkouts,
  );
  const activeSession = useSyncExternalStore(
    subscribeToStorage,
    getActiveWorkoutSession,
    () => emptyActiveSession,
  );

  const weeklyCount = calculateWeeklyWorkoutCount(workouts);
  const weeklyHardSets = calculateTotalHardSetsThisWeek(workouts);
  const topMuscleGroup = calculateTopMuscleGroupThisWeek(workouts);
  const recentPRCount = calculateRecentPRCount(workouts);
  const recentWorkouts = workouts.slice(0, 5);
  const hasActiveWorkout = Boolean(activeSession);
  const trainingSummary = buildTrainingSummary({
    workoutCount: weeklyCount,
    hardSets: weeklyHardSets,
    recentPRs: recentPRCount,
    hasWorkouts: workouts.length > 0,
  });

  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-5 pb-28">
      <main className="mx-auto max-w-md">
        <header className="pt-2">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            LiftLog
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Good afternoon
          </h1>
          <p className="mt-2 text-base font-semibold text-slate-600">
            {trainingSummary}
          </p>
        </header>

        <Link
          href="/workout"
          className="mt-5 flex min-h-16 items-center justify-between rounded-3xl bg-blue-600 px-5 py-4 text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
              <Dumbbell size={22} />
            </span>
            <span>
              <span className="block text-lg font-black">
                {hasActiveWorkout ? "Resume Workout" : "Start Workout"}
              </span>
              {hasActiveWorkout ? (
                <span className="mt-0.5 block text-sm font-semibold text-blue-100">
                  {formatActiveWorkoutStatus(activeSession)}
                </span>
              ) : null}
            </span>
          </span>
          <ArrowRight size={24} />
        </Link>

        <section className="mt-5">
          <h2 className="sr-only">Quick Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            <DashboardMetricCard
              label="Workouts"
              value={weeklyCount}
              detail="this week"
            />
            <DashboardMetricCard
              label="Hard Sets"
              value={weeklyHardSets}
              detail="this week"
            />
            <DashboardMetricCard
              label="Top Muscle"
              value={topMuscleGroup?.hardSets ? topMuscleGroup.group : "None yet"}
              detail={
                topMuscleGroup?.hardSets
                  ? `${topMuscleGroup.hardSets} hard ${pluralize(
                      topMuscleGroup.hardSets,
                      "set",
                    )}`
                  : "no sets logged"
              }
            />
            <DashboardMetricCard
              label="Recent PRs"
              value={recentPRCount}
              detail="last 30 days"
            />
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight text-slate-950">
              Recent Workouts
            </h2>
            <Link href="/metrics" className="text-sm font-bold text-blue-600">
              Metrics
            </Link>
          </div>

          <div className="mt-3 space-y-3">
            {recentWorkouts.length ? (
              recentWorkouts.map((workout) => {
                const hardSets = calculateWorkoutHardSetCount(workout);
                const prCount = workout.prsAchieved.length;

                return (
                  <Link
                    key={workout.id}
                    href={`/workout/${workout.id}`}
                    className="block rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-blue-100 hover:shadow-md"
                  >
                    <p className="text-sm font-black text-slate-950">
                      {formatWorkoutDate(workout.date)}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-snug text-slate-800">
                      {formatWorkoutExercises(workout)}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                      {formatWorkoutMuscles(workout)}
                    </p>
                    <p className="mt-3 text-sm font-bold text-blue-700">
                      {hardSets} hard {pluralize(hardSets, "set")} •{" "}
                      {formatWorkoutVolume(workout)} • {prCount}{" "}
                      {pluralize(prCount, "PR")}
                    </p>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm font-semibold text-slate-500">
                Your finished workouts will show up here.
              </div>
            )}
          </div>
        </section>

        <CloudSyncCard />
      </main>
    </div>
  );
}
