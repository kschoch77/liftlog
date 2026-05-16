"use client";

import Link from "next/link";
import { ArrowRight, Dumbbell } from "lucide-react";
import { useSyncExternalStore } from "react";
import { CloudSyncCard } from "@/components/CloudSyncCard";
import { MetricCard } from "@/components/MetricCard";
import {
  calculateWeeklyWorkoutCount,
  getWorkoutMuscleGroups,
} from "@/lib/calculations";
import { getWorkouts, subscribeToStorage } from "@/lib/storage";
import type { Workout } from "@/types/workout";

const emptyWorkouts: Workout[] = [];

function summarizeWorkoutMuscles(workout: Workout) {
  const muscleGroups = getWorkoutMuscleGroups(workout);

  if (muscleGroups.length) {
    return muscleGroups.join(", ");
  }

  return "No groups set";
}

export default function HomePage() {
  const workouts = useSyncExternalStore(
    subscribeToStorage,
    getWorkouts,
    () => emptyWorkouts,
  );

  const weeklyCount = calculateWeeklyWorkoutCount(workouts);
  const recentWorkouts = workouts.slice(0, 5);

  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-5">
      <header className="pt-2">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
          LiftLog
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          Track your next lift.
        </h1>
      </header>

      <Link
        href="/workout"
        className="mt-6 flex h-16 items-center justify-between rounded-3xl bg-blue-600 px-5 text-lg font-bold text-white shadow-lg shadow-blue-200"
      >
        <span className="flex items-center gap-3">
          <Dumbbell size={24} />
          Start Workout
        </span>
        <ArrowRight size={24} />
      </Link>

      <div className="mt-5">
        <MetricCard
          label="Workouts this week"
          value={weeklyCount}
          detail="Sunday through today"
        />
      </div>

      <CloudSyncCard />

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Recent Workouts</h2>
          <Link href="/metrics" className="text-sm font-bold text-blue-600">
            Metrics
          </Link>
        </div>

        <div className="mt-3 space-y-3">
          {recentWorkouts.length ? (
            recentWorkouts.map((workout) => (
              <Link
                key={workout.id}
                href={`/workout/${workout.id}`}
                className="block rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-950">
                      {new Date(workout.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {workout.exercises.map((exercise) => exercise.name).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="max-w-28 text-sm font-bold text-slate-950">
                      {summarizeWorkoutMuscles(workout)}
                    </p>
                    <p className="text-xs font-semibold text-blue-600">
                      {workout.prsAchieved.length} PRs
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-slate-500">
              Your finished workouts will show up here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
