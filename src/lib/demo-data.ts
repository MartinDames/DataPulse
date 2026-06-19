import type {
  ActivityAttachment,
  ActivityNote,
  DataHealthStore,
  HealthCheck,
  HealthLevel,
  IncidentStatus,
} from "@/lib/types";

function isoHoursAgo(hours: number) {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

function spark(
  base: number,
  variance: number,
  trend: "up" | "down" | "flat" = "flat",
) {
  return Array.from({ length: 14 }, (_, i) => {
    const drift = trend === "up" ? i * 0.4 : trend === "down" ? -i * 0.3 : 0;
    return Math.max(0, Math.round(base + drift + Math.sin(i) * variance));
  });
}

function note(
  id: string,
  hoursAgo: number,
  author: string,
  role: ActivityNote["role"],
  body: string,
  attachments?: ActivityAttachment[],
): ActivityNote {
  return {
    id,
    author,
    role,
    body,
    createdAt: isoHoursAgo(hoursAgo),
    ...(attachments?.length ? { attachments } : {}),
  };
}

function inc(seq: number): string {
  return `INC${String(seq).padStart(6, "0")}`;
}

const checks: HealthCheck[] = [
  {
    id: "chk-backup-001",
    ticketNumber: inc(4817),
    code: "backup_age",
    name: "Backup sin verificar",
    category: "backup",
    status: "critical",
    scoreImpact: 18,
    description:
      "El último backup completo tiene más de 36 horas y no hay verificación de restore.",
    impact:
      "Riesgo alto de pérdida de datos ante falla de servidor o ransomware.",
    recommendation:
      "Programar backup diario con verificación automática y alerta si supera 24 h.",
    detectedAt: isoHoursAgo(8),
    incidentStatus: "new",
    sourceId: "src-postgres-main",
    history: spark(36, 2, "up"),
    metadata: { lastBackup: "2026-06-05 03:12", retention: "7 días" },
    technicalLog: `[pgbackrest] backup full — host=db-prod-01
2026-06-05 03:12:41 INFO  backup start
2026-06-05 03:47:18 WARN  archive-push lag 142 min
2026-06-05 04:01:02 ERROR verify restore skipped — exit=2
2026-06-05 04:01:02 ERROR last verified backup: 2026-05-28 02:00 UTC
STATUS: UNVERIFIED · age=38h · SLA breach in 4h`,
    activity: [
      note(
        "act-bkp-1",
        8,
        "DataPulse",
        "system",
        "Check backup_age: último backup > 24 h sin verificación de restore.",
        [
          {
            id: "att-bkp-console",
            name: "pgbackrest-verify.png",
            url: "/evidence/backup-console.svg",
            caption: "Consola: backup sin verify · age 38h",
          },
        ],
      ),
      note(
        "act-bkp-2",
        7,
        "DataPulse",
        "system",
        "Severidad Urgente — equivalente operativo P1/P2. Notificar a DBA y gerencia.",
      ),
    ],
  },
  {
    id: "chk-dup-002",
    ticketNumber: inc(4818),
    code: "duplicate_records",
    name: "Duplicados en tabla clientes",
    category: "integrity",
    status: "critical",
    scoreImpact: 15,
    description:
      "847 registros duplicados por CUIT en `public.clientes` (últimos 90 días).",
    impact:
      "Facturación duplicada, reportes inflados y errores en campañas de cobranza.",
    recommendation:
      "Ejecutar deduplicación con regla CUIT + merge auditado; agregar unique constraint.",
    detectedAt: isoHoursAgo(14),
    incidentStatus: "in_progress",
    sourceId: "src-postgres-main",
    history: spark(620, 40, "up"),
    metadata: { table: "public.clientes", key: "cuit", duplicados: "847" },
    technicalLog: `SELECT cuit, COUNT(*) AS n
FROM public.clientes
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY cuit HAVING COUNT(*) > 1;

-- rows: 847 duplicate groups · max dupes per cuit: 4
-- sample: CUIT 30-71234567-8 → ids 8821, 9104, 9105
-- FK refs: 1.203 facturas · 412 pedidos (merge required)`,
    activity: [
      note(
        "act-dup-1",
        14,
        "DataPulse",
        "system",
        "Detectados 847 grupos duplicados por CUIT en public.clientes.",
      ),
      note(
        "act-dup-2",
        12,
        "Martín Dames",
        "dba",
        "Inicié análisis de merge. Priorizo CUITs con facturas activas en el último mes.",
        [
          {
            id: "att-dup-query",
            name: "query-duplicados.png",
            url: "/evidence/sql-duplicates.svg",
            caption: "Captura: grupos duplicados por CUIT · 847 filas",
          },
        ],
      ),
      note(
        "act-dup-3",
        10,
        "Laura (Finanzas)",
        "management",
        "Pausar campaña de cobranza masiva hasta que cierre la deduplicación.",
      ),
    ],
  },
  {
    id: "chk-excel-003",
    ticketNumber: inc(4819),
    code: "excel_system_gap",
    name: "Discrepancia Excel vs ERP",
    category: "sync",
    status: "critical",
    scoreImpact: 12,
    description:
      "Stock en Excel (Depósito Norte) difiere 11,4% vs sistema Tango en 312 SKUs.",
    impact:
      "Pedidos cancelados, quiebres de stock y cierre de mes incorrecto.",
    recommendation:
      "Unificar fuente de verdad; import diario con reconciliación automática.",
    detectedAt: isoHoursAgo(20),
    incidentStatus: "verifying",
    sourceId: "src-excel-stock",
    history: spark(8, 1.5, "up"),
    metadata: {
      excelRows: "4.820",
      systemRows: "4.508",
      deltaPct: "11.4%",
    },
    technicalLog: `[reconcile] job=daily_stock_compare
excel: Deposito_Norte_v3.xlsx · modified 2026-06-04 18:22
erp:   tango.stock_deposito_norte
delta: 312 SKUs · 11.4% units · top SKU diff: A-4421 (+84 u.)
last_sync_ok: 2026-06-01 06:00`,
    activity: [
      note(
        "act-xls-1",
        20,
        "DataPulse",
        "system",
        "Discrepancia Excel vs ERP supera umbral 5% en Depósito Norte.",
      ),
      note(
        "act-xls-2",
        18,
        "Martín Dames",
        "dba",
        "Import manual de Excel del viernes identificado como fuente del desvío.",
        [
          {
            id: "att-xls-diff",
            name: "excel-vs-erp.png",
            url: "/evidence/excel-erp-diff.svg",
            caption: "Excel Depósito Norte vs Tango ERP — Δ 11,4%",
          },
        ],
      ),
      note(
        "act-xls-3",
        4,
        "Martín Dames",
        "dba",
        "Re-sync aplicado. Pendiente validar cierre con operaciones mañana AM.",
        [
          {
            id: "att-xls-verify",
            name: "excel-vs-erp-post.png",
            url: "/evidence/excel-erp-diff.svg",
            caption: "Post re-sync: pendiente OK de operaciones",
          },
        ],
      ),
    ],
  },
  {
    id: "chk-slow-004",
    ticketNumber: inc(4820),
    code: "slow_queries",
    name: "Consultas lentas recurrentes",
    category: "performance",
    status: "warn",
    scoreImpact: 8,
    description:
      "12 queries superan 2 s de promedio en horario pico (09:00–12:00).",
    impact:
      "Operadores esperan pantallas; riesgo de timeouts en cierre diario.",
    recommendation:
      "Revisar índices en `ventas_detalle`; analizar plan de ejecución top 5 queries.",
    detectedAt: isoHoursAgo(3),
    incidentStatus: "in_progress",
    sourceId: "src-postgres-main",
    history: spark(9, 2, "up"),
    metadata: { avgMs: "2340", peakHour: "10:30" },
    technicalLog: `pg_stat_statements · top slow (avg > 2000ms)
1. SELECT * FROM ventas_detalle WHERE fecha >= $1  avg=4120ms  calls=842
2. SELECT ... JOIN clientes c ON ...               avg=2890ms  calls=1204
3. REFRESH MATERIALIZED VIEW mv_resumen_diario       avg=2340ms  calls=12
-- missing index hint: ventas_detalle(fecha, sucursal_id)`,
    activity: [
      note(
        "act-slow-1",
        3,
        "DataPulse",
        "system",
        "12 queries sobre umbral 2 s en ventana pico 09:00–12:00.",
      ),
      note(
        "act-slow-2",
        2,
        "Martín Dames",
        "dba",
        "Creando índice compuesto en ventas_detalle(fecha, sucursal_id). ETA 20 min.",
      ),
    ],
  },
  {
    id: "chk-growth-005",
    ticketNumber: inc(4821),
    code: "table_growth",
    name: "Crecimiento anormal de tabla",
    category: "integrity",
    status: "warn",
    scoreImpact: 6,
    description:
      "`logs_auditoria` creció 340% en 7 días (2,1 GB → 9,2 GB).",
    impact:
      "Disco y backups más caros; degradación de performance general.",
    recommendation:
      "Política de retención 90 días + particionado o archivo frío.",
    detectedAt: isoHoursAgo(26),
    incidentStatus: "new",
    sourceId: "src-postgres-main",
    history: spark(2100, 300, "up"),
    metadata: { sizeBefore: "2.1 GB", sizeNow: "9.2 GB" },
    technicalLog: `SELECT pg_size_pretty(pg_total_relation_size('logs_auditoria'));
-- 9.2 GB (was 2.1 GB on 2026-05-30)
INSERT rate: ~1.2M rows/day · trigger: trg_audit_all_tables ON INSERT
WARN: autovacuum lag 18h on logs_auditoria`,
    activity: [
      note(
        "act-grw-1",
        26,
        "DataPulse",
        "system",
        "Crecimiento 340% en logs_auditoria — revisar retención y triggers.",
      ),
    ],
  },
  {
    id: "chk-disk-006",
    ticketNumber: inc(4822),
    code: "disk_threshold",
    name: "Espacio en disco",
    category: "infra",
    status: "warn",
    scoreImpact: 5,
    description: "Volumen `/data` al 82% de capacidad (164 GB / 200 GB).",
    impact: "Sin margen para backups locales ni picos de carga.",
    recommendation:
      "Expandir volumen o mover backups a storage externo; alerta al 85%.",
    detectedAt: isoHoursAgo(1),
    incidentStatus: "new",
    sourceId: "src-postgres-main",
    history: spark(74, 3, "up"),
    metadata: { usedPct: "82%", freeGb: "36" },
    technicalLog: `df -h /data
/dev/mapper/vg0-data  200G  164G   36G  82% /data
-- growth +4% in 72h · largest: /data/pg_wal (28G) · /data/backups (91G)`,
    activity: [
      note(
        "act-dsk-1",
        1,
        "DataPulse",
        "system",
        "Volumen /data al 82% — umbral warn 80%, crítico 90%.",
      ),
    ],
  },
  {
    id: "chk-cron-007",
    ticketNumber: inc(4823),
    code: "cron_failed",
    name: "Job nocturno fallido",
    category: "infra",
    status: "critical",
    scoreImpact: 10,
    description:
      "Cron `sync_precios_proveedor` falló 3 noches consecutivas (exit code 1).",
    impact: "Listas de precio desactualizadas; ventas con margen incorrecto.",
    recommendation:
      "Revisar log en `/var/log/cron`; reintentos + alerta Slack/email.",
    detectedAt: isoHoursAgo(6),
    incidentStatus: "new",
    sourceId: "src-postgres-main",
    history: spark(0, 0, "flat"),
    metadata: { job: "sync_precios_proveedor", failures: "3" },
    technicalLog: `[cron] sync_precios_proveedor · exit=1
2026-06-06 02:00:01 ERROR connection timeout host=192.168.1.12:5432
2026-06-07 02:00:01 ERROR connection timeout host=192.168.1.12:5432
2026-06-08 02:00:01 ERROR connection timeout host=192.168.1.12:5432
last_success: 2026-06-05 02:00:14 UTC · retries=0/3`,
    activity: [
      note(
        "act-cron-1",
        6,
        "DataPulse",
        "system",
        "Job sync_precios_proveedor falló 3 noches seguidas.",
        [
          {
            id: "att-cron-log",
            name: "cron-error.png",
            url: "/evidence/backup-console.svg",
            caption: "Log cron: connection timeout · exit=1",
          },
        ],
      ),
    ],
  },
  {
    id: "chk-conn-008",
    ticketNumber: inc(4824),
    code: "connection_pool",
    name: "Pool de conexiones estable",
    category: "performance",
    status: "ok",
    scoreImpact: 0,
    description: "Uso promedio del pool 34% — dentro de umbral saludable.",
    impact: "Sin impacto operativo.",
    recommendation: "Mantener monitoreo semanal.",
    detectedAt: isoHoursAgo(2),
    incidentStatus: "resolved",
    sourceId: "src-postgres-main",
    history: spark(32, 5, "flat"),
    metadata: { poolMax: "100", poolAvg: "34" },
    technicalLog: `pgbouncer pools:
production · max=100 · active=34 · waiting=0 · OK`,
    activity: [
      note(
        "act-pool-1",
        2,
        "DataPulse",
        "system",
        "Pool de conexiones dentro de umbral — check OK.",
      ),
    ],
  },
  {
    id: "chk-index-009",
    ticketNumber: inc(4825),
    code: "index_health",
    name: "Índices principales OK",
    category: "performance",
    status: "ok",
    scoreImpact: 0,
    description: "Fragmentación de índices críticos bajo 12%.",
    impact: "Sin impacto operativo.",
    recommendation: "Reindex programado trimestral.",
    detectedAt: isoHoursAgo(48),
    incidentStatus: "resolved",
    sourceId: "src-postgres-main",
    history: spark(10, 1, "flat"),
    technicalLog: `index_health scan · 12 critical indexes
max_fragmentation: 11.2% · idx_ventas_fecha · OK`,
    activity: [
      note(
        "act-idx-1",
        48,
        "DataPulse",
        "system",
        "Fragmentación de índices bajo umbral 12%.",
      ),
    ],
  },
];

export const DEMO_CHECKS_BY_ID: Record<string, HealthCheck> = Object.fromEntries(
  checks.map((c) => [c.id, c]),
);

export const DEMO_STORE: DataHealthStore = {
  version: 1,
  updatedAt: new Date().toISOString(),
  organization: {
    id: "org-demo",
    name: "Distribuidora Norte S.A.",
    plan: "Piloto diagnóstico",
  },
  dataSources: [
    {
      id: "src-postgres-main",
      name: "PostgreSQL — Producción",
      type: "postgres",
      status: "critical",
      lastSyncAt: isoHoursAgo(1),
    },
    {
      id: "src-excel-stock",
      name: "Excel — Stock Depósito",
      type: "excel_import",
      status: "warn",
      lastSyncAt: isoHoursAgo(5),
    },
    {
      id: "src-sql-reporting",
      name: "SQL Server — Reporting",
      type: "sqlserver",
      status: "ok",
      lastSyncAt: isoHoursAgo(2),
    },
  ],
  checks,
};

export function computeHealthScore(checks: HealthCheck[]): number {
  const impact = checks.reduce((sum, c) => sum + c.scoreImpact, 0);
  return Math.max(0, Math.min(100, 100 - impact));
}

export function computeHealthLevel(score: number): HealthLevel {
  if (score >= 80) return "healthy";
  if (score >= 50) return "degraded";
  return "critical";
}

export function countByStatus(checks: HealthCheck[]) {
  return checks.reduce(
    (acc, c) => {
      acc[c.status] += 1;
      return acc;
    },
    { ok: 0, warn: 0, critical: 0 } as Record<
      "ok" | "warn" | "critical",
      number
    >,
  );
}

export function defaultIncidentStatus(
  status: HealthCheck["status"],
  acknowledged?: boolean,
): IncidentStatus {
  if (status === "ok") return "resolved";
  if (acknowledged) return "verifying";
  return "new";
}
