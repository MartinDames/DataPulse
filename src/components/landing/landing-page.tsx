"use client";

import Link from "next/link";
import { useState } from "react";
import { HeroPreview } from "@/components/landing/hero-preview";
import { LandingNav } from "@/components/landing/landing-nav";
import { Reveal } from "@/components/landing/reveal";
import {
  CHECKS,
  FOR_WHO,
  NOT_FOR,
  PAINS,
  PLANS,
  SOLUTIONS,
  STEPS,
} from "@/lib/landing-data";
import "./landing.css";

export function LandingPage() {
  const [activePain, setActivePain] = useState<string>(PAINS[0].id);
  const [activeChecks, setActiveChecks] = useState<Set<string>>(
    () => new Set(CHECKS.map((c) => c.id)),
  );
  const [activeStep, setActiveStep] = useState("1");

  const toggleCheck = (id: string) => {
    setActiveChecks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedPain = PAINS.find((p) => p.id === activePain) ?? PAINS[0];
  const selectedStep = STEPS.find((s) => s.n === activeStep) ?? STEPS[0];

  return (
    <div className="landing-root relative z-[1]">
      <LandingNav />

      <main>
        {/* Hero — two column observatorio */}
        <section className="relative overflow-hidden">
          <div
            className="landing-radar absolute left-[8%] top-24 h-64 w-64 opacity-25 max-md:hidden"
            aria-hidden
          />
          <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-12 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12 md:pt-16 lg:pt-20">
            <div>
              <p className="landing-hero-in font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
                Monitoreo de salud de datos · PyMEs
              </p>
              <h1 className="landing-hero-in pretty mt-4 font-display text-4xl font-semibold leading-[1.06] tracking-tight text-[var(--fg)] md:text-5xl lg:text-[3.35rem]">
                Tus datos te están fallando{" "}
                <span className="text-[color:color-mix(in_oklch,var(--fg)_55%,var(--muted))]">en silencio.</span>
              </h1>
              <p className="landing-hero-in pretty mt-5 max-w-xl text-base leading-relaxed text-[color:color-mix(in_oklch,var(--fg)_72%,var(--muted))] md:text-lg">
                Monitoreamos la salud de tu base de datos y procesos críticos. Alertas claras para gerencia — sin contratar un DBA full-time.
              </p>
              <div className="landing-hero-in mt-8 flex flex-wrap items-center gap-3">
                <a href="#contacto" className="btn-primary inline-flex px-5 py-2.5 text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  Solicitar diagnóstico piloto
                </a>
                <a
                  href="https://calendly.com/damessystems/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost inline-flex px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Agendar 15 min →
                </a>
                <Link
                  href="/overview"
                  className="btn-ghost inline-flex px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Ver demo interactiva →
                </Link>
              </div>
              <p className="landing-hero-in pretty mt-8 max-w-lg text-sm text-[var(--muted)]">
                Para equipos que viven entre Excel, sistemas viejos y una base que nadie revisa.
              </p>
              <blockquote className="landing-hero-in pretty mt-6 border-l-2 border-[color:color-mix(in_oklch,var(--accent)_45%,transparent)] pl-4 font-display text-sm italic leading-relaxed text-[color:color-mix(in_oklch,var(--fg)_70%,var(--muted))]">
                «Nadie mira la base hasta que explota.»
              </blockquote>
            </div>

            <HeroPreview />
          </div>
        </section>

        {/* Problema — interactive cards */}
        <section
          id="problema"
          className="border-t border-[color:color-mix(in_oklch,var(--border)_60%,transparent)] bg-[color:color-mix(in_oklch,var(--bg-elevated)_40%,transparent)]"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                El problema no es la base de datos.
                <br />
                <span className="text-[var(--muted)]">Es que nadie la mira.</span>
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <Reveal stagger className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                {PAINS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePain(item.id)}
                    className={[
                      "landing-pain-card surface-card p-5 text-left",
                      activePain === item.id ? "is-active" : "",
                    ].join(" ")}
                  >
                    <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--status-critical)]">
                      {item.signal}
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug">{item.title}</h3>
                    <p className="pretty mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.body}</p>
                  </button>
                ))}
              </Reveal>

              <Reveal className="surface-card flex flex-col justify-center p-6 md:p-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  Señal seleccionada
                </div>
                <p className="pretty mt-4 font-display text-xl font-semibold leading-snug md:text-2xl">
                  {selectedPain.title}
                </p>
                <p className="pretty mt-3 text-sm leading-relaxed text-[var(--muted)]">{selectedPain.body}</p>
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-[color:color-mix(in_oklch,var(--status-critical)_25%,var(--border))] bg-[color:color-mix(in_oklch,var(--status-critical)_8%,transparent)] px-4 py-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--status-critical)] opacity-40" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--status-critical)]" />
                  </span>
                  <span className="font-mono text-xs text-[color:color-mix(in_oklch,var(--fg)_80%,var(--status-critical))]">
                    {selectedPain.signal} · requiere atención
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Solución */}
        <section id="solucion" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Visibilidad antes del incidente
            </h2>
            <p className="pretty mt-3 max-w-2xl text-[var(--muted)]">
              DataPulse traduce señales técnicas en decisiones de negocio.
            </p>
          </Reveal>

          <Reveal stagger className="mt-10 grid gap-4 md:grid-cols-3">
            {SOLUTIONS.map((item) => (
              <article key={item.title} className="surface-muted p-5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
                  {item.kicker}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold">{item.title}</h3>
                <p className="pretty mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.body}</p>
              </article>
            ))}
          </Reveal>

          <Reveal className="mt-12">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Checks que monitoreamos · tocá para filtrar
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {CHECKS.map((check) => {
                const on = activeChecks.has(check.id);
                const tone =
                  check.severity === "critical" ? "var(--status-critical)" : "var(--status-warn)";
                return (
                  <li key={check.id}>
                    <button
                      type="button"
                      onClick={() => toggleCheck(check.id)}
                      className={[
                        "landing-chip flex items-center gap-2 rounded-full border border-[color:color-mix(in_oklch,var(--border)_80%,transparent)] bg-[color:color-mix(in_oklch,var(--card)_60%,transparent)] px-3 py-1.5 font-mono text-xs",
                        on ? "is-on" : "text-[color:color-mix(in_oklch,var(--fg)_65%,var(--muted))]",
                      ].join(" ")}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full transition-opacity"
                        style={{ background: tone, opacity: on ? 1 : 0.35 }}
                        aria-hidden
                      />
                      {check.label}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 font-mono text-[11px] text-[var(--muted)]">
              {activeChecks.size} de {CHECKS.length} checks activos en el monitor demo
            </p>
          </Reveal>
        </section>

        {/* Para quién */}
        <section className="border-t border-[color:color-mix(in_oklch,var(--border)_60%,transparent)] bg-[color:color-mix(in_oklch,var(--bg-elevated)_40%,transparent)]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <Reveal className="grid gap-10 md:grid-cols-2">
              <div>
                <h2 className="font-display text-xl font-semibold text-[var(--status-ok)]">Para quién es</h2>
                <ul className="mt-5 space-y-3">
                  {FOR_WHO.map((item) => (
                    <li
                      key={item}
                      className="pretty flex gap-3 text-sm leading-relaxed text-[color:color-mix(in_oklch,var(--fg)_85%,var(--muted))]"
                    >
                      <span className="mt-0.5 font-mono text-[var(--status-ok)]" aria-hidden>
                        +
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-[var(--muted)]">Para quién no es</h2>
                <ul className="mt-5 space-y-3">
                  {NOT_FOR.map((item) => (
                    <li key={item} className="pretty flex gap-3 text-sm leading-relaxed text-[var(--muted)]">
                      <span className="mt-0.5 font-mono" aria-hidden>
                        −
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Piloto — interactive timeline */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Piloto en 7 días</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal stagger className="flex flex-col gap-2">
              {STEPS.map((step) => (
                <button
                  key={step.n}
                  type="button"
                  onClick={() => setActiveStep(step.n)}
                  className={[
                    "landing-step-btn surface-muted w-full rounded-xl border border-[color:color-mix(in_oklch,var(--border)_70%,transparent)] p-4",
                    activeStep === step.n ? "is-active" : "",
                  ].join(" ")}
                >
                  <span className="font-mono text-sm font-medium text-[var(--accent)]">{step.n}</span>
                  <span className="ml-3 font-display text-base font-semibold">{step.title}</span>
                </button>
              ))}
            </Reveal>
            <Reveal className="surface-card flex flex-col justify-center p-6 md:p-8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Paso {selectedStep.n} de 3
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold">{selectedStep.title}</h3>
              <p className="pretty mt-3 text-sm leading-relaxed text-[var(--muted)]">{selectedStep.body}</p>
              <a
                href="#contacto"
                className="btn-primary mt-8 inline-flex w-fit px-4 py-2 text-sm transition-transform hover:scale-[1.02]"
              >
                Quiero empezar
              </a>
            </Reveal>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t border-[color:color-mix(in_oklch,var(--border)_60%,transparent)]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold tracking-tight">Planes</h2>
              <p className="pretty mt-2 text-sm text-[var(--muted)]">
                Empezá con el piloto — sin compromiso de mensual.
              </p>
            </Reveal>
            <Reveal stagger className="mt-10 grid gap-4 md:grid-cols-3">
              {PLANS.map((plan) => (
                <article
                  key={plan.name}
                  className={[
                    "landing-plan flex flex-col p-5",
                    plan.highlight
                      ? "surface-card is-highlight ring-1 ring-[color:color-mix(in_oklch,var(--accent)_35%,transparent)]"
                      : "surface-muted",
                  ].join(" ")}
                >
                  {plan.highlight && (
                    <span className="mb-3 w-fit rounded-full bg-[color:color-mix(in_oklch,var(--accent)_18%,transparent)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                      Recomendado
                    </span>
                  )}
                  <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-2">
                    <span className="font-display text-2xl font-semibold">{plan.price}</span>
                    <span className="ml-1 text-sm text-[var(--muted)]">{plan.period}</span>
                  </p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="text-sm text-[color:color-mix(in_oklch,var(--fg)_75%,var(--muted))]"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contacto"
                    className={
                      plan.highlight
                        ? "btn-primary mt-6 block px-4 py-2 text-center text-sm transition-transform hover:scale-[1.02]"
                        : "btn-ghost mt-6 block px-4 py-2 text-center text-sm"
                    }
                  >
                    Consultar
                  </a>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Contacto */}
        <section
          id="contacto"
          className="border-t border-[color:color-mix(in_oklch,var(--border)_60%,transparent)] bg-[color:color-mix(in_oklch,var(--bg-elevated)_50%,transparent)]"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <Reveal className="grid gap-10 md:grid-cols-2 md:items-start">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  ¿Cuánto te costó el último error de datos?
                </h2>
                <p className="pretty mt-4 text-[var(--muted)]">
                  En 15 minutos te muestro el panel con datos de ejemplo. Si encaja, armamos un piloto de 7 días.
                </p>
                <a
                  href="https://calendly.com/damessystems/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost mt-4 inline-flex px-4 py-2 text-sm font-medium"
                >
                  Agendar reunión (15 min) →
                </a>
                <p className="mt-4 font-mono text-xs text-[var(--muted)]">
                  <a
                    href="mailto:damessystems@gmail.com"
                    className="text-[var(--accent)] hover:underline"
                  >
                    damessystems@gmail.com
                  </a>
                </p>
                <Link
                  href="/overview"
                  className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--accent)] transition-transform hover:translate-x-0.5 hover:underline"
                >
                  Explorá la demo vos mismo →
                </Link>
              </div>
              <form
                action="https://formspree.io/f/mzdqnapy"
                method="POST"
                className="surface-card space-y-4 p-6"
              >
                <input type="hidden" name="_subject" value="DataPulse — solicitud piloto" />
                <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
                <div>
                  <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                    Nombre
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[color:color-mix(in_oklch,var(--bg)_60%,transparent)] px-3 py-2 text-sm text-[var(--fg)] outline-none transition-shadow focus:ring-2 focus:ring-[color:color-mix(in_oklch,var(--accent)_40%,transparent)]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[color:color-mix(in_oklch,var(--bg)_60%,transparent)] px-3 py-2 text-sm text-[var(--fg)] outline-none transition-shadow focus:ring-2 focus:ring-[color:color-mix(in_oklch,var(--accent)_40%,transparent)]"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                    Empresa
                  </label>
                  <input
                    id="company"
                    name="company"
                    className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[color:color-mix(in_oklch,var(--bg)_60%,transparent)] px-3 py-2 text-sm text-[var(--fg)] outline-none transition-shadow focus:ring-2 focus:ring-[color:color-mix(in_oklch,var(--accent)_40%,transparent)]"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                    Mensaje (opcional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="mt-1.5 w-full resize-y rounded-xl border border-[var(--border)] bg-[color:color-mix(in_oklch,var(--bg)_60%,transparent)] px-3 py-2 text-sm text-[var(--fg)] outline-none transition-shadow focus:ring-2 focus:ring-[color:color-mix(in_oklch,var(--accent)_40%,transparent)]"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full px-4 py-2.5 text-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  Enviar solicitud
                </button>
                <p className="text-center font-mono text-[10px] text-[var(--muted)]">
                  Te respondemos a{" "}
                  <a href="mailto:damessystems@gmail.com" className="text-[var(--accent)] hover:underline">
                    damessystems@gmail.com
                  </a>
                </p>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-[color:color-mix(in_oklch,var(--border)_60%,transparent)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            DataPulse · DamesSystems ·{" "}
            <a href="mailto:damessystems@gmail.com" className="hover:text-[var(--fg)]">
              damessystems@gmail.com
            </a>
          </span>
          <div className="flex flex-wrap gap-4">
            <Link href="/overview" className="transition-colors hover:text-[var(--fg)]">
              Demo interactiva
            </Link>
            <a
              href="https://calendly.com/damessystems/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--fg)]"
            >
              Agendar 15 min
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
