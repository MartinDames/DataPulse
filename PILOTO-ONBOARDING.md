# DataPulse — Runbook del piloto (7 días)

> **Cuándo usar este archivo:** el cliente aceptó el piloto diagnóstico (USD 300–500) o firmó acuerdo verbal por escrito.  
> **Empresa:** DamesSystems · **Producto:** DataPulse · **Modelo actual:** Wizard of Oz (diagnóstico manual + demo personalizada).

---

## Cómo funciona hoy (importante)

La demo en [data-health.vercel.app](https://data-health.vercel.app) **no se conecta sola** a bases de datos del cliente. El piloto se entrega así:

1. Vos corrés el diagnóstico **por fuera** (SQL, exports, revisión de backups/logs).
2. Documentás hallazgos en un **informe ejecutivo** (vista `/informe` o PDF).
3. **(Opcional)** Armás un JSON con los checks reales e importás en `/configuracion` para mostrar un panel con su contexto.

Eso es suficiente para el piloto comercial. La automatización (Supabase, cron, alertas reales) viene después, si contratan monitor mensual.

---

## Antes de arrancar el reloj de 7 días

No empieces a contar días hasta tener esto claro:

| Requisito | Estado |
|-----------|--------|
| Acuerdo de piloto (precio, alcance, 7 días) | [ ] |
| Contacto de negocio (dueño / gerente) | [ ] |
| Contacto IT o quien administra sistemas | [ ] |
| Confirmación: **solo lectura**, sin modificar producción | [ ] |
| Método de acceso definido (ver escenarios abajo) | [ ] |

**Regla comercial:** si IT del cliente tarda en dar acceso, el plazo se extiende. Decilo por adelantado:

> *"Los 7 días empiezan cuando tengamos acceso o los exports acordados."*

---

## Resumen del flujo

```text
Día 0     Kickoff 30 min → pedir accesos / exports
Día 1–3   Esperar acceso + correr primeros checks
Día 3–5   Diagnóstico completo + priorizar hallazgos
Día 6     Armar informe + JSON demo (opcional)
Día 7     Reunión de entrega + propuesta monitor mensual
```

---

## Fase 0 — Kickoff (30 min)

### Objetivo

Mapear fuentes, dolores y definir **cómo** vas a obtener datos.

### Preguntas obligatorias

**Negocio**

1. ¿Cuál fue el último incidente de datos? ¿Cuánto costó (plata, horas, clientes)?
2. ¿Qué números o procesos **no pueden fallar**? (facturación, stock, cierre de mes…)
3. ¿Quién usa Excel y quién confía en el ERP/sistema?

**Técnico**

4. ¿Qué ERP o sistema usan? ¿Versión aproximada?
5. ¿Tienen base de datos? ¿PostgreSQL, SQL Server, otro?
6. ¿Dónde está alojado? (nube, servidor en oficina, proveedor IT)
7. ¿Hay backups? ¿Quién los verifica y con qué frecuencia?
8. ¿Hay jobs/cron/ETL? ¿Alguien revisa si fallan?
9. ¿Quién puede darnos acceso de **solo lectura** o exports?

### Anotar en cada kickoff

| Campo | Valor |
|-------|-------|
| Empresa | |
| Rubro | |
| Contacto negocio | |
| Contacto IT | |
| Sistemas | |
| Tipo de DB | |
| Hosting | |
| Escenario de acceso (A/B/C/D) | |
| Dolor #1 | |
| Tablas/archivos críticos | |
| Fecha inicio piloto | |

---

## Fase 1 — Qué pedirle al cliente

Enviá mail al contacto IT (copiando al gerente) con la lista según el escenario.

### Siempre pedir

- [ ] Nombre de la empresa para el informe
- [ ] Contacto IT + contacto negocio
- [ ] Lista de sistemas (ERP, Excel, DB, backups)
- [ ] Compromiso explícito: **acceso solo lectura** o exports — sin cambios en producción
- [ ] Ventana horaria preferida para consultas (ej. fuera de horario pico)

### Escenario A — Base de datos directa (PostgreSQL / SQL Server)

- [ ] Host, puerto, nombre de base
- [ ] Usuario con permiso **SELECT** (idealmente solo schemas/tablas acordadas)
- [ ] Método de red: IP pública + firewall, **VPN**, o túnel SSH
- [ ] (Opcional) Permiso para ver historial de backups / DMVs / `pg_stat_statements`
- [ ] Diagrama o lista de tablas críticas (clientes, stock, facturas…)

### Escenario B — Solo Excel + exports del ERP (más común en PyME)

- [ ] Export CSV/Excel de tablas clave (clientes, productos, stock, ventas…)
- [ ] El Excel “operativo” que usan día a día
- [ ] Indicar qué campo/columna une Excel con el sistema (si existe)
- [ ] Fecha de corte de los exports (mismo día para comparar)

### Escenario C — On‑prem sin acceso directo

- [ ] VPN a red del cliente, **o**
- [ ] Que IT ejecute scripts que vos enviás y devuelva resultados (CSV/txt), **o**
- [ ] Dump anonimizado o export programado semanal

### Escenario D — Solo backups / infra

- [ ] Acceso a panel de backups o logs (solo lectura)
- [ ] Política de retención documentada
- [ ] Última fecha de restore probado (si la conocen)

---

## Plantilla de mail para IT

```
Asunto: DataPulse — acceso solo lectura para piloto diagnóstico (7 días)

Hola [nombre IT],

Soy Martín Dames (DamesSystems). [Empresa] contrató un piloto de diagnóstico de salud de datos.

Necesitamos acceso de SOLO LECTURA — no modificamos producción ni esquemas.

Opción preferida:
- [PostgreSQL / SQL Server]: usuario read-only con SELECT en [schemas/tablas acordadas]
- Host: __________  Puerto: __________  Base: __________

Opción alternativa (si no hay acceso directo):
- Exports CSV/Excel de [tablas listadas] con fecha [____]
- O ejecución de scripts de diagnóstico que les envío (solo consultas SELECT)

Ventana sugerida para consultas: [horario].

Contacto negocio en copia. Cualquier duda, respondemos en 24 h.

Gracias,
Martín Dames
damessystems@gmail.com
```

---

## Fase 2 — Conexión y tiempos realistas

| Escenario | Qué implica | Tiempo típico (acceso listo) | Cuello de botella |
|-----------|-------------|------------------------------|-------------------|
| **B** Excel + exports | Sin conexión DB | **1–2 días** | Que manden archivos completos |
| **A** DB en nube + IT ágil | Usuario read-only + firewall | **2–4 días** | Creación de usuario / whitelist IP |
| **C** On‑prem | VPN o scripts vía IT | **5–10 días hábiles** | Burocracia / proveedor externo |
| **D** Solo backups | Logs o panel | **0,5–1 día** | Acceso al tool de backup |

**Tu trabajo técnico puro** (con acceso ya otorgado): **4–8 horas** para un piloto acotado (5–7 checks).

---

## Fase 3 — Checks a ejecutar

Alineados con la landing y la demo. Marcá cada uno al completar.

| Check | Qué buscás | Cómo (manual) |
|-------|------------|---------------|
| **Backups** | Último backup > 24 h sin verificar | Historial SQL Server, pgBackRest, panel del proveedor, o confirmación IT |
| **Duplicados** | Registros repetidos en tablas críticas | `GROUP BY` clave natural + `HAVING COUNT(*) > 1` |
| **Consultas lentas** | Queries recurrentes > umbral | DMVs SQL Server, `pg_stat_statements`, logs de app |
| **Crecimiento** | Tablas que crecen anormal | Tamaños actuales vs histórico (si hay snapshot) |
| **Excel vs ERP** | Conteos o montos que no cierran | Comparar export ERP vs Excel mismo período |
| **Disco / conexiones** | Recursos al límite | Métricas servidor o reporte IT |
| **Jobs / ETL** | Cron o jobs fallidos sin aviso | SQL Agent, cron logs, herramienta ETL |

### Priorización en el informe

1. **Urgente (crítico):** riesgo de pérdida de datos, cierre incorrecto, duplicados masivos
2. **Prioritario (warn):** performance, crecimiento, desvíos menores Excel vs sistema
3. **OK:** documentar lo que está sano (genera confianza)

---

## Fase 4 — Entregables

### Obligatorios (incluidos en el piloto)

1. **Informe ejecutivo** — 1 página para gerencia  
   - Usá `/informe` como referencia de formato e imprimí a PDF desde el navegador, **o**  
   - Documento Word/Google Docs con: score resumen, top 3–5 hallazgos, impacto, recomendación, próximos pasos

2. **Lista priorizada de recomendaciones** — qué hacer primero, segundo, tercero

3. **Reunión de entrega** (30–45 min) — walkthrough del informe con negocio + IT si aplica

### Opcional (refuerza la venta)

4. **Panel demo personalizado** — JSON importado en DataPulse  
   - Exportá estructura desde `/configuracion` con demo actual  
   - Editá `organization`, `dataSources`, `checks` con hallazgos reales (sin datos sensibles en descripciones si no hay NDA)  
   - Importá en `/configuracion` → mostrá `/overview` y `/alertas` en la reunión de cierre

### Estructura del JSON (referencia)

Archivo: `src/lib/types.ts` → tipo `DataHealthStore` (versión 1).

Campos mínimos a personalizar:

- `organization.name` → nombre del cliente
- `dataSources[]` → sus fuentes reales (postgres, sqlserver, excel_import)
- `checks[]` → cada hallazgo con `status`, `impact`, `recommendation`, `scoreImpact`

---

## Fase 5 — Reunión de cierre (día 7)

### Guión (30–45 min)

1. **Contexto** (2 min): qué revisamos y con qué acceso
2. **Score / semáforo** (3 min): lectura ejecutiva del estado general
3. **Top hallazgos** (15 min): 3–5 items con impacto en negocio, no jerga técnica
4. **Recomendaciones** (10 min): orden de ataque + esfuerzo estimado (bajo/medio/alto)
5. **Demo** (5 min, opcional): panel con JSON importado
6. **Próximo paso** (5 min): oferta monitor mensual

### Qué decir al cerrar

> *"El piloto es un diagnóstico puntual. Si quieren que esto se revise solo cada semana o mes, el plan Monitor mensual incluye checks automáticos, alertas y dashboard actualizado — desde USD 99/mes. ¿Les sirve que les mande propuesta?"*

| Plan | Precio ref. | Cuándo ofrecerlo |
|------|-------------|------------------|
| Monitor mensual | USD 99–199/mes | Cliente con dolor recurrente, IT limitado |
| Monitor + soporte | USD 299+/mes | Quieren horas DBA + SLA |

---

## Qué NO prometer en el piloto

- Conexión en vivo 24/7 a su producción desde la demo pública
- Corrección de datos o cambios en su base (solo diagnóstico)
- Integración con todos sus sistemas en 7 días
- Caso de estudio con nombre sin permiso escrito

---

## Checklist final (antes de dar por cerrado el piloto)

- [ ] Informe entregado (PDF o link)
- [ ] Reunión de cierre hecha
- [ ] Cliente confirmó recepción por mail
- [ ] Propuesta de monitor enviada (si hubo interés)
- [ ] Aprendizajes copiados a `../ROADMAP.md` → Aprendizajes de validación
- [ ] Credenciales del cliente revocadas o acordada fecha de baja de acceso
- [ ] (Opcional) Permiso para caso de estudio anónimo

---

## Archivos relacionados

| Archivo | Uso |
|---------|-----|
| `COPY.md` | Textos comerciales y pricing |
| `README.md` | Guión demo 15 min |
| `../_general/VALIDACION.md` | Preguntas **antes** de vender el piloto |
| `src/lib/types.ts` | Estructura del JSON para demo personalizada |
| `src/lib/demo-data.ts` | Ejemplo de checks completos |
| `clientes/_plantilla/NOTAS.md` | Plantilla de seguimiento por cliente |
| `clientes/README.md` | Cómo crear carpeta por cliente |
| `ROADMAP-IA.md` | Evolución producto: IA, automatización, remediación |
| `playbooks/` | Recetas operativas (alimentan fase 2+) |

---

## Registro por cliente

Copiá `clientes/_plantilla/` a `clientes/nombre-empresa/` y completá `NOTAS.md`. Ver `clientes/README.md`.
