import {
  muscleGroups,
  type ExerciseEntry,
  type MuscleGroup,
  type PRRecord,
  type SetEntry,
  type Workout,
} from "@/types/workout";
import { findCatalogExercise } from "@/lib/exerciseCatalog";

export type MuscleGroupTargetRange = {
  min: number;
  max: number;
};

export type MuscleGroupTargetStatus = {
  status: "below" | "in-range" | "above";
  label: "Below target" | "In range" | "Above target";
};

export const muscleGroupWeeklyTargets: Record<MuscleGroup, MuscleGroupTargetRange> = {
  Chest: { min: 6, max: 9 },
  Shoulders: { min: 10, max: 13 },
  "Mid-Back": { min: 9, max: 12 },
  Lats: { min: 6, max: 9 },
  Biceps: { min: 6, max: 9 },
  Triceps: { min: 6, max: 9 },
  Forearms: { min: 6, max: 9 },
  Quads: { min: 8, max: 11 },
  Hamstrings: { min: 4, max: 7 },
  "Glutes/Hips": { min: 9, max: 12 },
  Calves: { min: 4, max: 7 },
  Abs: { min: 4, max: 7 },
};

export function normalizeMuscleGroup(
  group: string | null | undefined,
): MuscleGroup | undefined {
  if (!group) {
    return undefined;
  }

  if (group === "Back") {
    return "Mid-Back";
  }

  if (group === "Glutes") {
    return "Glutes/Hips";
  }

  return muscleGroups.includes(group as MuscleGroup)
    ? (group as MuscleGroup)
    : undefined;
}

export function getSetWeightType(set: SetEntry) {
  return set.weightType ?? "weight";
}

export function isHardSet(set: SetEntry) {
  return set.completed && !set.isWarmup;
}

export function countsTowardWeightMetrics(set: SetEntry) {
  return (
    set.completed &&
    !set.isWarmup &&
    getSetWeightType(set) === "weight" &&
    getEffectiveSetWeight(set) > 0 &&
    set.reps > 0
  );
}

export function getEffectiveSetWeight(set: SetEntry) {
  if (getSetWeightType(set) !== "weight") {
    return 0;
  }

  if (set.includesBarWeight === false) {
    return set.weight + (set.barWeight ?? 0);
  }

  return set.weight;
}

export function estimateOneRepMax(weight: number, reps: number) {
  if (weight <= 0 || reps <= 0) {
    return 0;
  }

  const estimate =
    reps <= 6 ? weight * (36 / (37 - reps)) : weight * (1 + reps / 30);

  return Math.round(estimate * 10) / 10;
}

function getDaysAgo(days: number, referenceDate = new Date()) {
  const date = new Date(referenceDate);
  date.setDate(referenceDate.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getTrailingSevenDayWorkouts(
  workouts: Workout[],
  referenceDate = new Date(),
) {
  const startDate = getDaysAgo(6, referenceDate);

  return workouts.filter((workout) => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= startDate && workoutDate <= referenceDate;
  });
}

export function calculateWorkoutVolume(exercises: ExerciseEntry[]) {
  return exercises.reduce((workoutTotal, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      if (!countsTowardWeightMetrics(set)) {
        return setTotal;
      }

      return setTotal + getEffectiveSetWeight(set) * set.reps;
    }, 0);

    return workoutTotal + exerciseVolume;
  }, 0);
}

export function calculateWorkoutHardSetCount(workout: Workout) {
  return workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.filter(isHardSet).length,
    0,
  );
}

export function getWorkoutMuscleGroups(workout: Workout) {
  const groups = workout.exercises.flatMap(getExerciseMuscleGroups);

  return Array.from(new Set(groups));
}

function getExerciseMuscleGroups(exercise: ExerciseEntry) {
  const catalogEntry = findCatalogExercise(exercise.name);
  const primaryMuscleGroup = normalizeMuscleGroup(
    exercise.primaryMuscleGroup ?? catalogEntry?.primaryMuscleGroup,
  );
  const additionalPrimaryMuscleGroup = normalizeMuscleGroup(
    exercise.additionalPrimaryMuscleGroup ??
      catalogEntry?.additionalPrimaryMuscleGroup,
  );

  return [primaryMuscleGroup, additionalPrimaryMuscleGroup].filter(
    (group, index, groups): group is MuscleGroup =>
      Boolean(group) && groups.indexOf(group) === index,
  );
}

