# DataPulse — Roadmap IA y automatización

> Evolución del producto: de diagnóstico manual → detección automática → recomendaciones IA → remediación con guardrails.  
> **Mismo producto (DataPulse), fases distintas** — no lanzar marca aparte hasta que una capa tenga tracción.

**Última actualización:** 2026-06-28  
**Estado actual:** Fase 0 (demo + piloto Wizard of Oz)  
**Decisión clave:** La IA **recomienda y documenta** antes de **ejecutar**. El botón "Solucionar" es fase tardía y acotada.

---

## Visión

DataPulse pasa de *"panel que muestra problemas"* a *"sistema que vigila, explica y — con aprobación — actúa"*.

```text
Hoy     Ver problemas (demo + piloto manual)
v2      Detectar solo (collectors + cron)
v3      Recomendar con IA (ticket + plan de acción)
v4      Aplicar con aprobación humana (audit log)
v5      Auto-fix acotado (solo acciones de bajo riesgo)
```

**Wedge que no abandonamos:** PyME, español, Excel + ERP, informe para gerencia, DBA sin contratar full-time.

---

## Por qué no es un proyecto aparte

| Mismo producto | Motivo |
|----------------|--------|
| Misma marca (DataPulse / DamesSystems) | El cliente compra "cuidado de datos", no "un agente IA" |
| Misma UI (tickets, score, informe) | Evolución natural de checks → alertas → recomendaciones |
| Mismo cliente ideal | PyME sin DBA, IT limitado |
| Pricing escalonado | Piloto → Monitor → Monitor + IA/remediación |

Separar marca solo si en el futuro hay un módulo enterprise con otro buyer (CISO, SOC).

---

## Mapa de fases

| Fase | Nombre | Trigger para empezar | Entregable | Plazo orientativo |
|------|--------|----------------------|------------|-------------------|
| **0** | Demo + piloto manual | ✅ Ahora | Landing, demo, informe, JSON cliente | Hecho |
| **1** | Detección automática | 2–3 pilotos pagos + dolor repetido | Collectors read-only + cron + tickets reales | 3–6 meses |
| **2** | Recomendaciones (templates) | Monitor mensual activo | Ticket con causa + pasos + riesgo (sin LLM) | +2–3 meses |
| **3** | IA en recomendaciones | 5+ clientes o playbooks estables | RAG por empresa + redacción contextual | +3–6 meses |
| **4** | Botón "Aplicar" | Cliente pide ejecución + confianza | Preview, aprobación, executor, audit | +6–12 meses |
| **5** | Auto-fix acotado | Incidentes repetitivos clasificados | Whitelist de acciones + ventanas horarias | +12 meses |

**Regla:** no avanzar de fase sin validación comercial de la anterior.

---

## Fase 0 — Actual (demo + Wizard of Oz)

### Qué hay
- Demo Next.js + localStorage
- Piloto manual (SQL, Excel, scripts)
- Tickets/recomendaciones escritos por Martín
- JSON importable por cliente en `/configuracion`

### Qué aprendemos en cada piloto
- Checks que más duelen
- Playbooks que se repiten
- Objeciones de IT (acceso, permisos)
- Textos que entiende gerencia vs IT

### Salida de fase
- [ ] 3 pilotos pagos cerrados
- [ ] 10+ playbooks documentados (aunque sean Markdown)
- [ ] 1 cliente en monitor mensual

**Runbook:** `PILOTO-ONBOARDING.md`

---

## Fase 1 — Detección automática

### Objetivo
Conectar fuentes en **solo lectura** y crear tickets sin intervención manual.

### Componentes a construir

```text
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ Collector   │───▶│ Rules engine │───▶│ Supabase    │
│ (agent/cron)│    │ (checks SQL) │    │ + API       │
└─────────────┘    └──────────────┘    └──────┬──────┘
                                            │
                                            ▼
                                     UI DataPulse (live)
```

### Checks v1 (prioridad)
1. Backup age / verificación
2. Espacio en disco
3. Duplicados en tablas críticas (config por cliente)
4. Jobs / ETL / SQL Agent fallidos
5. Crecimiento anormal de tablas
6. Consultas lentas (si hay permisos DMVs / pg_stat)

### Stack sugerido
| Pieza | Opción |
|-------|--------|
| DB + auth | Supabase (PostgreSQL) |
| API | Next.js Route Handlers o worker separado |
| Jobs | Vercel Cron → script Node, o agente en VM del cliente (on-prem) |
| Conexión DB | Usuario read-only por cliente; credenciales en vault (Supabase secrets) |
| UI | DataPulse actual consumiendo API en vez de solo localStorage |

### On-prem / híbrido
- **Cloud-first:** collector en tu infra conecta por VPN/IP whitelist
- **On-prem:** script ligero que corre checks localmente y **solo envía resultados** (no credenciales salientes)

### Salida de fase
- [ ] 1 org multi-tenant (aunque sean 2 clientes reales)
- [ ] Cron diario funcionando
- [ ] Alertas por email
- [ ] Score calculado en backend

