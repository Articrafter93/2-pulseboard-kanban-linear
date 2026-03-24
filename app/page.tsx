import Link from "next/link";

export default function HomePage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Pulseboard",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "Premium collaborative work management for fast teams.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <div className="glass rounded-3xl p-6 md:p-10">
        <div className="mb-8 flex items-center justify-between">
          <strong className="font-[var(--font-display)] text-xl">Pulseboard</strong>
          <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
            premium collaborative SaaS
          </span>
        </div>
        <h1 className="max-w-3xl font-[var(--font-display)] text-4xl leading-tight md:text-6xl">
          Work management that feels fast, clean and expensive.
        </h1>
        <p className="mt-4 max-w-2xl text-muted md:text-lg">
          Built for creative and technical teams that need clarity, realtime collaboration and operational visibility.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-xl bg-accent px-5 py-3 font-semibold text-white transition hover:brightness-110"
          >
            Create Workspace
          </Link>
          <Link href="/signin" className="rounded-xl border border-line px-5 py-3 font-semibold hover:bg-panel">
            Sign in
          </Link>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <InfoCard title="Realtime by design" body="Socket.IO service + Redis Pub/Sub for presence and live updates." />
          <InfoCard title="Role-aware access" body="Organizations and RBAC modeled for owner/admin/member/guest." />
          <InfoCard title="Executive clarity" body="Dashboards for workload, overdue tasks and activity auditing." />
        </div>
      </div>

      <footer className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-panel/90 px-4 py-3">
        <p className="text-xs text-muted">Official social links pending client confirmation.</p>
        <div className="flex items-center gap-2">
          <SocialLink href="https://www.linkedin.com" label="LinkedIn" icon={<LinkedInIcon />} />
          <SocialLink href="https://x.com" label="X" icon={<XIcon />} />
          <SocialLink href="https://github.com" label="GitHub" icon={<GitHubIcon />} />
        </div>
      </footer>
    </main>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-xl border border-line bg-panelAlt p-4">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </article>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-panelAlt text-slate-200 hover:border-accent hover:text-accent"
    >
      {icon}
    </a>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5ZM.5 8h4V23h-4V8Zm7 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.09V23h-4v-7.34c0-1.75-.03-4-2.44-4-2.45 0-2.83 1.91-2.83 3.88V23h-4V8Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M18.9 2H22l-6.78 7.74L23.2 22H16.9l-4.93-6.43L6.3 22H3.2l7.25-8.28L.8 2h6.46l4.45 5.94L18.9 2Zm-1.1 18h1.72L6.2 3.9H4.35L17.8 20Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.82-.25.82-.57v-2.1c-3.34.73-4.05-1.42-4.05-1.42-.55-1.38-1.33-1.74-1.33-1.74-1.08-.73.08-.71.08-.71 1.2.08 1.83 1.22 1.83 1.22 1.05 1.8 2.76 1.28 3.44.98.1-.76.42-1.28.76-1.57-2.67-.3-5.48-1.32-5.48-5.87 0-1.3.47-2.37 1.22-3.2-.12-.3-.53-1.55.12-3.22 0 0 1-.32 3.3 1.22a11.5 11.5 0 0 1 6 0c2.3-1.54 3.3-1.22 3.3-1.22.65 1.67.24 2.92.12 3.22.76.83 1.22 1.9 1.22 3.2 0 4.56-2.81 5.56-5.5 5.86.44.37.82 1.1.82 2.25v3.33c0 .32.22.7.83.57A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}
