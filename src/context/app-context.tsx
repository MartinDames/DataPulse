"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ActivityAttachment, DataHealthStore, IncidentStatus } from "@/lib/types";
import { DEMO_STORE } from "@/lib/demo-data";
import { loadStore, resetStore, saveStore } from "@/lib/storage";

type AppContextValue = {
  store: DataHealthStore;
  checksById: Record<string, DataHealthStore["checks"][number]>;
  sourcesById: Record<string, DataHealthStore["dataSources"][number]>;
  updateIncidentStatus: (checkId: string, status: IncidentStatus) => void;
  addActivityNote: (
    checkId: string,
    body: string,
    attachments?: ActivityAttachment[],
  ) => void;
  replaceAll: (next: DataHealthStore) => void;
  resetToDemo: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Mismo snapshot en servidor y primer paint del cliente (evita hydration mismatch).
  const [store, setStore] = useState<DataHealthStore>(DEMO_STORE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStore(loadStore());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveStore({ ...store, updatedAt: new Date().toISOString() });
  }, [store, hydrated]);

  const checksById = useMemo(() => {
    const map: AppContextValue["checksById"] = {};
    for (const c of store.checks) map[c.id] = c;
    return map;
  }, [store.checks]);

  const sourcesById = useMemo(() => {
    const map: AppContextValue["sourcesById"] = {};
    for (const s of store.dataSources) map[s.id] = s;
    return map;
  }, [store.dataSources]);

  const value = useMemo<AppContextValue>(() => {
    function updateIncidentStatus(checkId: string, status: IncidentStatus) {
      setStore((prev) => ({
        ...prev,
        checks: prev.checks.map((c) =>
          c.id === checkId ? { ...c, incidentStatus: status } : c,
        ),
      }));
    }

    function addActivityNote(
      checkId: string,
      body: string,
      attachments?: ActivityAttachment[],
    ) {
      const trimmed = body.trim();
      if (!trimmed && !attachments?.length) return;

      setStore((prev) => ({
        ...prev,
        checks: prev.checks.map((c) => {
          if (c.id !== checkId) return c;
          const note = {
            id: `act-user-${Date.now()}`,
            author: "Vos (demo)",
            role: "user" as const,
            body: trimmed || "Evidencia adjunta.",
            createdAt: new Date().toISOString(),
            ...(attachments?.length ? { attachments } : {}),
          };
          return {
            ...c,
            activity: [...c.activity, note],
            incidentStatus:
              c.incidentStatus === "new" ? "in_progress" : c.incidentStatus,
          };
        }),
      }));
    }

    function replaceAll(next: DataHealthStore) {
      setStore(next);
    }

    function resetToDemo() {
      resetStore();
      setStore(DEMO_STORE);
    }

    return {
      store,
      checksById,
      sourcesById,
      updateIncidentStatus,
      addActivityNote,
      replaceAll,
      resetToDemo,
    };
  }, [checksById, sourcesById, store]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider />");
  return ctx;
}
