export const muscleGroups = [
  "Chest",
  "Back",
  "Lats",
  "Abs",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
] as const;

export type MuscleGroup = (typeof muscleGroups)[number];

export const weightTypes = [
  "weight",
  "bodyweight",
  "assistance",
  "band",
] as const;

export type WeightType = (typeof weightTypes)[number];

export const bandOptions = [
  "Green (High)",
  "Red (Med/High)",
  "Orange (Med)",
  "Yellow (Med/Low)",
  "Purple (Low)",
] as const;

export type BandOption = (typeof bandOptions)[number];

export type SetEntry = {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  isWarmup?: boolean;
  note?: string;
  isPR?: boolean;
  weightType?: WeightType;
  band?: BandOption;
  includesBarWeight?: boolean;
  barWeight?: number;
};

export type ExerciseEntry = {
  id: string;
  name: string;
  primaryMuscleGroup?: MuscleGroup;
  sets: SetEntry[];
};

export type Workout = {
  id: string;
  date: string;
  exercises: ExerciseEntry[];
  totalVolume: number;
  prsAchieved: PRRecord[];
};

export type WorkoutDraft = {
  exercises: ExerciseEntry[];
  updatedAt: string;
};

export type ActiveWorkoutSession = {
  startedAt: string;
  updatedAt: string;
  exercises: ExerciseEntry[];
};

export type ExerciseHistory = {
  name: string;
  bestSet?: {
    weight: number;
    reps: number;
    estimatedOneRepMax: number;
    date: string;
  };
};

export type PRRecord = {
  id: string;
  exerciseName: string;
  weight: number;
  reps: number;
  estimatedOneRepMax: number;
  date: string;
};
