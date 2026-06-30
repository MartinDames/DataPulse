# Playbooks — DataPulse

> Recetas operativas por tipo de issue. Fase 2 del roadmap usa estos templates; fase 3 los combina con RAG por cliente.

**Estado:** carpeta creada — completar con aprendizajes de cada piloto.

## Playbooks planificados

| Archivo | Check | Prioridad |
|---------|-------|-----------|
| `backup_unverified.md` | Backup sin verificar | Alta |
| `disk_usage_high.md` | Espacio en disco | Alta |
| `duplicate_records.md` | Registros duplicados | Alta |
| `excel_erp_mismatch.md` | Excel vs ERP | Alta |
| `slow_queries.md` | Consultas lentas | Media |
| `job_failed.md` | Jobs / ETL fallidos | Alta |
| `table_growth_abnormal.md` | Crecimiento anormal | Media |

## Cómo crear uno nuevo

Copiá esta estructura después de cada incidente real:

```markdown
# [Nombre del issue]

## Síntomas
- Qué ve el cliente / IT

## Diagnóstico (read-only)
- Queries o comandos para confirmar

## Causas frecuentes
- ...

## Recomendación
1. Paso concreto
2. ...

## Riesgos
- Qué puede salir mal

## Rollback
- Cómo deshacer si aplica

## Cuándo escalar a humano
- ...

## Referencias
- CIS control (opcional)
- Doc cliente (opcional)
```

Ver `ROADMAP-IA.md` → Fase 2.
