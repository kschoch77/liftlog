"use client";

import { Cloud, LogOut, RefreshCw } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
  subscribeToAuth,
  syncWorkouts,
} from "@/lib/cloudSync";
import { isCloudConfigured } from "@/lib/supabase";
import { subscribeToWorkoutHistoryStorage } from "@/lib/storage";

export function CloudSyncCard() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Local mode");
  const [isBusy, setIsBusy] = useState(false);
  const cloudConfigured = isCloudConfigured();

  async function refreshUser() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      const result = await syncWorkouts();
      setMessage(result.message);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshUser();
    }, 0);
    const unsubscribe = subscribeToAuth(() => {
      void refreshUser();
    });

    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return () => {};
    }

    return subscribeToWorkoutHistoryStorage(() => {
      void syncWorkouts().then((result) => setMessage(result.message));
    });
  }, [user]);

  async function handleSignIn(event: FormEvent) {
    event.preventDefault();
    setIsBusy(true);
    const result = await signIn(email, password);
    setMessage(result.message);
    await refreshUser();
    setIsBusy(false);
  }

  async function handleSignUp() {
    setIsBusy(true);
    const result = await signUp(email, password);
    setMessage(result.message);
    await refreshUser();
    setIsBusy(false);
  }

  async function handleSyncNow() {
    setIsBusy(true);
    const result = await syncWorkouts();
    setMessage(result.message);
    setIsBusy(false);
  }

  async function handleSignOut() {
    await signOut();
    setUser(null);
    setMessage("Signed out. Workouts on this device stay local.");
  }

  return (
    <section className="mt-5 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            Cloud Sync
          </p>
          <p className="mt-1 text-sm text-slate-500">{message}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Cloud size={21} />
        </div>
      </div>

      {!cloudConfigured ? (
        <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm font-medium text-amber-800">
          Supabase is not connected yet. Add your project URL and anon key to
          .env.local, then restart the app.
        </p>
      ) : user ? (
        <div className="mt-4 space-y-3">
          <p className="truncate text-sm font-semibold text-slate-700">
            Signed in as {user.email}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSyncNow}
              disabled={isBusy}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-bold text-white disabled:bg-blue-300"
            >
              <RefreshCw size={17} />
              Sync now
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-100 text-sm font-bold text-slate-700"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSignIn} className="mt-4 space-y-3">
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="submit"
              disabled={isBusy || !email || password.length < 6}
              className="h-11 rounded-2xl bg-blue-600 text-sm font-bold text-white disabled:bg-blue-300"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={isBusy || !email || password.length < 6}
              className="h-11 rounded-2xl bg-blue-50 text-sm font-bold text-blue-600 disabled:text-blue-300"
            >
              Create account
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
