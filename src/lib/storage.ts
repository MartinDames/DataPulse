import type { ActivityNote, DataHealthStore, HealthCheck, IncidentStatus } from "@/lib/types";
import {
  DEMO_CHECKS_BY_ID,
  DEMO_STORE,
  defaultIncidentStatus,
} from "@/lib/demo-data";

const STORAGE_KEY = "datapulse-demo-store-v2";

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

type LegacyCheck = HealthCheck & { acknowledged?: boolean };

function mergeActivity(
  rawActivity: ActivityNote[],
  demoActivity?: ActivityNote[],
): ActivityNote[] {
  const activity = rawActivity?.length ? rawActivity : (demoActivity ?? []);
  if (!demoActivity?.length) return activity;

  const demoById = Object.fromEntries(demoActivity.map((n) => [n.id, n]));
  return activity.map((n) => ({
    ...n,
    attachments:
      n.attachments?.length ? n.attachments : demoById[n.id]?.attachments,
  }));
}

function migrateCheck(raw: LegacyCheck): HealthCheck {
  const demo = DEMO_CHECKS_BY_ID[raw.id];
  const incidentStatus: IncidentStatus =
    raw.incidentStatus ??
    defaultIncidentStatus(raw.status, raw.acknowledged);

  const base: HealthCheck = {
    ...(demo ?? raw),
    ...raw,
    incidentStatus,
    ticketNumber: raw.ticketNumber ?? demo?.ticketNumber ?? "INC000000",
    activity: mergeActivity(raw.activity ?? [], demo?.activity),
    technicalLog: raw.technicalLog ?? demo?.technicalLog,
  };

  const { acknowledged: _removed, ...check } = base as LegacyCheck;
  return check;
}

function migrateStore(parsed: DataHealthStore): DataHealthStore {
  return {
    ...parsed,
    checks: parsed.checks.map(migrateCheck),
  };
}

export function loadStore(): DataHealthStore {
  if (typeof window === "undefined") return DEMO_STORE;

  const v2 = window.localStorage.getItem(STORAGE_KEY);
  if (v2) {
    const parsed = safeJsonParse<DataHealthStore>(v2);
    if (parsed?.version === 1) return migrateStore(parsed);
  }

  const legacy = window.localStorage.getItem("datapulse-demo-store-v1");
  if (legacy) {
    const parsed = safeJsonParse<DataHealthStore>(legacy);
    if (parsed?.version === 1) {
      const migrated = migrateStore(parsed);
      saveStore(migrated);
      window.localStorage.removeItem("datapulse-demo-store-v1");
      return migrated;
    }
  }

  return DEMO_STORE;
}

export function saveStore(store: DataHealthStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function resetStore() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem("datapulse-demo-store-v1");
}

export function exportStoreJson(store: DataHealthStore) {
  const blob = new Blob([JSON.stringify(store, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "datapulse-demo-store.json";
  a.click();
  URL.revokeObjectURL(url);
}
