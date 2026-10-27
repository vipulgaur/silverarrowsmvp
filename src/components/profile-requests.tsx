import { useState } from "react";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Chip, Empty, Section } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROFILE_FIELDS, reviewProfileRequest } from "@/lib/logic";
import { useLookup, useStore } from "@/lib/store";
import type { ProfileField } from "@/lib/types";

export function ProfileRequests({ review = false }: { review?: boolean }) {
  const { data, me, commit, log } = useStore();
  const lk = useLookup();
  const [notes, setNotes] = useState<Record<string, string>>({});

  if (!me) return null;

  const list = data.profileRequests.filter((r) => {
    if (review) {
      return r.status === "pending" && me.role === "admin";
    }
    return r.userId === me.id || r.submittedBy === me.id || me.role === "admin";
  });

  if (review && list.length === 0) return null;

  function decide(id: string, decision: "approved" | "declined") {
    if (!me) return;
    const req = data.profileRequests.find((r) => r.id === id);
    const res = reviewProfileRequest(data, id, me, decision, notes[id] ?? "");
    const err = commit(res);
    if (err) {
      toast.error(err);
      return;
    }
    log(
      `profile_request_${decision}`,
      "user",
      `${decision === "approved" ? "Approved" : "Declined"} profile request for ${lk.user(req?.userId)?.name ?? req?.userId ?? id}`,
      req?.userId,
    );
    toast.success(`Profile change ${decision}`);
  }

  return (
    <Section
      title={review ? `Pending profile approvals (${list.length})` : "Profile change history"}
      description={
        review
          ? "Review and approve member-submitted profile updates"
          : "Submitted profile updates and review outcomes"
      }
      className="mt-6"
    >
      {list.length === 0 ? (
        <Empty>No profile change requests yet.</Empty>
      ) : (
        <div className="divide-y rounded-xl border border-border">
          {list.map((r) => {
            const target = lk.user(r.userId);
            const submitter = lk.user(r.submittedBy);
            const canDecide = r.status === "pending" && me.role === "admin";
            return (
              <div key={r.id} className="space-y-2 p-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-foreground">
                      {target?.name ?? r.userId}
                    </span>
                    <span className="ml-2 text-muted-foreground">
                      requested by {submitter?.name ?? r.submittedBy} ·{" "}
                      {format(new Date(r.createdAt), "dd MMM HH:mm")}
                    </span>
                  </div>
                  <Chip
                    tone={
                      r.status === "approved" ? "ok" : r.status === "declined" ? "expired" : "soon"
                    }
                  >
                    {r.status}
                  </Chip>
                </div>

                <div className="grid gap-1.5 rounded-lg bg-muted/40 p-2.5 sm:grid-cols-2">
                  {(Object.keys(r.changes) as ProfileField[]).map((k) => (
                    <div key={k}>
                      <span className="text-muted-foreground">{PROFILE_FIELDS[k]}: </span>
                      <span className="line-through text-muted-foreground">
                        {String(r.before[k] ?? "—")}
                      </span>{" "}
                      <span className="font-semibold text-foreground">
                        → {String(r.changes[k] ?? "—")}
                      </span>
                    </div>
                  ))}
                </div>

                {r.notes && <p className="text-muted-foreground">Note: {r.notes}</p>}

                {canDecide && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Input
                      placeholder="Reviewer note (required if declining)"
                      value={notes[r.id] ?? ""}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                      className="h-8 flex-1 text-xs"
                    />
                    <Button size="sm" onClick={() => decide(r.id, "approved")}>
                      <Check className="mr-1 h-3.5 w-3.5" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => decide(r.id, "declined")}>
                      <X className="mr-1 h-3.5 w-3.5" /> Decline
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
