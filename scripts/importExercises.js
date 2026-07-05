/* eslint-disable */
const fs = require('fs');
const path = require('path');

// Helper to parse a CSV line, handling quotes correctly
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function run() {
  const rootDir = path.join(__dirname, '..');
  let csvPath = path.join(rootDir, 'exercises.csv.csv');
  if (!fs.existsSync(csvPath)) {
    csvPath = path.join(rootDir, 'exercises.csv');
  }

  if (!fs.existsSync(csvPath)) {
    console.error('Error: exercises.csv or exercises.csv.csv not found in project root!');
    process.exit(1);
  }

  console.log(`Reading exercises from: ${csvPath}`);
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (lines.length === 0) {
    console.error('Error: CSV file is empty!');
    process.exit(1);
  }

  const headers = parseCSVLine(lines[0]);
  console.log('CSV Headers:', headers);

  const nameIdx = headers.indexOf('Exercise Name');
  const primaryMuscleIdx = headers.indexOf('Primary Muscle Group');
  const additionalMuscleIdx = headers.indexOf('Additional Primary Muscle Group');
  const weightTypeIdx = headers.indexOf('Weight Type');
  const movementCategoryIdx = headers.indexOf('Movement Category');
  const equipmentIdx = headers.indexOf('Equipment Type / Area');

  if (nameIdx === -1 || primaryMuscleIdx === -1 || weightTypeIdx === -1) {
    console.error('Error: Required columns not found in CSV! Needs: "Exercise Name", "Primary Muscle Group", "Weight Type"');
    process.exit(1);
  }

  const entries = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < headers.length) {
      // Skip empty or malformed rows
      continue;
    }

    const name = cols[nameIdx];
    if (!name) continue;

    const primaryMuscleGroup = cols[primaryMuscleIdx] || undefined;
    const additionalPrimaryMuscleGroup = cols[additionalMuscleIdx] || undefined;
    const sourceWeightType = cols[weightTypeIdx] || 'Bodyweight';
    
    // Map defaultWeightType based on sourceWeightType
    let defaultWeightType = 'weight';
    if (sourceWeightType.toLowerCase() === 'bodyweight') {
      defaultWeightType = 'bodyweight';
    } else if (sourceWeightType.toLowerCase() === 'band') {
      defaultWeightType = 'band';
    } else if (sourceWeightType.toLowerCase() === 'assistance') {
      defaultWeightType = 'assistance';
    }

    const movementCategory = cols[movementCategoryIdx] || undefined;
    const equipment = cols[equipmentIdx] || undefined;

    entries.push({
      name,
      primaryMuscleGroup,
      additionalPrimaryMuscleGroup,
      sourceWeightType,
      defaultWeightType,
      movementCategory,
      equipment
    });
  }

  console.log(`Parsed ${entries.length} exercises.`);

  // Sort entries alphabetically by name
  entries.sort((a, b) => a.name.localeCompare(b.name));

  // Generate the TypeScript file content
  let tsContent = `import type { MuscleGroup, WeightType } from "@/types/workout";

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
`;

  entries.forEach((entry, idx) => {
    const primaryStr = entry.primaryMuscleGroup ? `"${entry.primaryMuscleGroup}"` : 'undefined';
    const additionalStr = entry.additionalPrimaryMuscleGroup ? `"${entry.additionalPrimaryMuscleGroup}"` : 'undefined';
    const sourceWeightStr = entry.sourceWeightType ? `"${entry.sourceWeightType}"` : 'undefined';
    const defaultWeightStr = `"${entry.defaultWeightType}"`;
    const categoryStr = entry.movementCategory ? `"${entry.movementCategory}"` : 'undefined';
    const equipStr = entry.equipment ? `"${entry.equipment}"` : 'undefined';

    tsContent += `  {
    "name": "${entry.name.replace(/"/g, '\\"')}",
    "primaryMuscleGroup": ${primaryStr},
    "additionalPrimaryMuscleGroup": ${additionalStr},
    "sourceWeightType": ${sourceWeightStr},
    "defaultWeightType": ${defaultWeightStr},
    "movementCategory": ${categoryStr},
    "equipment": ${equipStr}
  }${idx === entries.length - 1 ? '' : ','}\n`;
  });

  tsContent += `];

export function findCatalogExercise(name: string): ExerciseCatalogEntry | undefined {
  const lowerName = name.toLowerCase();
  return exerciseCatalog.find(
    (exercise) => exercise.name.toLowerCase() === lowerName,
  );
}
`;

  const outputPath = path.join(rootDir, 'lib', 'exerciseCatalog.ts');
  fs.writeFileSync(outputPath, tsContent, 'utf-8');
  console.log(`Successfully generated: ${outputPath}`);
}

run();
