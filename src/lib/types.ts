export type CheckStatus = "ok" | "warn" | "critical";

export type CheckCategory =
  | "backup"
  | "integrity"
  | "performance"
  | "sync"
  | "infra";

/** Ciclo operativo liviano (PyME), inspirado en ITSM sin copiar ServiceNow. */
export type IncidentStatus =
  | "new"
  | "in_progress"
  | "verifying"
  | "resolved";

export type ActivityAuthorRole = "system" | "dba" | "management" | "user";

export type ActivityAttachment = {
  id: string;
  name: string;
  url: string;
  caption?: string;
};

export type ActivityNote = {
  id: string;
  author: string;
  role: ActivityAuthorRole;
  body: string;
  createdAt: string;
  attachments?: ActivityAttachment[];
};

export type HealthCheck = {
  id: string;
  /** Número de incidente visible (estilo ITSM, ej. INC004821). */
  ticketNumber: string;
  code: string;
  name: string;
  category: CheckCategory;
  status: CheckStatus;
  scoreImpact: number;
  description: string;
  impact: string;
  recommendation: string;
  detectedAt: string;
  /** @deprecated Usar incidentStatus — se migra al cargar el store */
  acknowledged?: boolean;
  incidentStatus: IncidentStatus;
  technicalLog?: string;
  activity: ActivityNote[];
  sourceId: string;
  history: number[];
  metadata?: Record<string, string>;
};

export type DataSourceType = "postgres" | "sqlserver" | "excel_import";

export type DataSource = {
  id: string;
  name: string;
  type: DataSourceType;
  status: CheckStatus;
  lastSyncAt: string;
};

export type Organization = {
  id: string;
  name: string;
  plan: string;
};

export type DataHealthStore = {
  version: 1;
  updatedAt: string;
  organization: Organization;
  dataSources: DataSource[];
  checks: HealthCheck[];
};

export type HealthLevel = "healthy" | "degraded" | "critical";

export const CATEGORY_LABELS: Record<CheckCategory, string> = {
  backup: "Backups",
  integrity: "Integridad",
  performance: "Performance",
  sync: "Sincronización",
  infra: "Infraestructura",
};

/** Severidad traducida para PyME (equivalente mental P1–P4). */
export const STATUS_LABELS: Record<CheckStatus, string> = {
  ok: "OK",
  warn: "Prioritario",
  critical: "Urgente",
};

export const INCIDENT_STATUS_LABELS: Record<IncidentStatus, string> = {
  new: "Nuevo",
  in_progress: "En curso",
  verifying: "Verificando",
  resolved: "Resuelto",
};

export const ACTIVITY_ROLE_LABELS: Record<ActivityAuthorRole, string> = {
  system: "Sistema",
  dba: "DBA",
  management: "Gerencia",
  user: "Equipo",
};

export const INCIDENT_STATUS_ORDER: IncidentStatus[] = [
  "new",
  "in_progress",
  "verifying",
  "resolved",
];
