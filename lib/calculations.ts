import {
  muscleGroups,
  type ExerciseEntry,
  type MuscleGroup,
  type PRRecord,
  type SetEntry,
  type Workout,
} from "@/types/workout";

export function getSetWeightType(set: SetEntry) {
  return set.weightType ?? "weight";
}

export function countsTowardWeightMetrics(set: SetEntry) {
  return (
    set.completed &&
    !set.isWarmup &&
    getSetWeightType(set) === "weight" &&
    set.weight > 0 &&
    set.reps > 0
  );
}

export function estimateOneRepMax(weight: number, reps: number) {
  if (weight <= 0 || reps <= 0) {
    return 0;
  }

  const estimate =
    reps <= 6 ? weight * (36 / (37 - reps)) : weight * (1 + reps / 30);

  return Math.round(estimate * 10) / 10;
}

export function calculateWorkoutVolume(exercises: ExerciseEntry[]) {
  return exercises.reduce((workoutTotal, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      if (!countsTowardWeightMetrics(set)) {
        return setTotal;
      }

      return setTotal + set.weight * set.reps;
    }, 0);

    return workoutTotal + exerciseVolume;
  }, 0);
}

export function getWorkoutMuscleGroups(workout: Workout) {
  const groups = workout.exercises
    .map((exercise) => exercise.primaryMuscleGroup)
    .filter((group): group is MuscleGroup => Boolean(group));

  return Array.from(new Set(groups));
}

export function calculateExercisePRs(workouts: Workout[]) {
  const bestByExercise: Record<string, PRRecord> = {};

  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (!countsTowardWeightMetrics(set)) {
          return;
        }

        const estimatedOneRepMax = estimateOneRepMax(set.weight, set.reps);
        const currentBest = bestByExercise[exercise.name];

        if (!currentBest || estimatedOneRepMax > currentBest.estimatedOneRepMax) {
          bestByExercise[exercise.name] = {
            id: `${workout.id}-${exercise.id}-${set.id}`,
            exerciseName: exercise.name,
            weight: set.weight,
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

export function calculateWeeklyWorkoutCount(workouts: Workout[]) {
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);
  startOfWeek.setHours(0, 0, 0, 0);

  return workouts.filter((workout) => new Date(workout.date) >= startOfWeek)
    .length;
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

export function findNewPRs(
  exercises: ExerciseEntry[],
  savedWorkouts: Workout[],
  workoutDate: string,
) {
  const newPRs: PRRecord[] = [];

  exercises.forEach((exercise) => {
    let bestBefore = findPreviousBest(savedWorkouts, exercise.name);

    exercise.sets.forEach((set) => {
      const estimatedOneRepMax = estimateOneRepMax(set.weight, set.reps);

      if (
        countsTowardWeightMetrics(set) &&
        estimatedOneRepMax > 0 &&
        (!bestBefore || estimatedOneRepMax > bestBefore.estimatedOneRepMax)
      ) {
        const pr = {
          id: `${exercise.id}-${set.id}`,
          exerciseName: exercise.name,
          weight: set.weight,
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

          const estimatedOneRepMax = estimateOneRepMax(set.weight, set.reps);
          const currentBest = bestByExercise[exercise.name];

          if (
            estimatedOneRepMax > 0 &&
            (!currentBest || estimatedOneRepMax > currentBest.estimatedOneRepMax)
          ) {
            const pr = {
              id: `${workout.id}-${exercise.id}-${set.id}`,
              exerciseName: exercise.name,
              weight: set.weight,
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
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const totals = new Map<MuscleGroup, number>(
    muscleGroups.map((group) => [group, 0]),
  );

  workouts
    .filter((workout) => new Date(workout.date) >= startOfWeek)
    .forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        if (!exercise.primaryMuscleGroup) {
          return;
        }

        const exerciseVolume = exercise.sets.reduce((sum, set) => {
          if (!countsTowardWeightMetrics(set)) {
            return sum;
          }

          return sum + set.weight * set.reps;
        }, 0);

        totals.set(
          exercise.primaryMuscleGroup,
          (totals.get(exercise.primaryMuscleGroup) ?? 0) + exerciseVolume,
        );
      });
    });

  return muscleGroups.map((group) => ({
    group,
    volume: totals.get(group) ?? 0,
  }));
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
          weight: set.weight,
          reps: set.reps,
          value: estimateOneRepMax(set.weight, set.reps),
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
