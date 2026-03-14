import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { clientEnv } from "@/lib/client-env";

export default function SignUpPage() {
  if (clientEnv.NEXT_PUBLIC_AUTH_PROVIDER !== "clerk") {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8">
        <section className="w-full max-w-md rounded-2xl border border-line bg-panel p-5 shadow-soft">
          <h1 className="mb-2 font-[var(--font-display)] text-xl">Registro mock activo</h1>
          <p className="mb-4 text-sm text-muted">
            Para habilitar alta real con Clerk, configura claves válidas y `NEXT_PUBLIC_AUTH_PROVIDER=clerk`.
          </p>
          <Link href="/app/w/default/board" className="inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
            Ir al tablero demo
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border border-line bg-panel p-5 shadow-soft">
        <h1 className="mb-4 font-[var(--font-display)] text-xl">Crea tu workspace Pulseboard</h1>
        <SignUp forceRedirectUrl="/app/w/default/board" />
      </section>
    </main>
  );
}