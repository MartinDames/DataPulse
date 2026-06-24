# Clientes — DataPulse piloto

Carpeta para notas operativas de cada piloto. **No subas datos sensibles al repo** (credenciales, exports con PII, JSON con datos reales).

## Cómo empezar un cliente nuevo

1. Copiá la plantilla:
   ```bash
   cp -r clientes/_plantilla clientes/nombre-empresa
   ```
   En Windows (PowerShell):
   ```powershell
   Copy-Item -Recurse clientes\_plantilla clientes\nombre-empresa
   ```

2. Completá `clientes/nombre-empresa/NOTAS.md` durante el kickoff.

3. Guardá entregables locales en esa carpeta (informe PDF, JSON demo, exports) — quedan ignorados por git.

4. Seguí el runbook: `../PILOTO-ONBOARDING.md`

## Estructura sugerida por cliente

```text
clientes/
  nombre-empresa/
    NOTAS.md          ← seguimiento del piloto
    entregables/      ← PDF informe, propuesta (local, no en git)
    datos/            ← exports CSV, dumps anonimizados (local, no en git)
    demo-store.json   ← JSON para importar en /configuracion (local, no en git)
  _plantilla/         ← copiar para cada cliente nuevo
```

## Qué sí va en git

- `README.md` (este archivo)
- `clientes/_plantilla/NOTAS.md`

## Qué no va en git

Cualquier carpeta de cliente real y archivos con datos del cliente (ver `.gitignore`).