export function calculateExercisePRs(workouts: Workout[]) {
  const bestByExercise: Record<string, PRRecord> = {};

  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (!countsTowardWeightMetrics(set)) {
          return;
        }

        const effectiveWeight = getEffectiveSetWeight(set);
        const estimatedOneRepMax = estimateOneRepMax(effectiveWeight, set.reps);
        const currentBest = bestByExercise[exercise.name];

        if (!currentBest || estimatedOneRepMax > currentBest.estimatedOneRepMax) {
          bestByExercise[exercise.name] = {
            id: `${workout.id}-${exercise.id}-${set.id}`,
            exerciseName: exercise.name,
            weight: effectiveWeight,
            reps: set.reps,
            estimatedOneRepMax,
            date: workout.date,
          };
        }
      });
    });
  });

  return Object.values(bestByExercise).sort((a, b) =>
    a.exerciseName.localeCompare(b.exerciseName),
  );
}

export function calculateWeeklyWorkoutCount(
  workouts: Workout[],
  referenceDate = new Date(),
) {
  return getTrailingSevenDayWorkouts(workouts, referenceDate).length;
}

export function calculateMuscleGroupTargetStatus(
  hardSets: number,
  target: MuscleGroupTargetRange,
): MuscleGroupTargetStatus {
  if (hardSets < target.min) {
    return { status: "below", label: "Below target" };
  }

  if (hardSets > target.max) {
    return { status: "above", label: "Above target" };
  }

  return { status: "in-range", label: "In range" };
}

export function calculateHardSetsByMuscleGroup(
  workouts: Workout[],
  referenceDate = new Date(),
) {
  const totals = new Map<MuscleGroup, number>(
    muscleGroups.map((group) => [group, 0]),
  );

  getTrailingSevenDayWorkouts(workouts, referenceDate).forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const muscleGroups = getExerciseMuscleGroups(exercise);

      if (!muscleGroups.length) {
        return;
      }

      const hardSets = exercise.sets.filter(isHardSet).length;
      muscleGroups.forEach((group) => {
        totals.set(group, (totals.get(group) ?? 0) + hardSets);
      });
    });
  });

  return muscleGroups.map((group) => {
    const hardSets = totals.get(group) ?? 0;
    const target = muscleGroupWeeklyTargets[group];
    const targetStatus = calculateMuscleGroupTargetStatus(hardSets, target);

    return {
      group,
      hardSets,
      target,
      ...targetStatus,
    };
  });
}

export function calculateTopMuscleGroupThisWeek(
  workouts: Workout[],
  referenceDate = new Date(),
) {
  return [...calculateHardSetsByMuscleGroup(workouts, referenceDate)].sort(
    (a, b) => b.hardSets - a.hardSets,
  )[0];
}

export function calculateTotalHardSetsThisWeek(
  workouts: Workout[],
  referenceDate = new Date(),
) {
  return getTrailingSevenDayWorkouts(workouts, referenceDate).reduce(
    (total, workout) =>
      total +
      workout.exercises.reduce(
        (exerciseTotal, exercise) =>
          exerciseTotal + exercise.sets.filter(isHardSet).length,
        0,
      ),
    0,
  );
}

export function findPreviousBest(
  workouts: Workout[],
  exerciseName: string,
): PRRecord | undefined {
  return calculateExercisePRs(workouts).find(
    (pr) => pr.exerciseName.toLowerCase() === exerciseName.toLowerCase(),
  );
}

export function findPreviousSets(
  workouts: Workout[],
  exerciseName: string,
): SetEntry[] {
  const previousWorkout = workouts.find((workout) =>
    workout.exercises.some(
      (exercise) => exercise.name.toLowerCase() === exerciseName.toLowerCase(),
    ),
  );

  return (
    previousWorkout?.exercises.find(
      (exercise) => exercise.name.toLowerCase() === exerciseName.toLowerCase(),
    )?.sets ?? []
  );
}

export function findAllPreviousSets(
  workouts: Workout[],
  exerciseName: string,
): { date: string; sets: SetEntry[] }[] {
  const normalizedName = exerciseName.toLowerCase();
  return workouts
    .filter((workout) =>
      workout.exercises.some(
        (exercise) => exercise.name.toLowerCase() === normalizedName,
      ),
    )
    .map((workout) => {
      const exercise = workout.exercises.find(
        (ex) => ex.name.toLowerCase() === normalizedName,
      );
      return {
        date: workout.date,
        sets: exercise?.sets ?? [],
      };
    });
}

