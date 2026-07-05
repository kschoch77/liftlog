import type { MuscleGroup, WeightType } from "@/types/workout";

export type ExerciseCatalogEntry = {
  name: string;
  primaryMuscleGroup?: MuscleGroup;
  additionalPrimaryMuscleGroup?: MuscleGroup;
  sourceWeightType?: string;
  defaultWeightType: WeightType;
  movementCategory?: string;
  equipment?: string;
};

export const exerciseCatalog: ExerciseCatalogEntry[] = [
  {
    "name": "Ab Crunch",
    "primaryMuscleGroup": "Abs",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Spinal Flexion",
    "equipment": "Free Area"
  },
  {
    "name": "Ab Wheel",
    "primaryMuscleGroup": "Abs",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Anti-extension",
    "equipment": "Free Area"
  },
  {
    "name": "Arnold Press",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Bench"
  },
  {
    "name": "Back Extension",
    "primaryMuscleGroup": "Glutes/Hips",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Hip Extension",
    "equipment": "Bench"
  },
  {
    "name": "Bayesian Cable Bicep Curl",
    "primaryMuscleGroup": "Biceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "BB Back Squat",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Squat",
    "equipment": "Rack"
  },
  {
    "name": "BB Front Squat",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Squat",
    "equipment": "Rack"
  },
  {
    "name": "BB Hip Thrust",
    "primaryMuscleGroup": "Glutes/Hips",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Thrust",
    "equipment": "Bench"
  },
  {
    "name": "BB Reverse Lunge",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Lunge",
    "equipment": "Rack"
  },
  {
    "name": "BB Romanian Deadlift / RDL",
    "primaryMuscleGroup": "Hamstrings",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Hinge",
    "equipment": "Rack"
  },
  {
    "name": "BB Shrug",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shrug",
    "equipment": "Rack"
  },
  {
    "name": "BB Walking Lunge",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Lunge",
    "equipment": "Free Area"
  },
  {
    "name": "Bent-over BB Row",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Rack"
  },
  {
    "name": "Bent-over Single-arm Row",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Bench"
  },
  {
    "name": "Bulgarian Split Squat",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Squat",
    "equipment": "Bench"
  },
  {
    "name": "Cable Bicep Curl",
    "primaryMuscleGroup": "Biceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Chest Fly",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Fly",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Crunch",
    "primaryMuscleGroup": "Abs",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Spinal Flexion",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Glute Kickback",
    "primaryMuscleGroup": "Glutes/Hips",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Lateral Raise / Shoulder Fly",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Abduction",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Rear Delt Fly / Reverse Fly",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": "Mid-Back",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Reverse Fly",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Shrug",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Shrug",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Wrist Curl",
    "primaryMuscleGroup": "Forearms",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Wrist Curl",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Wrist Extension",
    "primaryMuscleGroup": "Forearms",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Wrist Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Cable Y-Raise",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Abduction",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Calf Raise on Leg Press",
    "primaryMuscleGroup": "Calves",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Calf Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Chest-supported Narrow-grip Row",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Chest-supported Narrow-grip Row",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Chest-supported T-Bar Row",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": "Lats",
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Chest-supported Wide-grip Row",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Chest-supported Wide-grip Row",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Chin-up / Supinated Pull-up",
    "primaryMuscleGroup": "Lats",
    "additionalPrimaryMuscleGroup": "Mid-Back",
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Vertical Pull",
    "equipment": "Rack"
  },
  {
    "name": "Close-grip BB Bench Press",
    "primaryMuscleGroup": "Triceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Concentration Curl",
    "primaryMuscleGroup": "Biceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Bench"
  },
  {
    "name": "DB Bicep Curl",
    "primaryMuscleGroup": "Biceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Free Area"
  },
  {
    "name": "DB Hammer Curl",
    "primaryMuscleGroup": "Biceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Free Area"
  },
  {
    "name": "DB Incline Bicep Curl",
    "primaryMuscleGroup": "Biceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Bench"
  },
  {
    "name": "DB Lateral Raise / Shoulder Fly",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Abduction",
    "equipment": "Free Area"
  },
  {
    "name": "DB Pullover",
    "primaryMuscleGroup": "Lats",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Extension",
    "equipment": "Bench"
  },
  {
    "name": "DB Rear Delt Fly / Reverse Fly",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": "Mid-Back",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Reverse Fly",
    "equipment": "Bench"
  },
  {
    "name": "DB Reverse Lunge",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Lunge",
    "equipment": "Free Area"
  },
  {
    "name": "DB Romanian Deadlift / RDL",
    "primaryMuscleGroup": "Hamstrings",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Hinge",
    "equipment": "Rack"
  },
  {
    "name": "DB Shrug",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shrug",
    "equipment": "Free Area"
  },
  {
    "name": "DB Split Squat",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Squat",
    "equipment": "Free Area"
  },
  {
    "name": "DB Walking Lunge",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Lunge",
    "equipment": "Free Area"
  },
  {
    "name": "DB Wrist Curl",
    "primaryMuscleGroup": "Forearms",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Wrist Curl",
    "equipment": "Bench"
  },
  {
    "name": "DB Wrist Extension",
    "primaryMuscleGroup": "Forearms",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Wrist Extension",
    "equipment": "Bench"
  },
  {
    "name": "Deadlift",
    "primaryMuscleGroup": "Glutes/Hips",
    "additionalPrimaryMuscleGroup": "Hamstrings",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Hinge",
    "equipment": "Rack"
  },
  {
    "name": "Decline BB Bench Press",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Decline DB Bench Press",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Decline Machine Chest Press",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Decline Plate-loaded Chest Press",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "EZ Bar Bicep Curl",
    "primaryMuscleGroup": "Biceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Free Area"
  },
  {
    "name": "EZ Bar Preacher Curl",
    "primaryMuscleGroup": "Biceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Bench"
  },
  {
    "name": "Flat BB Bench Press",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Flat DB Bench Press",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Flat DB Chest Fly",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Fly",
    "equipment": "Bench"
  },
  {
    "name": "Flat Machine Chest Press",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Flat Plate-loaded Chest Press",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Glute Bridge",
    "primaryMuscleGroup": "Glutes/Hips",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Hip Thrust",
    "equipment": "Free Area"
  },
  {
    "name": "Goblet Squat",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Kettlebell",
    "defaultWeightType": "weight",
    "movementCategory": "Squat",
    "equipment": "Free Area"
  },
  {
    "name": "Good Morning",
    "primaryMuscleGroup": "Hamstrings",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Hinge",
    "equipment": "Rack"
  },
  {
    "name": "Hack Squat",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Squat",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Hanging Knee Raise",
    "primaryMuscleGroup": "Abs",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Hip Flexion",
    "equipment": "Rack"
  },
  {
    "name": "Hanging Leg Raise",
    "primaryMuscleGroup": "Abs",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Hip Flexion",
    "equipment": "Rack"
  },
  {
    "name": "Incline BB Bench Press",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Incline DB Bench Press",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Bench"
  },
  {
    "name": "Incline DB Y-Raise",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Abduction",
    "equipment": "Bench"
  },
  {
    "name": "Incline Machine Chest Press",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Incline Plate-loaded Chest Press",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Press",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Kelso Shrug - Incline DB",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Extension",
    "equipment": "Bench"
  },
  {
    "name": "Kelso Shrug - Seated Cable",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Kelso Shrug - T-Bar",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Extension",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Leg Curl",
    "primaryMuscleGroup": "Hamstrings",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Knee Curl",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Leg Extension",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Knee Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Lying Leg Curl",
    "primaryMuscleGroup": "Hamstrings",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Knee Curl",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Lying Leg Raise / Dragon Flag",
    "primaryMuscleGroup": "Abs",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Hip Flexion",
    "equipment": "Bench"
  },
  {
    "name": "Machine Crunch",
    "primaryMuscleGroup": "Abs",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Spinal Flexion",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Machine Hip Abduction",
    "primaryMuscleGroup": "Glutes/Hips",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Abduction",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Machine Hip Adduction",
    "primaryMuscleGroup": "Glutes/Hips",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Adduction",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Machine Lateral Raise / Shoulder Fly",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Abduction",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Machine Preacher Curl",
    "primaryMuscleGroup": "Biceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Machine Rear Delt Fly / Reverse Pec Deck",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": "Mid-Back",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Reverse Fly",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Machine Shrug",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Shrug",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Meadows Row",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Rack"
  },
  {
    "name": "Neutral-grip Lat Pull-down",
    "primaryMuscleGroup": "Lats",
    "additionalPrimaryMuscleGroup": "Mid-Back",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Vertical Pull",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Neutral-grip Pull-up",
    "primaryMuscleGroup": "Lats",
    "additionalPrimaryMuscleGroup": "Mid-Back",
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Vertical Pull",
    "equipment": "Rack"
  },
  {
    "name": "Overhead Cable Tricep Extension",
    "primaryMuscleGroup": "Triceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Tricep Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Pec Deck / Machine Chest Fly",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Chest Fly",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Pin-loaded Leg Press",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Leg Press",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Plank",
    "primaryMuscleGroup": "Abs",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Anti-extension",
    "equipment": "Free Area"
  },
  {
    "name": "Plate-loaded Leg Press",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Leg Press",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Push-up",
    "primaryMuscleGroup": "Chest",
    "additionalPrimaryMuscleGroup": "Shoulders",
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Chest Press",
    "equipment": "Free Area"
  },
  {
    "name": "Rope Face Pull",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Seated BB Shoulder Press",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Rack"
  },
  {
    "name": "Seated Calf Raise",
    "primaryMuscleGroup": "Calves",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Calf Extension",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Seated DB Shoulder Press",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Bench"
  },
  {
    "name": "Seated Machine Shoulder Press",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Seated Narrow-grip Cable Row",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Seated Plate-loaded Shoulder Press",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Machine - Plate-loaded"
  },
  {
    "name": "Seated Wide-grip Cable Row",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Single-arm Cable Row",
    "primaryMuscleGroup": "Mid-Back",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Horizontal Row",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Single-Arm Hammer Preacher Curl",
    "primaryMuscleGroup": "Biceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Bench"
  },
  {
    "name": "Single-arm Lat Pull-down / Cable Pull-down",
    "primaryMuscleGroup": "Lats",
    "additionalPrimaryMuscleGroup": "Mid-Back",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Vertical Pull",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Single-Arm Preacher Curl",
    "primaryMuscleGroup": "Biceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Bench"
  },
  {
    "name": "Single-leg Calf Raise on Leg Press",
    "primaryMuscleGroup": "Calves",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Plate",
    "defaultWeightType": "weight",
    "movementCategory": "Calf Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Single-leg Leg Press",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Leg Press",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Single-leg Romanian Deadlift / RDL",
    "primaryMuscleGroup": "Hamstrings",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Hip Hinge",
    "equipment": "Rack"
  },
  {
    "name": "Sissy Squat",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Squat",
    "equipment": "Free Area"
  },
  {
    "name": "Skullcrusher / Lying Tricep Extension",
    "primaryMuscleGroup": "Triceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Tricep Extension",
    "equipment": "Bench"
  },
  {
    "name": "Standing BB Shoulder Press",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Barbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Rack"
  },
  {
    "name": "Standing Calf Raise",
    "primaryMuscleGroup": "Calves",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Calf Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Standing DB Shoulder Press",
    "primaryMuscleGroup": "Shoulders",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Press",
    "equipment": "Free Area"
  },
  {
    "name": "Step-up",
    "primaryMuscleGroup": "Quads",
    "additionalPrimaryMuscleGroup": "Glutes/Hips",
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Lunge",
    "equipment": "Bench"
  },
  {
    "name": "Straight-arm Lat Pull-down",
    "primaryMuscleGroup": "Lats",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Shoulder Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Tricep Pushdown / Extension",
    "primaryMuscleGroup": "Triceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Tricep Extension",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Wide-grip Lat Pull-down",
    "primaryMuscleGroup": "Lats",
    "additionalPrimaryMuscleGroup": "Mid-Back",
    "sourceWeightType": "Stack",
    "defaultWeightType": "weight",
    "movementCategory": "Vertical Pull",
    "equipment": "Machine - Pin-loaded"
  },
  {
    "name": "Wide-grip Pull-up",
    "primaryMuscleGroup": "Lats",
    "additionalPrimaryMuscleGroup": "Mid-Back",
    "sourceWeightType": "Bodyweight",
    "defaultWeightType": "bodyweight",
    "movementCategory": "Vertical Pull",
    "equipment": "Rack"
  },
  {
    "name": "Zottman Bicep Curl",
    "primaryMuscleGroup": "Biceps",
    "additionalPrimaryMuscleGroup": undefined,
    "sourceWeightType": "Dumbbell",
    "defaultWeightType": "weight",
    "movementCategory": "Bicep Curl",
    "equipment": "Free Area"
  }
];

export function findCatalogExercise(name: string): ExerciseCatalogEntry | undefined {
  const lowerName = name.toLowerCase();
  return exerciseCatalog.find(
    (exercise) => exercise.name.toLowerCase() === lowerName,
  );
}
