import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <section className="w-full rounded-2xl border border-line bg-panel p-6">
        <h1 className="font-[var(--font-display)] text-2xl">Sign in</h1>
        <p className="mt-1 text-sm text-muted">
          Clerk/Auth wiring is pending. This form is a mock screen for flow validation.
        </p>
        <form className="mt-5 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs text-muted">Email</span>
            <input
              type="email"
              className="w-full rounded-lg border border-line bg-panelAlt px-3 py-2 outline-none ring-accent focus:ring-2"
              placeholder="team@pulseboard.app"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-muted">Password</span>
            <input
              type="password"
              className="w-full rounded-lg border border-line bg-panelAlt px-3 py-2 outline-none ring-accent focus:ring-2"
              placeholder="••••••••"
            />
          </label>
          <button type="submit" className="w-full rounded-lg bg-accent py-2 font-semibold text-[#2b1b00]">
            Continue
          </button>
        </form>
        <p className="mt-4 text-sm text-muted">
          New here?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Create account
          </Link>
        </p>
        <p className="mt-2 text-xs text-muted">
          Al continuar aceptas la{" "}
          <Link href="/privacidad" className="text-accent hover:underline">
            politica de privacidad
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
