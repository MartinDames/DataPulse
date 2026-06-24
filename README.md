# DataPulse — Demo Salud de Datos

Producto de **DamesSystems**. Prototipo comercial del wedge **Data Health**: score global, alertas, detalle de checks e informe ejecutivo imprimible.

## Qué incluye (MVP)

| Pantalla | Ruta | Contenido |
|----------|------|-----------|
| **Overview** | `/overview` | Score 0–100, semáforo, fuentes, últimos checks |
| **Alertas** | `/alertas` | Lista con severidad, impacto, recomendación |
| **Detalle** | `/alertas/[id]` | Tendencia 14 días, metadata, acciones |
| **Informe** | `/informe` | Resumen ejecutivo 1 página · Imprimir/PDF |
| **Configuración** | `/configuracion` | Import/export JSON · Reset demo |

Persistencia: `localStorage` (sin backend). Ideal para demos comerciales y personalización por cliente vía JSON.

## Cómo correrlo

```bash
cd "C:\Users\marti\OneDrive\Desktop\Emprender\Emprender\Dashboards\Prototipos\data-health"
npm install
npm run dev
```

- **Landing comercial:** `http://localhost:3000`
- **Demo interactiva:** `http://localhost:3000/overview`

Copy de la landing: `COPY.md`  
Runbook cuando cierre un piloto: `PILOTO-ONBOARDING.md`  
Notas por cliente: `clientes/` (plantilla en `clientes/_plantilla/`)

## Guión demo (15 min)

1. **Overview** — mostrar score ~26/100 y semáforo "Crítico". Contar: *"nadie mira la base hasta que explota"*.
2. **Alertas** — filtrar críticos: backup, duplicados, Excel vs ERP.
3. **Detalle** — abrir backup o duplicados; mostrar tendencia y recomendación.
4. **Informe** — botón Imprimir → PDF para gerencia.
5. **Tweaks** — cambiar acento Emerald → parece producto del cliente.

## Paquete comercial

| Plan | Precio ref. | Entregable |
|------|-------------|------------|
| Piloto diagnóstico | USD 300–500 | 7 días, informe + recomendaciones |
| Monitor mensual | USD 99–199/mes | Checks automáticos + alertas |
| Monitor + soporte | USD 299+/mes | + horas consultoría DBA |

## Diseño (Huashu-Design)

Dirección visual: **Observatorio editorial oscuro** — ver `assets/brand-spec.md`.

- Tipografías: Newsreader + IBM Plex Sans + IBM Plex Mono
- Paleta: oklch cobalto (sin purple-gradient slop)
- Skill instalada en `~/.cursor/skills/huashu-design`

## Spec completa

Ver `../_general/MVP.md` y `../ROADMAP.md`.
