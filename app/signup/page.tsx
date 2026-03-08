import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <section className="w-full rounded-2xl border border-line bg-panel p-6">
        <h1 className="font-[var(--font-display)] text-2xl">Create account</h1>
        <p className="mt-1 text-sm text-muted">
          This screen will connect to Clerk Organizations/Auth in implementation phase.
        </p>
        <form className="mt-5 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs text-muted">Work email</span>
            <input
              type="email"
              className="w-full rounded-lg border border-line bg-panelAlt px-3 py-2 outline-none ring-accent focus:ring-2"
              placeholder="you@company.com"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-muted">Workspace name</span>
            <input
              type="text"
              className="w-full rounded-lg border border-line bg-panelAlt px-3 py-2 outline-none ring-accent focus:ring-2"
              placeholder="Acme Studio"
            />
          </label>
          <label className="flex items-start gap-2 rounded-lg border border-line bg-panelAlt px-3 py-2 text-xs text-slate-300">
            <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-accent" />
            <span>
              Acepto el tratamiento de datos segun la{" "}
              <Link href="/privacidad" className="text-accent hover:underline">
                politica de privacidad
              </Link>
              .
            </span>
          </label>
          <button type="submit" className="w-full rounded-lg bg-accent py-2 font-semibold text-[#2b1b00]">
            Create workspace
          </button>
        </form>
        <p className="mt-4 text-sm text-muted">
          Already have an account?{" "}
          <Link href="/signin" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mt-2 text-xs text-muted">
          Detalles de privacidad y conservacion de datos en{" "}
          <Link href="/privacidad" className="text-accent hover:underline">
            /privacidad
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
