# LiftLog

Current version: v1.2

LiftLog is a mobile-first, iPhone-style workout tracker for logging lifts,
reviewing strength progress, and keeping simple evidence-based training metrics.
It stores data locally by default and can optionally sync completed workouts to
Supabase.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- localStorage
- Optional Supabase sync
- Vercel hosting
- GitHub version history

## Core Features

- Home, Workout, and Metrics tabs
- Mobile-first workout flow
- Historical workout editor
- Exercise catalog with custom exercise names
- Local workout history
- Optional cloud sync panel

## Workout Logging

- Add exercises and working sets
- Mark sets complete or incomplete
- Mark warm-up sets
- Track weight, reps, and notes
- Support weight, bodyweight, assistance, and band set types
- Handle bar weight when the entered plate weight excludes the bar
- Recalculate volume and PRs after historical workout edits

## Metrics

The v1.2 Metrics tab is focused on strength and hypertrophy signals:

- Weekly hard sets by muscle group
- Default muscle-group target ranges
- Target status labels: Below target, In range, and Above target
- Training overview cards for workouts, hard sets, top muscle group, and recent PRs
- Strength progression by selected exercise
- Best estimated 1RM all-time and over the last 30 days
- Estimated 1RM progress chart
- Best 3-rep, 5-rep, 8-rep, and 10-rep sets by exercise
- Muscle-group volume and weekly frequency
- Recent PRs

Hard sets are completed non-warm-up working sets. Bodyweight, assistance, band,
and weighted sets count as hard sets. Volume and PR calculations continue to use
the app's existing weight-based eligibility rules.

## Cloud Sync

Cloud sync is optional. When Supabase environment variables are configured,
completed workouts can sync to Supabase. Without Supabase configuration, LiftLog
continues to work locally.

## Local Storage

LiftLog stores workouts, exercise names, drafts, and active workout sessions in
browser localStorage. This keeps the app fast and usable without an account, but
local data is tied to the current browser/device unless cloud sync is enabled.

## Exercise Catalog

The app includes an exercise catalog and also saves custom exercise names. Muscle
group metrics depend on choosing a primary muscle group while logging exercises.

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Use the default Next.js build settings.
4. Add Supabase environment variables only if cloud sync should be enabled.
5. Deploy.

## Limitations and Roadmap

- Muscle-group metrics currently use the selected primary muscle group.
- Weekly target ranges are fixed defaults and are not user-configurable yet.
- Cloud sync focuses on completed workouts.
- Future improvements could include editable target ranges, deload indicators,
  exercise-level volume trends, and richer multi-device conflict handling.
