import { members } from "@/components/mock-data";
import { notFound } from "next/navigation";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const member = members.find((item) => item.id === memberId);
  if (!member) {
    notFound();
  }

  return (
    <section className="max-w-xl rounded-xl border border-line bg-panel p-4">
      <h2 className="font-[var(--font-display)] text-xl">{member.name}</h2>
      <p className="mt-1 text-xs uppercase tracking-wide text-muted">Role: {member.role}</p>
      <p className="mt-4 text-sm text-slate-300">
        Member profile view placeholder with real route. Next iteration will include permission scopes, cycle capacity and
        audit trail details.
      </p>
    </section>
  );
}

