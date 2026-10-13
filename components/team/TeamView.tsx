"use client";

import { useMemo, useState } from "react";
import { inviteMember, removeMember } from "@/firebase-actions";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { PageHeader, Pill, Skeleton } from "@/components/ui/Bits";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Reveal } from "@/components/ui/Motion";
import { useMembers, useSales } from "@/lib/hooks";
import type { Member } from "@/lib/types";
import { errorMessage, monthRange } from "@/lib/utils";
import { MemberForm } from "./MemberForm";
import { MemberTable, type MemberStats } from "./MemberTable";

export function TeamView() {
  const { profile } = useAuth();
  const toast = useToast();
  const [today] = useState(() => new Date());
  const members = useMembers();
  const monthSales = useSales(useMemo(() => monthRange(today), [today]));
  const [removing, setRemoving] = useState<Member | null>(null);

  const isOwner = profile!.role === "owner";

  const stats = useMemo(() => {
    const totals = new Map<string, MemberStats>();
    for (const sale of monthSales.data) {
      const entry = totals.get(sale.soldById) ?? { total: 0, count: 0 };
      totals.set(sale.soldById, { total: entry.total + sale.total, count: entry.count + 1 });
    }
    return totals;
  }, [monthSales.data]);

  // Owner first, then active members by sales, then pending invites.
  const ordered = [...members.data].sort((a, b) => {
    const rank = (member: Member) => (member.role === "owner" ? 0 : member.status === "active" ? 1 : 2);
    const sales = (member: Member) => (member.uid && stats.get(member.uid)?.total) || 0;
    return rank(a) - rank(b) || sales(b) - sales(a);
  });
  const activeCount = ordered.filter((member) => member.status === "active").length;
  const invitedCount = ordered.length - activeCount;

  async function handleInvite(name: string, email: string) {
    await inviteMember(profile!, name, email);
    toast(`${name.trim()} added to your team`);
    members.reload();
  }

  async function handleRemove() {
    try {
      await removeMember(profile!.businessId, removing!);
      toast(`${removing!.name} removed`);
      members.reload();
    } catch (reason) {
      toast(errorMessage(reason), "error");
    }
    setRemoving(null);
  }

  return (
    <>
      <PageHeader
        title="Team"
        subtitle={`People who can record sales for ${profile!.businessName}. Every sale shows who made it.`}
      />

      <div className={`grid items-start gap-4 ${isOwner ? "xl:grid-cols-[2fr_1fr]" : ""}`}>
        <Reveal immediate>
          <section className="card flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[19px] font-bold">Members</h2>
              <Pill>
                {activeCount} active{invitedCount > 0 && ` · ${invitedCount} invited`}
              </Pill>
            </div>
            {members.loading ? (
              <div className="flex flex-col gap-3 pt-2">
                {[0, 1, 2].map((item) => (
                  <Skeleton key={item} className="h-16" />
                ))}
              </div>
            ) : (
              <MemberTable
                members={ordered}
                stats={stats}
                currentUid={profile!.uid}
                canManage={isOwner}
                onRemove={setRemoving}
              />
            )}
          </section>
        </Reveal>

        {isOwner && (
          <Reveal immediate delay={0.1}>
            <MemberForm onInvite={handleInvite} />
          </Reveal>
        )}
      </div>

      <ConfirmDialog
        open={removing !== null}
        title="Remove member?"
        body={`${removing?.name ?? "This member"} will no longer be able to record sales for your business. Sales they already recorded keep their name.`}
        confirmLabel="Remove member"
        onConfirm={handleRemove}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}
