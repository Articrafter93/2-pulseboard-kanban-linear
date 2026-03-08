import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pulseboard | Politica de Privacidad",
  description: "Politica de privacidad, consentimiento y retencion de datos de Pulseboard.",
  alternates: {
    canonical: "/privacidad",
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-2xl border border-line bg-panel p-6">
        <h1 className="font-[var(--font-display)] text-3xl">Politica de Privacidad</h1>
        <p className="mt-3 text-sm text-muted">
          Pulseboard trata datos de usuarios para autenticacion, colaboracion y operacion del producto.
        </p>

        <h2 className="mt-6 font-semibold">Finalidades de uso</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>Gestion de cuentas y organizaciones.</li>
          <li>Asignacion y seguimiento de tareas.</li>
          <li>Registro de actividad para auditoria basica.</li>
        </ul>

        <h2 className="mt-6 font-semibold">Consentimiento</h2>
        <p className="mt-2 text-sm text-slate-300">
          Los formularios de registro solicitan consentimiento explicito antes de continuar.
        </p>

        <h2 className="mt-6 font-semibold">Retencion de datos</h2>
        <p className="mt-2 text-sm text-slate-300">
          La retencion o conservacion de datos operativos se realiza por 24 meses desde la ultima actividad del
          workspace, salvo obligaciones legales que requieran un periodo mayor.
        </p>

        <h2 className="mt-6 font-semibold">Contacto</h2>
        <p className="mt-2 text-sm text-slate-300">Para ejercer derechos de acceso, correccion o eliminacion: privacy@pulseboard.app.</p>
      </section>
    </main>
  );
}

