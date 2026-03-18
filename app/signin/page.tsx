import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { clientEnv } from "@/lib/client-env";

export default function SignInPage() {
  if (clientEnv.NEXT_PUBLIC_AUTH_PROVIDER !== "clerk") {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8">
        <section className="w-full max-w-md rounded-2xl border border-line bg-panel p-5 shadow-soft">
          <h1 className="mb-2 font-[var(--font-display)] text-xl">Auth no configurada</h1>
          <p className="mb-4 text-sm text-muted">
            Este entorno ya no expone un workspace demo. Configura `NEXT_PUBLIC_AUTH_PROVIDER=clerk` y claves válidas de Clerk para entrar.
          </p>
          <Link href="/" className="inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
            Volver al inicio
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border border-line bg-panel p-5 shadow-soft">
        <h1 className="mb-4 font-[var(--font-display)] text-xl">Accede a Pulseboard</h1>
        <SignIn forceRedirectUrl="/app" />
      </section>
    </main>
  );
}
