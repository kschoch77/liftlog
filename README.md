# LiftLog

Current version: v1.7

Live app: https://liftlog-weld.vercel.app/

LiftLog is a mobile-first, iPhone-style workout tracker for logging lifts,
reviewing strength progress, and keeping simple evidence-based training metrics.
It stores data locally by default and can optionally sync completed workouts,
template folders, and workout templates to Supabase.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- localStorage
- Optional Supabase sync
- Vercel hosting
- GitHub version history

## Core Features

- Home dashboard, Start Workout, Templates, and My Metrics tabs
- Mobile-first workout flow
- Saved workout templates and template folders
- Historical workout editor
- Exercise catalog with custom exercise names
- Local workout history
- Optional cloud sync panel

## Workout Logging

- Add exercises and working sets
- Mark sets complete or incomplete
- Mark warm-up sets
- Track weight, reps, RIR, and notes
- Support weight, bodyweight, assistance, and band set types
- Show the bar-weight tracking checkbox only for mapped barbell exercises
- Keep bar-weight tracking as a reminder of how the set weight was logged
- Recalculate volume and PRs after historical workout edits

## Home Dashboard

The Home tab is focused on fast training context:

- Greeting and trailing 7-day training snapshot
- Start Workout or Resume Workout primary action
- Quick metrics for workouts, hard sets, top muscle group, and recent PRs
- Rich recent workout cards with exercises, muscle groups, hard sets, and PR count
- Compact Cloud Sync controls near the bottom of the page

## Templates

The Templates tab is focused on reusable workout structure:

- Create, edit, and delete workout templates
- Save full template details, including exercises, set types, weights, reps,
  RIR, band choices, notes, warm-up status, and muscle groups
- Create folders and assign templates to folders
- Start a workout directly from a saved template
- Leave the LiftLog Templates section ready for future built-in programs

## My Metrics

The My Metrics tab is focused on strength and hypertrophy signals:

- Hard Sets - Trailing 7 Days by muscle group
- Default muscle-group target ranges
- Target status labels: Below target, In range, and Above target
- Training overview cards for workouts, hard sets, top muscle group, and recent PRs
- Strength progression by selected exercise
- Best estimated 1RM all-time and over the last 30 days
- Estimated 1RM progress chart
- Best 3-rep, 5-rep, 8-rep, and 10-rep sets by exercise
- Muscle-group training frequency
- Recent PRs

Hard sets are completed non-warm-up working sets. Bodyweight, assistance, band,
and weighted sets count as hard sets. Volume and PR calculations continue to use
the app's existing weight-based eligibility rules.

Muscle-group set counts include both the primary muscle group and the additional
primary muscle group from the exercise catalog. Weekly stats use the current day
plus the prior six days rather than a calendar week.

## Cloud Sync

Cloud sync is optional. When Supabase environment variables are configured,
completed workouts, template folders, and workout templates can sync to Supabase.
Without Supabase configuration, LiftLog continues to work locally.

## Local Storage

LiftLog stores workouts, exercise names, drafts, active workout sessions,
template folders, and workout templates in browser localStorage. This keeps the
app fast and usable without an account, but local data is tied to the current
browser/device unless cloud sync is enabled.

## Exercise Catalog

The app includes an exercise catalog and also saves custom exercise names. The
catalog is generated from the master exercise workbook, including updated muscle
group names, additional primary muscle group mappings, and weekly target ranges.

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

## Release Process

- Update `package.json`, `package-lock.json`, and this README before pushing a
  new app version.
- Run `npx.cmd tsc --noEmit`, `npm.cmd run lint`, and `npm.cmd run build`.
- Apply any Supabase schema migrations before deploying the production app.
- Commit, tag the version, push to GitHub, and deploy to Vercel.

## Limitations and Roadmap

- Weekly target ranges are fixed defaults and are not user-configurable yet.
- Future improvements could include editable target ranges, deload indicators,
  exercise-level volume trends, and richer multi-device conflict handling.
