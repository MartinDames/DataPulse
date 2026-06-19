import { Suspense } from "react";
import { AlertasClient } from "@/components/screens/alertas-client";

export default function AlertasPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--muted)]">Cargando tickets…</p>}>
      <AlertasClient />
    </Suspense>
  );
}
