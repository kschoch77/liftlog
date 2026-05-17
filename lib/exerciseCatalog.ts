import type { MuscleGroup, WeightType } from "@/types/workout";

export type SecondaryMuscleGroup = MuscleGroup | "Forearms";

export type ExerciseCatalogEntry = {
  name: string;
  primaryMuscleGroup?: MuscleGroup;
  secondaryMuscleGroup?: SecondaryMuscleGroup;
  sourceWeightType?: string;
  defaultWeightType: WeightType;
  movementCategory?: string;
  equipment?: string;
};

export const exerciseCatalog = [
  {
    "name": "Ab Crunch",
    "primaryMuscleGroup": "Abs",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Spinal Flexion",
    "equipment": "Free Area"
  },
  {
    "name": "Ab Leg Raise",
    "primaryMuscleGroup": "Abs",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Hip Flexion",
    "equipment": "Rack"
  },
  {
    "name": "Ab Wheel",
    "primaryMuscleGroup": "Abs",
    "secondaryMuscleGroup": "Lats",
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Anti-extension",
    "equipment": "Free Area"
  },
  {
    "name": "Arnold Press",
    "primaryMuscleGroup": "Shoulders",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Bench"
  },
  {
    "name": "Back Extension",
    "primaryMuscleGroup": "Glutes",
    "secondaryMuscleGroup": "Hamstrings",
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Hip Extension",
    "equipment": "Bench"
  },
  {
    "name": "Back Squat",
    "primaryMuscleGroup": "Quads",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Squat",
    "equipment": "Rack"
  },
  {
    "name": "Bayesian Bicep Curl",
    "primaryMuscleGroup": "Biceps",
    "secondaryMuscleGroup": "Forearms",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "BB Hip Thrust",
    "primaryMuscleGroup": "Glutes",
    "secondaryMuscleGroup": "Hamstrings",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Thrust",
    "equipment": "Bench"
  },
  {
    "name": "BB Romanian Deadlift / RDL",
    "primaryMuscleGroup": "Hamstrings",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Hinge",
    "equipment": "Rack"
  },
  {
    "name": "Bent-over BB Row",
    "primaryMuscleGroup": "Back",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Rack"
  },
  {
    "name": "Bent-over Single-arm Row",
    "primaryMuscleGroup": "Back",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Bench"
  },
  {
    "name": "Bulgarian Split Squat",
    "primaryMuscleGroup": "Quads",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Squat",
    "equipment": "Bench"
  },
  {
    "name": "Cable Bicep Curl",
    "primaryMuscleGroup": "Biceps",
    "secondaryMuscleGroup": "Forearms",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Chest Fly",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Fly",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Crunch",
    "primaryMuscleGroup": "Abs",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Spinal Flexion",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Glute Kickback",
    "primaryMuscleGroup": "Glutes",
    "secondaryMuscleGroup": "Hamstrings",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Lateral Raise",
    "primaryMuscleGroup": "Shoulders",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Abduction",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Rear Delt Fly",
    "primaryMuscleGroup": "Shoulders",
    "secondaryMuscleGroup": "Back",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Reverse Fly",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Calf Raise on Leg Press",
    "primaryMuscleGroup": "Calves",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Calf Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Chest-supported Narrow-grip Row",
    "primaryMuscleGroup": "Back",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Chest-supported Wide-grip Row",
    "primaryMuscleGroup": "Back",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Chin-up",
    "primaryMuscleGroup": "Lats",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Vertical Pull",
    "equipment": "Rack"
  },
  {
    "name": "Close-grip BB Bench Press",
    "primaryMuscleGroup": "Triceps",
    "secondaryMuscleGroup": "Chest",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Concentration Curl",
    "primaryMuscleGroup": "Biceps",
    "secondaryMuscleGroup": "Forearms",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Bench"
  },
  {
    "name": "DB Bicep Curl",
    "primaryMuscleGroup": "Biceps",
    "secondaryMuscleGroup": "Forearms",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Free Area"
  },
  {
    "name": "DB Incline Bicep Curl",
    "primaryMuscleGroup": "Biceps",
    "secondaryMuscleGroup": "Forearms",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Bench"
  },
  {
    "name": "DB Pullover",
    "primaryMuscleGroup": "Lats",
    "secondaryMuscleGroup": "Chest",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Extension",
    "equipment": "Bench"
  },
  {
    "name": "DB Romanian Deadlift / RDL",
    "primaryMuscleGroup": "Hamstrings",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Hinge",
    "equipment": "Rack"
  },
  {
    "name": "DB Split Squat",
    "primaryMuscleGroup": "Quads",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Squat",
    "equipment": "Free Area"
  },
  {
    "name": "Deadlift",
    "primaryMuscleGroup": "Hamstrings",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Hinge",
    "equipment": "Rack"
  },
  {
    "name": "Decline BB Bench Press",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Decline DB Bench Press",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Decline Machine Chest Press",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Decline Plate-loaded Chest Press",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "EZ Bar Bicep Curl",
    "primaryMuscleGroup": "Biceps",
    "secondaryMuscleGroup": "Forearms",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Free Area"
  },
  {
    "name": "Flat BB Bench Press",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Flat DB Bench Press",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Flat DB Chest Fly",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Fly",
    "equipment": "Bench"
  },
  {
    "name": "Flat Machine Chest Press",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Flat Plate-loaded Chest Press",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Front Squat",
    "primaryMuscleGroup": "Quads",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Squat",
    "equipment": "Rack"
  },
  {
    "name": "Glute Bridge",
    "primaryMuscleGroup": "Glutes",
    "secondaryMuscleGroup": "Hamstrings",
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Hip Thrust",
    "equipment": "Free Area"
  },
  {
    "name": "Goblet Squat",
    "primaryMuscleGroup": "Quads",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Kettlebell",
    "defaultWeightType": "weight",
    "movementCategory": "Squat",
    "equipment": "Free Area"
  },
  {
    "name": "Good Morning",
    "primaryMuscleGroup": "Hamstrings",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Hinge",
    "equipment": "Rack"
  },
  {
    "name": "Hack Squat",
    "primaryMuscleGroup": "Quads",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Squat",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Hammer Curl",
    "primaryMuscleGroup": "Biceps",
    "secondaryMuscleGroup": "Forearms",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Free Area"
  },
  {
    "name": "Hanging Knee Raise",
    "primaryMuscleGroup": "Abs",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Hip Flexion",
    "equipment": "Rack"
  },
  {
    "name": "Incline BB Bench Press",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Incline DB Bench Press",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Incline Machine Chest Press",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Incline Plate-loaded Chest Press",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Lateral Raise / Shoulder Fly",
    "primaryMuscleGroup": "Shoulders",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Abduction",
    "equipment": "Free Area"
  },
  {
    "name": "Leg Curl",
    "primaryMuscleGroup": "Hamstrings",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Knee Curl",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Leg Extension",
    "primaryMuscleGroup": "Quads",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Knee Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Lying Leg Curl",
    "primaryMuscleGroup": "Hamstrings",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Knee Curl",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Machine Hip Abduction",
    "primaryMuscleGroup": "Glutes",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Abduction",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Machine Hip Adduction",
    "primaryMuscleGroup": "Glutes",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Adduction",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Machine Lateral Raise",
    "primaryMuscleGroup": "Shoulders",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Abduction",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Machine Rear Delt Fly",
    "primaryMuscleGroup": "Shoulders",
    "secondaryMuscleGroup": "Back",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Reverse Fly",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Meadows Row",
    "primaryMuscleGroup": "Back",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Rack"
  },
  {
    "name": "Neutral-grip Lat Pull-down",
    "primaryMuscleGroup": "Lats",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Vertical Pull",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Overhead Cable Tricep Extension",
    "primaryMuscleGroup": "Triceps",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Tricep Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Pec Deck Fly",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Fly",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Pin-loaded Leg Press",
    "primaryMuscleGroup": "Quads",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Leg Press",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Plank",
    "primaryMuscleGroup": "Abs",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Anti-extension",
    "equipment": "Free Area"
  },
  {
    "name": "Plate-loaded Leg Press",
    "primaryMuscleGroup": "Quads",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Leg Press",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Preacher Curl",
    "primaryMuscleGroup": "Biceps",
    "secondaryMuscleGroup": "Forearms",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Bench"
  },
  {
    "name": "Pull-up",
    "primaryMuscleGroup": "Lats",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Vertical Pull",
    "equipment": "Rack"
  },
  {
    "name": "Push-up",
    "primaryMuscleGroup": "Chest",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Chest Press",
    "equipment": "Free Area"
  },
  {
    "name": "Reverse Lunge",
    "primaryMuscleGroup": "Quads",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Lunge",
    "equipment": "Free Area"
  },
  {
    "name": "Rope Face Pull",
    "primaryMuscleGroup": "Shoulders",
    "secondaryMuscleGroup": "Back",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Seated BB Shoulder Press",
    "primaryMuscleGroup": "Shoulders",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Rack"
  },
  {
    "name": "Seated Calf Raise",
    "primaryMuscleGroup": "Calves",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Calf Extension",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Seated DB Shoulder Press",
    "primaryMuscleGroup": "Shoulders",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Bench"
  },
  {
    "name": "Seated Machine Shoulder Press",
    "primaryMuscleGroup": "Shoulders",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Seated Narrow-grip Cable Row",
    "primaryMuscleGroup": "Back",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Seated Plate-loaded Shoulder Press",
    "primaryMuscleGroup": "Shoulders",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Seated Wide-grip Cable Row",
    "primaryMuscleGroup": "Back",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Single-arm Cable Row",
    "primaryMuscleGroup": "Back",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Single-arm Lat Pull-down",
    "primaryMuscleGroup": "Lats",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Vertical Pull",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Single-leg Leg Press",
    "primaryMuscleGroup": "Quads",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Leg Press",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Single-leg Romanian Deadlift / RDL",
    "primaryMuscleGroup": "Hamstrings",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Hinge",
    "equipment": "Rack"
  },
  {
    "name": "Skullcrusher / Lying Tricep Extension",
    "primaryMuscleGroup": "Triceps",
    "secondaryMuscleGroup": "Lats",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Tricep Extension",
    "equipment": "Bench"
  },
  {
    "name": "Standing BB Shoulder Press",
    "primaryMuscleGroup": "Shoulders",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Rack"
  },
  {
    "name": "Standing Calf Raise",
    "primaryMuscleGroup": "Calves",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Calf Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Standing DB Shoulder Press",
    "primaryMuscleGroup": "Shoulders",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Free Area"
  },
  {
    "name": "Step-up",
    "primaryMuscleGroup": "Quads",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Lunge",
    "equipment": "Bench"
  },
  {
    "name": "Straight-arm Lat Pull-down",
    "primaryMuscleGroup": "Lats",
    "secondaryMuscleGroup": "Triceps",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "T-Bar Row",
    "primaryMuscleGroup": "Back",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Tricep Pushdown / Extension",
    "primaryMuscleGroup": "Triceps",
    "secondaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Tricep Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Walking Lunge",
    "primaryMuscleGroup": "Quads",
    "secondaryMuscleGroup": "Glutes",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Lunge",
    "equipment": "Free Area"
  },
  {
    "name": "Wide-grip Lat Pull-down",
    "primaryMuscleGroup": "Lats",
    "secondaryMuscleGroup": "Biceps",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Vertical Pull",
    "equipment": "Machine - Pin-loaded"
  }
] satisfies ExerciseCatalogEntry[];

export const catalogExerciseNames = exerciseCatalog.map((exercise) => exercise.name);

export function findCatalogExercise(name: string) {
  const normalizedName = name.trim().toLowerCase();
  return exerciseCatalog.find((exercise) => exercise.name.toLowerCase() === normalizedName);
}