export function findNewPRs(
  exercises: ExerciseEntry[],
  savedWorkouts: Workout[],
  workoutDate: string,
) {
  const newPRs: PRRecord[] = [];

  exercises.forEach((exercise) => {
    let bestBefore = findPreviousBest(savedWorkouts, exercise.name);

    exercise.sets.forEach((set) => {
      const effectiveWeight = getEffectiveSetWeight(set);
      const estimatedOneRepMax = estimateOneRepMax(effectiveWeight, set.reps);

      if (
        countsTowardWeightMetrics(set) &&
        estimatedOneRepMax > 0 &&
        (!bestBefore || estimatedOneRepMax > bestBefore.estimatedOneRepMax)
      ) {
        const pr = {
          id: `${exercise.id}-${set.id}`,
          exerciseName: exercise.name,
          weight: effectiveWeight,
          reps: set.reps,
          estimatedOneRepMax,
          date: workoutDate,
        };

        newPRs.push(pr);
        bestBefore = pr;
      }
    });
  });

  return newPRs;
}

export function getRecentPRs(workouts: Workout[]) {
  const bestByExercise: Record<string, PRRecord> = {};
  const prs: PRRecord[] = [];

  [...workouts]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          if (!countsTowardWeightMetrics(set)) {
            return;
          }

          const effectiveWeight = getEffectiveSetWeight(set);
          const estimatedOneRepMax = estimateOneRepMax(effectiveWeight, set.reps);
          const currentBest = bestByExercise[exercise.name];

          if (
            estimatedOneRepMax > 0 &&
            (!currentBest || estimatedOneRepMax > currentBest.estimatedOneRepMax)
          ) {
            const pr = {
              id: `${workout.id}-${exercise.id}-${set.id}`,
              exerciseName: exercise.name,
              weight: effectiveWeight,
              reps: set.reps,
              estimatedOneRepMax,
              date: workout.date,
            };

            bestByExercise[exercise.name] = pr;
            prs.push(pr);
          }
        });
      });
    });

  return prs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function calculateRecentPRCount(
  workouts: Workout[],
  days = 30,
  referenceDate = new Date(),
) {
  const cutoff = getDaysAgo(days, referenceDate);

  return getRecentPRs(workouts).filter((pr) => new Date(pr.date) >= cutoff)
    .length;
}

export function groupWorkoutsByWeek(workouts: Workout[]) {
  const weeks: Record<
    string,
    { key: string; label: string; count: number; volume: number }
  > = {};

  workouts.forEach((workout) => {
    const date = new Date(workout.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const key = weekStart.toISOString();
    const label = weekStart.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

    weeks[key] ??= { key, label, count: 0, volume: 0 };
    weeks[key].count += 1;
    weeks[key].volume += workout.totalVolume;
  });

  return Object.values(weeks).sort(
    (a, b) => new Date(a.key).getTime() - new Date(b.key).getTime(),
  );
}

export function getWorkoutWeeks(workouts: Workout[], weekCount = 8) {
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

  return Array.from({ length: weekCount }, (_, index) => {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() - (weekCount - 1 - index) * 7);
    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(weekStart.getDate() + 7);

    const weekWorkouts = workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= weekStart && workoutDate < nextWeekStart;
    });

    return {
      key: weekStart.toISOString(),
      label: weekStart.toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
      }),
      count: weekWorkouts.length,
    };
  });
}

export function getCurrentWeekMuscleGroupVolume(workouts: Workout[]) {
  const totals = new Map<MuscleGroup, number>(
    muscleGroups.map((group) => [group, 0]),
  );

  getTrailingSevenDayWorkouts(workouts).forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const muscleGroups = getExerciseMuscleGroups(exercise);

      if (!muscleGroups.length) {
        return;
      }

      const exerciseVolume = exercise.sets.reduce((sum, set) => {
        if (!countsTowardWeightMetrics(set)) {
          return sum;
        }

        return sum + getEffectiveSetWeight(set) * set.reps;
      }, 0);

      muscleGroups.forEach((group) => {
        totals.set(group, (totals.get(group) ?? 0) + exerciseVolume);
      });
    });
  });

  return muscleGroups.map((group) => ({
    group,
    volume: totals.get(group) ?? 0,
  }));
}

