import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "DataPulse — Salud de datos para PyMEs",
  description:
    "Detectamos backups vencidos, duplicados e inconsistencias antes de que cuesten plata. Diagnóstico en 7 días, sin contratar un DBA full-time.",
  openGraph: {
    title: "Tus datos te están fallando en silencio",
    description:
      "Monitoreo de salud de datos para PyMEs. Alertas claras e informe ejecutivo.",
    type: "website",
    locale: "es_AR",
  },
};

export default function Home() {
  return <LandingPage />;
}
