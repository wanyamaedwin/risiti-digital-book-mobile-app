"use client";

import { useSyncExternalStore } from "react";
import {
  firstIncompleteStep,
  needsReceiptBook,
  parseStoredOnboarding,
} from "@/lib/onboarding";
import {
  initialOnboardingState,
  type OnboardingDraft,
  type OnboardingState,
  type OnboardingStep,
} from "@/types/onboarding";

export const ONBOARDING_STORAGE_KEY = "risiti:onboarding:v1";
type Snapshot = { state: OnboardingState; storageAvailable: boolean };
const serverSnapshot: Snapshot = {
  state: initialOnboardingState,
  storageAvailable: true,
};
let snapshot = serverSnapshot;
let initialized = false;
const listeners = new Set<() => void>();
function getSnapshot(): Snapshot {
  if (typeof window === "undefined") return serverSnapshot;
  if (!initialized) {
    initialized = true;
    try {
      snapshot = {
        state: parseStoredOnboarding(
          window.sessionStorage.getItem(ONBOARDING_STORAGE_KEY),
        ),
        storageAvailable: true,
      };
    } catch {
      snapshot = { state: initialOnboardingState, storageAvailable: false };
    }
  }
  return snapshot;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function write(state: OnboardingState, clear = false): void {
  getSnapshot();
  let storageAvailable = snapshot.storageAvailable;
  try {
    if (clear) window.sessionStorage.removeItem(ONBOARDING_STORAGE_KEY);
    else
      window.sessionStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify(state),
      );
  } catch {
    storageAvailable = false;
  }
  snapshot = { state, storageAvailable };
  listeners.forEach((listener) => listener());
}
export function useOnboardingDraft(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}
export function updateOnboardingDraft(patch: Partial<OnboardingDraft>): void {
  const { state } = getSnapshot();
  write({ ...state, completed: false, draft: { ...state.draft, ...patch } });
}
export function goToOnboardingStep(step: OnboardingStep): void {
  const { state } = getSnapshot();
  write({ ...state, step, completed: step === "success" && state.completed });
}
export function finishOnboarding(): boolean {
  const { state } = getSnapshot();
  if (state.completed) return true;
  if (firstIncompleteStep(state.draft) !== "review") return false;
  const draft: OnboardingDraft = {
    ...state.draft,
    name: state.draft.name.trim(),
    template: needsReceiptBook(state.draft) ? state.draft.template : null,
    ...(state.draft.workspaceType === "personal"
      ? { category: "", customCategory: "" }
      : { personalPurpose: "" }),
  };
  write({ ...state, draft, step: "success", completed: true });
  return true;
}
export function startOnboardingOver(): void {
  write(initialOnboardingState, true);
}
