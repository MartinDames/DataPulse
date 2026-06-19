export type Density = "comfortable" | "compact";
export type Accent = "cobalt" | "terra" | "signal";

export type UiPrefs = {
  density: Density;
  accent: Accent;
};

const KEY = "datapulse-ui-prefs-v1";

const DEFAULT_PREFS: UiPrefs = {
  density: "comfortable",
  accent: "cobalt",
};

export function loadUiPrefs(): UiPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as UiPrefs;
    if (!parsed?.density || !parsed?.accent) return DEFAULT_PREFS;
    const accent = parsed.accent as string;
    if (accent === "emerald" || accent === "indigo" || accent === "amber") {
      return { ...parsed, accent: "cobalt" } as UiPrefs;
    }
    return parsed;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveUiPrefs(prefs: UiPrefs) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(prefs));
}

export function applyUiPrefsToDom(prefs: UiPrefs) {
  if (typeof document === "undefined") return;

  document.documentElement.dataset.density =
    prefs.density === "compact" ? "compact" : "comfortable";

  const root = document.documentElement;
  if (prefs.accent === "terra") {
    root.style.setProperty("--accent", "oklch(0.62 0.14 45)");
    root.style.setProperty("--accent-2", "oklch(0.72 0.1 75)");
  } else if (prefs.accent === "signal") {
    root.style.setProperty("--accent", "oklch(0.75 0.16 195)");
    root.style.setProperty("--accent-2", "oklch(0.68 0.14 230)");
  } else {
    root.style.setProperty("--accent", "oklch(0.68 0.12 230)");
    root.style.setProperty("--accent-2", "oklch(0.72 0.08 195)");
  }
}