export function calculateMuscleGroupFrequency(
  workouts: Workout[],
  referenceDate = new Date(),
) {
  const stats = new Map<
    MuscleGroup,
    { group: MuscleGroup; hardSets: number; volume: number; sessions: number }
  >(
    muscleGroups.map((group) => [
      group,
      { group, hardSets: 0, volume: 0, sessions: 0 },
    ]),
  );

  getTrailingSevenDayWorkouts(workouts, referenceDate).forEach((workout) => {
    const trainedGroups = new Set<MuscleGroup>();

    workout.exercises.forEach((exercise) => {
      const muscleGroups = getExerciseMuscleGroups(exercise);

      if (!muscleGroups.length) {
        return;
      }

      const hardSets = exercise.sets.filter(isHardSet).length;
      const volume = exercise.sets.reduce((sum, set) => {
        if (!countsTowardWeightMetrics(set)) {
          return sum;
        }

        return sum + getEffectiveSetWeight(set) * set.reps;
      }, 0);

      if (hardSets > 0) {
        muscleGroups.forEach((group) => trainedGroups.add(group));
      }

      muscleGroups.forEach((group) => {
        const groupStats = stats.get(group);

        if (groupStats) {
          groupStats.hardSets += hardSets;
          groupStats.volume += volume;
        }
      });
    });

    trainedGroups.forEach((group) => {
      const groupStats = stats.get(group);

      if (groupStats) {
        groupStats.sessions += 1;
      }
    });
  });

  return muscleGroups.map((group) => stats.get(group) ?? {
    group,
    hardSets: 0,
    volume: 0,
    sessions: 0,
  });
}

export function getExerciseOneRepMaxProgress(
  workouts: Workout[],
  exerciseName: string,
) {
  return [...workouts]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .flatMap((workout) => {
      const exercise = workout.exercises.find(
        (entry) => entry.name.toLowerCase() === exerciseName.toLowerCase(),
      );

      if (!exercise) {
        return [];
      }

      const bestSet = exercise.sets
        .filter(countsTowardWeightMetrics)
        .map((set) => ({
          weight: getEffectiveSetWeight(set),
          reps: set.reps,
          value: estimateOneRepMax(getEffectiveSetWeight(set), set.reps),
        }))
        .sort((a, b) => b.value - a.value)[0];

      if (!bestSet || bestSet.value <= 0) {
        return [];
      }

      return [
        {
          key: `${workout.id}-${exercise.id}`,
          date: workout.date,
          label: new Date(workout.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
          value: bestSet.value,
          weight: bestSet.weight,
          reps: bestSet.reps,
        },
      ];
    });
}

export function calculateBestSetsByRepTarget(
  workouts: Workout[],
  exerciseName: string,
  repTargets = [3, 5, 8, 10],
) {
  return repTargets.map((repTarget) => {
    const bestSet = workouts
      .flatMap((workout) =>
        workout.exercises
          .filter(
            (exercise) =>
              exercise.name.toLowerCase() === exerciseName.toLowerCase(),
          )
          .flatMap((exercise) =>
            exercise.sets
              .filter(
                (set) =>
                  countsTowardWeightMetrics(set) &&
                  set.reps === repTarget,
              )
              .map((set) => ({
                weight: getEffectiveSetWeight(set),
                reps: set.reps,
                date: workout.date,
              })),
          ),
      )
      .sort((a, b) => {
        if (b.weight !== a.weight) {
          return b.weight - a.weight;
        }

        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })[0];

    return {
      repTarget,
      bestSet,
    };
  });
}

export function calculateThirtyDayE1RMChange(
  workouts: Workout[],
  exerciseName: string,
  referenceDate = new Date(),
) {
  const allProgress = getExerciseOneRepMaxProgress(workouts, exerciseName);
  const cutoff = getDaysAgo(30, referenceDate);
  const thirtyDayProgress = allProgress.filter(
    (point) => new Date(point.date) >= cutoff,
  );
  const bestAllTime = [...allProgress].sort((a, b) => b.value - a.value)[0];
  const bestLastThirtyDays = [...thirtyDayProgress].sort(
    (a, b) => b.value - a.value,
  )[0];

  if (thirtyDayProgress.length < 2) {
    return {
      bestAllTime,
      bestLastThirtyDays,
      change: null,
    };
  }

  const first = thirtyDayProgress[0];
  const last = thirtyDayProgress[thirtyDayProgress.length - 1];
  const value = Math.round((last.value - first.value) * 10) / 10;
  const percent =
    first.value > 0 ? Math.round((value / first.value) * 1000) / 10 : 0;

  return {
    bestAllTime,
    bestLastThirtyDays,
    change: {
      value,
      percent,
      start: first,
      end: last,
    },
  };
}
