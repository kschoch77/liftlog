# LiftLog Product Roadmap

This document outlines the product roadmap and architectural evolution planned for LiftLog, organized by logical release phases. These milestones expand the existing core towards customizable training management, resilient offline queuing, and advanced performance visualization.

---

## 🗺 Feature Evolution Timeline

```
  Phase 1: Customization & Program Architect (v1.7)
  ├── User-configurable weekly target ranges
  └── Built-in programs & periodization planners
        │
        ▼
  Phase 2: Resilient Offline Queuing (v1.8)
  ├── Outbox mutation queue (durable offline transactions)
  └── Multi-device synchronization & vector clocks
        │
        ▼
  Phase 3: Hypertrophy & Fatigue Diagnostics (v1.9)
  ├── Deload indicator flags & structural volume tracking
  └── Exercise-level progression analytics & velocity metrics
        │
        ▼
  Phase 4: Shared Training & Ecosystem (v2.0)
  ├── Dynamic workout exports & shareable training logs
  └── Native iOS/Android bindings via PWA or Capacitor
```

---

## 🛠 Detailed Phase Specifications

### Phase 1: Customization & Program Architect (v1.7)
*Focus: Personalization of volumes and template catalog expansion.*

1. **User-Configurable Weekly Target Ranges:**
   * *Problem:* The current target ranges (e.g., 6–9 sets for Chest, 8–11 sets for Quads) are hardcoded defaults in `lib/calculations.ts`. Different lifters require varying volume minimums and maximums based on training age and recovery capabilities.
   * *Solution:* Introduce an "Edit Target Ranges" panel inside the Metrics tab. Persist custom ranges in a new local collection `liftlog.muscleTargets` and sync to a corresponding `user_targets` Supabase table.
   * *Technical Impl:*
     ```typescript
     export type MuscleTargetRange = {
       muscleGroup: MuscleGroup;
       minSets: number;
       maxSets: number;
     };
     ```
2. **Program Catalog & Built-in Templates:**
   * *Problem:* The "LiftLog Templates" section is currently an empty placeholder.
   * *Solution:* Populate this section with pre-compiled, scientific workout routines (e.g., Linear Periodization Push/Pull/Legs, Upper/Lower splits, and beginner full-body strength programs).
   * *Technical Impl:* Develop a static program dictionary containing reusable template trees that users can tap to clone directly into their active folders.

---

### Phase 2: Resilient Offline Queuing & Conflict Resolution (v1.8)
*Focus: Data integrity under poor gym reception conditions.*

1. **Durable Outbox Mutation Queue:**
   * *Problem:* The current cloud synchronization engine runs directly on database tables and assumes the client is online when actions like "Delete Workout" are taken. If a workout is deleted while offline, the local copy is removed, but the cloud copy remains untouched because the delete call fails silently over the network.
   * *Solution:* Implement a local storage transaction queue (`liftlog.syncQueue`). Any database write, update, or deletion adds a transaction task to the queue:
     ```typescript
     type SyncMutation = {
       id: string; // unique event UUID
       timestamp: string;
       action: 'UPSERT_WORKOUT' | 'DELETE_WORKOUT' | 'UPSERT_TEMPLATE' | 'DELETE_TEMPLATE';
       payloadId: string;
       payload?: any; // serialized JSON
     };
     ```
   * *Sync Loop:* When network state changes from offline to online (via `navigator.onLine` and `window.addEventListener('online')`), the system locks the queue, processes mutations in FIFO order, and empties the queue upon success.
2. **Optimistic UI Updates:**
   * Sync transactions execute instantly in local storage to keep the interface fast, and the sync badge displays a "Syncing changes (3 pending)..." state while processing mutations in the background.

---

### Phase 3: Hypertrophy & Fatigue Diagnostics (v1.9)
*Focus: Advanced physiological metric tracking.*

1. **Deload Alerts & Fatigue Diagnostics:**
   * *Problem:* Progressive overload requires systematic recovery. Lifters often train through accumulated central nervous system (CNS) fatigue without realizing they have exceeded their recovery limit.
   * *Solution:* Analyze the trailing 28 days of training logs to generate fatigue feedback.
   * *CNS Fatigue Signals:* Flag a potential deload if:
     * Average RIR (Reps in Reserve) drops to `0` or `1` (constant failure) for 2 consecutive weeks across all major lifts.
     * Calculated Weekly Volume Load drops by $>15\%$ while reported intensity stays identical (signaling output failure).
   * *Actionable Indicator:* Display a subtle, orange "Deload Recommended" card with recovery recommendations.
2. **Granular Exercise-Level Analytics:**
   * *Problem:* Strength metrics are currently aggregated on a high level. Users cannot view specific strength trends for individual custom movements.
   * *Solution:* Introduce an exercise detail dashboard.
   * *Features:*
     * Interactive date-range selectors (30 days, 90 days, 1 year, All-Time).
     * Linear regression trends for Estimated 1RM.
     * Barbell-specific volume ratios (tallying bar-weight versus loaded plate weight).

---

### Phase 4: Shared Training & Ecosystem (v2.0)
*Focus: Growth and cross-platform native execution.*

1. **Dynamic Workout Card Export:**
   * Generate beautiful, custom CSS canvas drawings of completed workouts (summarizing exercises, total volume moved, and PRs) with clean, dark-mode aesthetics for lifters to share on social channels.
2. **Progressive Web App (PWA) & Native Bindings:**
   * Add a complete web app manifest (`manifest.json`) and service worker cache to support offline assets loading in under `100ms`.
   * Enable standalone mobile install prompts, allowing LiftLog to run as a full-screen, chromeless app on iOS and Android devices, mirroring the experience of native apps.
   * Explore packaging the compiled Next.js build using **Capacitor** to deploy directly to the Apple App Store and Google Play Store.
