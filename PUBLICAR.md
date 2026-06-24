# DataPulse — Guía para publicar

> Checklist operativo para lanzar comercialmente.  
> Links fijos: **Landing** [data-health.vercel.app](https://data-health.vercel.app) · **Demo** [/overview](https://data-health.vercel.app/overview) · **Calendly** [30 min](https://calendly.com/damessystems/30min) · **Email** damessystems@gmail.com

---

## Antes del primer post (15 min)

- [ ] Enviar solicitud de prueba en el formulario de la landing → confirmar mail en damessystems@gmail.com
- [ ] Abrir Calendly y confirmar que el slot de 30 min está disponible
- [ ] Sacar 2 screenshots: Overview (score crítico) + Alertas (lista con urgentes)
- [ ] Actualizar LinkedIn personal: headline, acerca de, link a landing o Calendly
- [ ] (Opcional) Crear página empresa DamesSystems en LinkedIn

---

## Dónde publicar (prioridad)

| Prioridad | Canal | Objetivo |
|-----------|-------|----------|
| **1** | WhatsApp — red caliente | Primeras 3–5 charlas esta semana |
| **2** | LinkedIn personal (Martín Dames) | Autoridad + outreach B2B |
| **3** | Calendly + landing | Convertir interés en reunión |
| **4** | LinkedIn DamesSystems | Marca empresa (repost del personal) |
| **5** | Instagram | Carruseles con screenshots (link en bio) |
| **6** | GitHub DataPulse | Credibilidad técnica, no venta directa |

**No priorizar aún:** Google Ads, SEO agresivo, TikTok, foros de developers.

---

## Semana 1 — plan día a día

| Día | Acción | Meta |
|-----|--------|------|
| Lun | Post lanzamiento LinkedIn + actualizar perfil | 1 publicación live |
| Mar | 5 mensajes WhatsApp (red caliente) | 2 respuestas |
| Mié | 5 DMs/mensajes LinkedIn personalizados | 1 charla agendada |
| Jue | Follow-up a quien no respondió + 1 post dolor #2 | — |
| Vie | 1 demo de 15 min (aunque sea con conocido) | Practicar guión README |

**Meta semana 1:** 3 charlas agendadas, no volumen de visitas.

---

## Posts listos para copiar

### LinkedIn — Lanzamiento (publicar primero)

```
Tus datos te están fallando en silencio.

Muchas PyMEs viven entre Excel, un ERP viejo y una base de datos que nadie revisa hasta que explota: facturación, stock, cierre de mes.

Armé DataPulse (DamesSystems): un panel con score de salud, alertas claras e informe para gerencia — sin contratar un DBA full-time.

Lo que ves online es una demo con datos de ejemplo. Si encaja con tu realidad, hacemos un piloto de diagnóstico en 7 días (solo lectura, sin tocar producción).

Demo interactiva → https://data-health.vercel.app/overview
Agendar 15 min → https://calendly.com/damessystems/30min

#PyME #datos #operaciones #DBA
```

**Imagen:** screenshot del Overview con score ~26 y semáforo Crítico.

---

### LinkedIn — Dolor #2 (3–4 días después)

```
¿Excel y el sistema cierran el mismo número?

En la mayoría de las PyMEs que charlo, la respuesta es "depende del día".

Eso no es un error de una persona: es falta de visibilidad sobre la salud de los datos.

DataPulse detecta desvíos (Excel vs ERP, duplicados, backups sin verificar) antes de que cuesten una reunión del lunes o un cierre de mes.

Demo → https://data-health.vercel.app

¿Te pasó algo así en los últimos 6 meses? Contame en comentarios o por DM.
```

---

### LinkedIn — Dolor #3 (siguiente semana)

```
¿Cuándo fue la último backup que realmente verificaste?

No "que corrió". Que probaste restaurar.

En la demo de DataPulse el check de backup aparece como Urgente — porque es el incidente que más duele cuando pasa.

Piloto de 7 días: diagnóstico + informe ejecutivo. Sin compromiso de mensual.

https://data-health.vercel.app
```

---

### WhatsApp — red caliente

```
Hola [nombre], ¿cómo estás?

Estoy lanzando un servicio para PyMEs que tienen base de datos o procesos con Excel pero nadie revisa si los datos están sanos (backups, duplicados, números que no cierran).

En 15 min te muestro un panel con datos de ejemplo. Si encaja, vemos un piloto de 7 días.

Demo: https://data-health.vercel.app/overview
¿Te sirve una charla esta semana?
```

---

### WhatsApp — follow-up (3 días sin respuesta)

```
Hola [nombre], te escribí el [día] por DataPulse — sin presión.

Si no es prioridad ahora, todo bien. Si querés ver la demo en 2 min: https://data-health.vercel.app/overview

Cualquier cosa avisame.
```

---

### LinkedIn DM — contacto frío

```
Hola [nombre] — vi que estás en [rubro/empresa].

Estoy validando un servicio de salud de datos para PyMEs: detectar problemas antes de que cuesten plata (Excel vs sistema, backups, inconsistencias).

¿Tendrías 15 min para contarme si esto les duele o no? Te muestro la demo. No es venta en esa llamada.

Martín · DamesSystems
```

---

## Perfil LinkedIn — textos sugeridos

### Headline

```
Salud de datos para PyMEs · Fundador DamesSystems · DataPulse
```

### Acerca de (primeras 3 líneas)

```
Ayudo a PyMEs a detectar problemas de datos antes de que cuesten plata: backups, duplicados, Excel vs sistema.

DataPulse (DamesSystems) — panel + informe ejecutivo sin contratar un DBA full-time.

Demo: https://data-health.vercel.app
```

### Enlace destacado

- Título: `DataPulse — Demo`
- URL: `https://data-health.vercel.app`

---

## Cuando alguien responde

| Situación | Qué mandar |
|-----------|------------|
| Quiere ver ya | Link `/overview` + ofrecer Calendly |
| Pregunta precio | Piloto USD 300–500, 7 días, sin mensual obligatorio |
| ¿Es producto terminado? | Demo con datos ejemplo; piloto con sus fuentes en solo lectura |
| Cierra piloto | `PILOTO-ONBOARDING.md` + `clientes/_plantilla/` |

---

## Dominio propio (opcional)

Hoy: `https://data-health.vercel.app` — alcanza para empezar.

### Si comprás un dominio (ej. `datapulse.com`, `damessystems.com`)

1. Comprar dominio en Namecheap, Cloudflare, Google Domains, etc.
2. En terminal, desde la carpeta del proyecto:

```bash
cd "C:\Users\marti\OneDrive\Desktop\Emprender\Emprender\Dashboards\Prototipos\data-health"
vercel domains add tudominio.com
```

3. Vercel muestra registros DNS (CNAME o A). Configuralos en tu registrador.
4. Esperar propagación (5 min – 48 h).
5. En Vercel Dashboard → proyecto `data-health` → Settings → Domains → marcar como primary.
6. Actualizar links en LinkedIn, Calendly y posts.

### Subdominio recomendado

| Dominio paraguas | Subdominio producto |
|------------------|---------------------|
| `damessystems.com` | `datapulse.damessystems.com` |

---

## Qué NO prometer al publicar

- Conexión automática 24/7 desde la demo pública
- Corrección de datos en producción (solo diagnóstico en piloto)
- Caso de estudio con nombre sin permiso escrito
- "Hacemos webs" — mata el posicionamiento

---

## Archivos relacionados

| Archivo | Uso |
|---------|-----|
| `COPY.md` | Textos landing y outreach |
| `../_general/VALIDACION.md` | Preguntas en charlas pre-venta |
| `PILOTO-ONBOARDING.md` | Cuando cierra piloto |
| `README.md` | Guión demo 15 min |
