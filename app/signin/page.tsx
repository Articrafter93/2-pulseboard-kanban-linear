import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { clientEnv } from "@/lib/client-env";

export default function SignInPage() {
  if (clientEnv.NEXT_PUBLIC_AUTH_PROVIDER !== "clerk") {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8">
        <section className="w-full max-w-md rounded-2xl border border-line bg-panel p-5 shadow-soft">
          <h1 className="mb-2 font-[var(--font-display)] text-xl">Demo access</h1>
          <p className="mb-4 text-sm text-muted">
            Mock auth is enabled for audit mode. Open the seeded workspace to review the complete experience without Clerk.
          </p>
          <div className="mb-4 rounded-xl border border-line bg-panelAlt p-3 text-sm text-slate-300">
            <p className="font-medium text-white">Demo credentials</p>
            <p>Email: mockuser@test.com</p>
            <p>Password: MockPass123!</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/app/w/default/board" className="inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
              Enter demo workspace
            </Link>
            <Link href="/" className="inline-flex rounded-lg border border-line px-4 py-2 text-sm font-semibold text-white">
              Back to home
            </Link>
          </div>
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
