export const PAINS = [
  {
    id: "silent",
    title: "Nadie mira la base hasta que explota",
    body: "El error aparece en facturación, stock o reportes — no en el panel de IT.",
    signal: "Incidente detectado tarde",
  },
  {
    id: "excel",
    title: "Excel y sistema no cierran",
    body: "Dos versiones de la verdad. Nadie sabe cuál confiar en la reunión del lunes.",
    signal: "Reconciliación fallida",
  },
  {
    id: "backup",
    title: "Backups en piloto automático",
    body: "Asumís que funcionan hasta el día que no hay restore o el job falló en silencio.",
    signal: "Job sin confirmar",
  },
] as const;

export const SOLUTIONS = [
  {
    kicker: "01",
    title: "Score de salud",
    body: "Indicador 0–100 con semáforo que entiende gerencia, no solo el equipo técnico.",
  },
  {
    kicker: "02",
    title: "Alertas accionables",
    body: "Severidad, impacto y recomendación en lenguaje claro — sin jerga de DBA.",
  },
  {
    kicker: "03",
    title: "Informe ejecutivo",
    body: "Resumen de una página, listo para imprimir o enviar al directorio.",
  },
] as const;

export const CHECKS = [
  { id: "backup", label: "Backups sin verificar", severity: "critical" as const },
  { id: "dup", label: "Registros duplicados", severity: "critical" as const },
  { id: "slow", label: "Consultas lentas", severity: "warn" as const },
  { id: "growth", label: "Crecimiento anormal", severity: "warn" as const },
  { id: "excel", label: "Excel vs ERP", severity: "critical" as const },
  { id: "disk", label: "Espacio en disco", severity: "warn" as const },
  { id: "etl", label: "Jobs / ETL fallidos", severity: "critical" as const },
] as const;

export const FOR_WHO = [
  "PyME con PostgreSQL, SQL Server o datos en la nube",
  "Dependencia de Excel + sistema que no cierran",
  "Sin DBA interno o IT saturado",
  "Dueño o gerente que quiere visibilidad sin SQL",
] as const;

export const NOT_FOR = [
  "Startups con Datadog y equipo SRE",
  "Empresas que solo buscan web o redes",
  "Quien no tiene fuente de datos digital",
] as const;

export const STEPS = [
  { n: "1", title: "Charla de 30 min", body: "Mapeamos fuentes de datos y dolores reales." },
  { n: "2", title: "Lectura segura", body: "Conectamos o importamos — sin tocar producción." },
  { n: "3", title: "Informe + panel", body: "Alertas priorizadas y demo con tu contexto." },
] as const;

export const PLANS = [
  {
    name: "Piloto diagnóstico",
    price: "USD 300–500",
    period: "pago único · 7 días",
    features: ["Informe ejecutivo", "Recomendaciones priorizadas", "Panel demo con alertas"],
    highlight: true,
  },
  {
    name: "Monitor mensual",
    price: "USD 99–199",
    period: "/ mes",
    features: ["Checks automáticos", "Alertas por email", "Dashboard actualizado"],
    highlight: false,
  },
  {
    name: "Monitor + soporte",
    price: "USD 299+",
    period: "/ mes",
    features: ["Todo lo anterior", "Horas consultoría DBA", "SLA básico"],
    highlight: false,
  },
] as const;

export const HERO_ALERTS = [
  { id: "a1", severity: "critical" as const, text: "Último backup hace 38 h — sin verificar" },
  { id: "a2", severity: "critical" as const, text: "2.847 duplicados en tabla clientes" },
  { id: "a3", severity: "warn" as const, text: "Excel vs ERP: −12% en conteo mensual" },
  { id: "a4", severity: "warn" as const, text: "Consulta lenta recurrente · 4.2 s avg" },
] as const;

export const DEMO_SCORE = 26;