### Pricing
Monitor mensual USD 99–199 — **este es el producto de la fase 1**.

---

## Fase 2 — Recomendaciones con templates

### Objetivo
Cada ticket trae **plan de acción** sin depender de LLM (confiable, barato).

### Modelo de ticket enriquecido

```yaml
check: disk_usage_high
severity: warn
evidence:
  mount: /data
  usage_pct: 82
  top_consumers: [logs_app, logs_auditoria]
recommendation:
  summary: "Liberar espacio en /data antes de 48 h"
  steps:
    - "Rotar/comprimir logs > 30 días en /var/log/app"
    - "Evaluar purge o partición en logs_auditoria"
  risk: medium
  effort: low
  rollback: "Restaurar logs desde backup si se archivaron por error"
  references:
    - playbook: disk_cleanup_generic
    - client_doc: optional
```

### Playbooks (repo)
Crear carpeta `playbooks/` con uno por tipo de issue:

```text
playbooks/
  backup_unverified.md
  disk_usage_high.md
  duplicate_records.md
  excel_erp_mismatch.md
  slow_queries.md
  job_failed.md
  table_growth_abnormal.md
```

Cada playbook: síntomas → diagnóstico → pasos → riesgos → cuándo escalar a humano.

### CIS Benchmarks en esta fase
- Descargar PDFs gratis: [CIS PostgreSQL](https://www.cisecurity.org/benchmark/postgresql), [CIS SQL Server](https://www.cisecurity.org/benchmark/microsoft_sql_server)
- Mapear controles relevantes a checks (seguridad/config)
- **No** usar CIS solo — complementa, no reemplaza checks operativos PyME

| CIS aporta | DataPulse aporta |
|------------|------------------|
| Config insegura, permisos | Excel vs ERP, duplicados de negocio |
| Hardening | Backups operativos, jobs ETL |
| Cumplimiento | Informe gerencia en español |

### Salida de fase
- [ ] 100% tickets críticos con recomendación template
- [ ] Playbooks versionados en repo
- [ ] Informe PDF generado desde backend

---

## Fase 3 — IA en recomendaciones (RAG por empresa)

### Objetivo
La IA **redacta y contextualiza** — no ejecuta SQL libre.

### Principios de diseño
1. **Regla/playbook identifica el tipo** de issue (determinístico)
2. **Tools read-only** recopilan evidencia (como Xata Agent)
3. **LLM sintetiza** impacto, pasos, lenguaje gerencia
4. **Salida estructurada** (JSON) → ticket UI
5. **Cero ejecución** destructiva en esta fase

### Corpus RAG por cliente (`clientes/{empresa}/knowledge/`)

```text
knowledge/
  procedimientos-backup.pdf      # docs internos del cliente
  excepciones.md                 # "tabla X se purga manualmente"
  cis-postgresql-mapping.json    # controles aplicables
  tickets_resueltos/             # historial anonimizado
  playbooks_custom/              # overrides por empresa
```

### Stack IA sugerido
| Pieza | Opción |
|-------|--------|
| Orquestación | Playbooks en código + LLM solo para redacción |
| Referencia open source | [Xata Agent](https://github.com/xataio/agent) — evaluar fork/adaptar vs propio |
| Embeddings / RAG | Supabase pgvector o archivo local por cliente |
| Modelo | API (Claude/GPT) con tools acotados |
| Anti-alucinación | Solo citar evidencia de tools; template obligatorio |

### Flujo

```text
Cron detecta issue
  → clasificador (regla): "disk_usage_high"
  → tools: queries read-only + métricas
  → playbook base + RAG cliente
  → LLM: redacta recommendation block
  → ticket en UI (nota visible, sin botón ejecutar)
```

### Salida de fase
- [ ] IA activa en ≥3 tipos de checks
- [ ] Feedback loop: "¿útil / no útil" en ticket
- [ ] Costo IA < 20% del margen del plan monitor

### Pricing
Monitor + soporte USD 299+ — **IA incluida en recomendaciones**.

---

## Fase 4 — Botón "Aplicar" (con aprobación)

### Objetivo
Ejecutar acciones **pre-aprobadas** con preview, audit y rollback documentado.

### Patrón (referencia: AegisDB, DBScout)

```text
Ticket + recomendación
  → [Preview / dry-run]
  → Humano aprueba (UI o email)
  → Executor corre script whitelist
  → Verificación post-acción
  → Audit log inmutable
  → Notificación Slack/email
```

### Whitelist de acciones (ejemplo)

| Acción | Riesgo | ¿Permitida? |
|--------|--------|-------------|
| `VACUUM ANALYZE` tabla X | Bajo | Sí, ventana off-peak |
| Comprimir/archivar logs > N días | Medio | Sí, con preview |
| `CREATE INDEX CONCURRENTLY` | Medio | Solo con OK explícito |
| Purge filas (criterio acordado) | Alto | Preview + OK + backup |
| `DROP` / `TRUNCATE` / DDL | Crítico | **Nunca automático** |
| Restore backup | Crítico | **Solo runbook manual** |

### Permisos
- Fase 1–3: usuario **read-only**
- Fase 4: usuario **limitado** con permisos por acción (role executor)
- Credenciales en vault; rotación; revocación post-piloto

### Salida de fase
- [ ] 3 acciones en whitelist funcionando en producción
- [ ] 100% ejecuciones en audit log
- [ ] 0 incidentes por auto-fix no aprobado

---

## Fase 5 — Auto-fix acotado (opcional, largo plazo)

### Objetivo
Para clases de incidentes **repetitivos y de bajo riesgo**, ejecutar sin humano en loop (con guardrails).

Ejemplos realistas:
- Disco lleno por logs temporales → archivar >30 días
- Vacuum en tabla con bloat conocido → ventana 03:00

**No prometer** esto en marketing hasta tener meses de fase 4 estable.

---

## Extensión más allá de DBA

| Oleada | Dominio | Cuándo |
|--------|---------|--------|
| 1 | PostgreSQL, SQL Server | Fase 1 |
| 2 | Jobs, ETL, cron, SQL Agent | Fase 1–2 |
| 3 | OS: disco, memoria, servicios | Fase 2–3 |
| 4 | Logs de aplicación | Fase 3 |
| 5 | CIS Linux / seguridad host | Fase 4+ (partner o upsell) |

**No competir** con Datadog en observabilidad general. Profundizar en **datos + operación PyME**.

---

## Competencia a monitorear

| Producto | Qué copiar | Qué no copiar |
|----------|------------|---------------|
| [Xata Agent](https://github.com/xataio/agent) | Playbooks + tools read-only | Target dev/SRE en inglés |
| [DBScout](https://severalnines.com/dbscout/) | Guardrailed remediation | Pricing enterprise |
| [Samo](https://samo.sh/) | Postgres autopilot | Solo Postgres managed |
| [AegisDB](https://github.com/furyfist/AegisDB) | Approve + sandbox + audit | Scope data quality |
| Datadog Bits AI | Agent workflows | Precio y complejidad PyME |

**Diferencial DataPulse:** español, gerencia, Excel/ERP, precio PyME, informe ejecutivo.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| IA alucina pasos peligrosos | Playbooks fijos; LLM solo redacta; no ejecuta SQL libre |
| Auto-fix borra datos | Whitelist; preview; rollback; nunca DROP auto |
| Cliente no da permisos write | Producto core = detectar + recomendar (fases 1–3) |
| Costo IA come margen | Templates primero; LLM solo en checks complejos |
| Responsabilidad legal | Contrato piloto; audit log; aprobación explícita fase 4 |
| Scope creep (todo IT) | Oleadas; DBA primero |

---

## Métricas por fase

| Fase | Métrica de éxito |
|------|------------------|
| 0 | 3 pilotos pagos, NPS cualitativo positivo |
| 1 | Uptime del cron >99%; <5% falsos positivos en críticos |
| 2 | 100% tickets con recomendación; tiempo DBA -50% |
| 3 | >70% recomendaciones marcadas "útil" |
| 4 | 0 incidentes por ejecución no autorizada |
| 5 | MTTR ↓ en clases whitelist (medir antes/después) |

---

## Próximos pasos concretos (después del LinkedIn)

### Este mes
- [ ] Cerrar 1 piloto pagado
- [ ] Documentar 5 playbooks reales en `playbooks/` (aunque sea Markdown)
- [ ] Por cada piloto: ¿qué check se repite?

### Cuando haya 2–3 pilotos
- [ ] Spike técnico: Supabase schema (`organizations`, `data_sources`, `check_runs`, `alerts`) — ver `../_general/MVP.md`
- [ ] Primer collector read-only (1 check: backup age)
- [ ] Evaluar [Xata Agent](https://github.com/xataio/agent) 2–3 días: ¿fork o inspiración?

### No hacer todavía
- Botón "Solucionar" en landing
- Prometer auto-fix en posts comerciales
- Multi-tenant auth complejo
- Soporte de 20 tipos de DB

---

## Archivos relacionados

| Archivo | Uso |
|---------|-----|
| `PILOTO-ONBOARDING.md` | Operación piloto manual (fase 0) |
| `PUBLICAR.md` | Comercialización |
| `../_general/MVP.md` | Modelo de datos referencia |
| `../ROADMAP.md` | Emprendimiento DamesSystems global |
| `clientes/_plantilla/NOTAS.md` | Aprendizajes por cliente → alimentan playbooks |

---

## Registro de decisiones

| Fecha | Decisión | Notas |
|-------|----------|-------|
| 2026-06-28 | Roadmap IA creado | Mismo producto; IA recomienda antes de ejecutar |
| | CIS como corpus complementario | No reemplaza checks operativos PyME |
| | Fase 4 requiere aprobación humana | Patrón AegisDB / DBScout |

_Actualizá esta tabla cuando cierres pilotos o cambies prioridades._
