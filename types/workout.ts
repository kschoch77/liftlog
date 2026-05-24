export const muscleGroups = [
  "Chest",
  "Shoulders",
  "Mid-Back",
  "Lats",
  "Biceps",
  "Triceps",
  "Forearms",
  "Quads",
  "Hamstrings",
  "Glutes/Hips",
  "Calves",
  "Abs",
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
  "Green (Highest)",
  "Red (High)",
  "Orange (Medium-High)",
  "Yellow (Medium-Low)",
  "Turquoise (Low)",
  "Purple (Lowest)",
] as const;

export type BandOption = (typeof bandOptions)[number];

export type SetEntry = {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  isWarmup?: boolean;
  note?: string;
  rir?: number;
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
  additionalPrimaryMuscleGroup?: MuscleGroup;
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

export type WorkoutTemplateFolder = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  folderId?: string;
  exercises: ExerciseEntry[];
  createdAt: string;
  updatedAt: string;
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
