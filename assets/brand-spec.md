# DataPulse — Brand spec (Huashu-Design)

> Empresa: **DamesSystems** · Producto: **DataPulse**  
> Fecha: 2026-06-07 (actualizado 2026-06-11)  
> Dirección: **Observatorio editorial oscuro** — catálogo astronómico × panel de monitoreo B2B.  
> Referencia Huashu: Cosmic Retro-Futurism + Dark Editorial (sin GitHub-dark lazy glow).

## Supuestos

1. Producto ficticio demo para PyMEs — sin logo corporativo externo.
2. Isotipo: monograma `DP` + pulso radial (CSS, no SVG ilustrado).
3. Público: gerente / dueño PyME, no dev — copy en español, datos legibles.

## Paleta (oklch · CSS variables en `globals.css`)

| Rol | Token | Nota |
|-----|-------|------|
| Fondo profundo | `--bg` | Tinta fría, no `#0D1117` uniforme |
| Superficie | `--card` | Elevación sutil |
| Texto principal | `--fg` | Off-white cálido |
| Texto secundario | `--muted` | Labels, metadata |
| Acento señal | `--accent` | Cobalto — monitoreo, confianza técnica |
| Acento secundario | `--accent-2` | Teal susurro, gradientes |
| Crítico | `--status-critical` | Rosa apagado, no alarmismo |
| Advertencia | `--status-warn` | Ámbar editorial |
| OK | `--status-ok` | Verde contenedor |
| Informe (print) | `--cream` | Papel pergamino ejecutivo |

## Tipografías

- **Display / score / títulos**: Newsreader (serif editorial)
- **UI / cuerpo**: IBM Plex Sans
- **Códigos / metadata / checks**: IBM Plex Mono

## Anti-slop (Huashu checklist)

- [x] Sin purple gradient hero
- [x] Sin emoji como iconos
- [x] Sin Inter/Roboto como display
- [x] Un acento dominante (cobalto), no arcoíris
- [x] `text-wrap: pretty` en párrafos
- [x] Placeholder honesto donde falte asset real

## Tweaks (variantes demo)

| Preset | Uso |
|--------|-----|
| Cobalto | Default — observatorio |
| Terracota | Cliente cálido / editorial |
| Señal | Alto contraste para presentación |

## Landing comercial (Huashu · 2026-06-11)

| Elemento | Implementación |
|----------|----------------|
| Dirección | Observatorio editorial — radar CSS, grid sutil, serif display |
| Animación entrada | Coreografía única al load (hero stagger + preview delay) |
| Hero interactivo | Preview panel: score 0→26, alertas rotativas, link a `/overview` |
| Scroll | `IntersectionObserver` reveals + stagger en grillas |
| Interacción | Pain cards seleccionables, chips de checks filtrables, timeline piloto |
| Motion safe | `prefers-reduced-motion` desactiva animaciones |
| CSS | `src/components/landing/landing.css` |
