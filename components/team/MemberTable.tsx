"use client";

import { Trash2 } from "lucide-react";
import { Avatar, Pill } from "@/components/ui/Bits";
import { GrowBar } from "@/components/ui/Motion";
import type { Member } from "@/lib/types";
import { formatNaira } from "@/lib/utils";

export interface MemberStats {
  total: number;
  count: number;
}

interface MemberTableProps {
  members: Member[];
  /** This month's sales for each member, keyed by their user id. */
  stats: Map<string, MemberStats>;
  currentUid: string;
  canManage: boolean;
  onRemove: (member: Member) => void;
}

const columns = "md:grid md:grid-cols-[2.4fr_1fr_2fr_1.1fr_52px] md:items-center md:gap-3.5";

export function MemberTable({ members, stats, currentUid, canManage, onRemove }: MemberTableProps) {
  const highest = Math.max(1, ...[...stats.values()].map((entry) => entry.total));

  return (
    <div className="tabular">
      <div className={`${columns} table-head hidden py-3`}>
        <span>Member</span>
        <span>Role</span>
        <span>Sales this month</span>
        <span>Status</span>
        <span />
      </div>
      {members.map((member, index) => {
        const entry = (member.uid && stats.get(member.uid)) || { total: 0, count: 0 };
        const isYou = member.uid === currentUid;
        const invited = member.status === "invited";
        return (
          <div
            key={member.id}
            className={`${columns} flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line py-3.5`}
          >
            <div className="flex min-w-0 basis-full items-center gap-3 md:basis-auto">
              <Avatar name={member.name} tone={member.role === "owner" ? "forest" : invited ? "gold" : "mint"} />
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {member.name}
                  {isYou && " (you)"}
                </p>
                <p className="truncate text-[13px] text-muted">{member.email}</p>
              </div>
            </div>
            <span>{member.role === "owner" ? "Owner" : "Sales staff"}</span>
            <div className="flex basis-full flex-col gap-1.5 md:basis-auto">
              <div className="flex justify-between gap-2">
                <strong>{formatNaira(entry.total)}</strong>
                <span className="text-muted">
                  {entry.count === 0 ? "No sales yet" : `${entry.count} ${entry.count === 1 ? "sale" : "sales"}`}
                </span>
              </div>
              <div className="h-2 rounded-full bg-ground">
                <GrowBar
                  direction="right"
                  size={`${(entry.total / highest) * 100}%`}
                  delay={0.2 + index * 0.1}
                  className="h-2 rounded-full bg-brand"
                />
              </div>
            </div>
            {invited ? <Pill tone="gold">Invited</Pill> : <Pill>Active</Pill>}
            <div className="flex justify-end">
              {canManage && member.role !== "owner" && (
                <button
                  type="button"
                  onClick={() => onRemove(member)}
                  aria-label={`Remove ${member.name}`}
                  className="flex size-11 items-center justify-center rounded-xl text-danger hover:bg-danger-soft"
                >
                  <Trash2 className="size-[18px]" aria-hidden />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
