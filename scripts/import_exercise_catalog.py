import json
from pathlib import Path

import openpyxl


SOURCE_PATH = Path(r"C:\Users\schoc\Downloads\Exercise List and Mapping (1).xlsx")
OUTPUT_PATH = Path(r"C:\Users\schoc\liftlog\lib\exerciseCatalog.ts")

MUSCLE_GROUP_MAP = {
    "Chest": "Chest",
    "Back": "Back",
    "Lats": "Lats",
    "Abs": "Abs",
    "Delts": "Shoulders",
    "Biceps": "Biceps",
    "Triceps": "Triceps",
    "Quads": "Quads",
    "Hamstrings": "Hamstrings",
    "Glutes/Hips": "Glutes",
    "Calves": "Calves",
}


def text(value):
    if value is None:
        return None
    stripped = str(value).strip()
    return stripped or None


def muscle_group(value):
    value = text(value)
    if value is None:
        return None
    return MUSCLE_GROUP_MAP.get(value)


def default_weight_type(source_weight_type):
    return "bodyweight" if source_weight_type == "Bodyweight" else "weight"


def main():
    workbook = openpyxl.load_workbook(SOURCE_PATH, read_only=True, data_only=True)
    sheet = workbook["Sheet1"]
    rows = []
    seen_names = set()

    for row in sheet.iter_rows(min_row=2, values_only=True):
        name = text(row[0])
        if name is None or name.lower() in seen_names:
            continue

        seen_names.add(name.lower())
        source_weight_type = text(row[12])
        rows.append(
            {
                "name": name,
                "primaryMuscleGroup": muscle_group(row[13]),
                "secondaryMuscleGroup": muscle_group(row[14])
                if len(row) > 14
                else None,
                "sourceWeightType": source_weight_type,
                "defaultWeightType": default_weight_type(source_weight_type),
                "movementCategory": text(row[6]),
                "equipment": text(row[7]),
            }
        )

    rows.sort(key=lambda item: item["name"].lower())
    payload = json.dumps(rows, indent=2)
    payload = payload.replace(": null", ": undefined")

    OUTPUT_PATH.write_text(
        "\n".join(
            [
                'import type { MuscleGroup, WeightType } from "@/types/workout";',
                "",
                "export type ExerciseCatalogEntry = {",
                "  name: string;",
                "  primaryMuscleGroup?: MuscleGroup;",
                "  secondaryMuscleGroup?: MuscleGroup;",
                "  sourceWeightType?: string;",
                "  defaultWeightType: WeightType;",
                "  movementCategory?: string;",
                "  equipment?: string;",
                "};",
                "",
                f"export const exerciseCatalog = {payload} satisfies ExerciseCatalogEntry[];",
                "",
                "export const catalogExerciseNames = exerciseCatalog.map((exercise) => exercise.name);",
                "",
                "export function findCatalogExercise(name: string) {",
                "  const normalizedName = name.trim().toLowerCase();",
                "  return exerciseCatalog.find((exercise) => exercise.name.toLowerCase() === normalizedName);",
                "}",
                "",
            ]
        ),
        encoding="utf-8",
    )

    print(f"Wrote {len(rows)} exercises to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
