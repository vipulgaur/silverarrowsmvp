import { useState } from "react";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Chip, Section } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bookingPending, reviewBooking } from "@/lib/logic";
import { useLookup, useStore } from "@/lib/store";
import { reasonLabel } from "@/lib/types";

export function BookingApprovals() {
  const { data, me, saveBooking, log } = useStore();
  const lk = useLookup();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  if (!me || me.role !== "admin") return null;

  const pending = data.bookings.filter(bookingPending);
  if (pending.length === 0) return null;

  async function decide(id: string, decision: "approved" | "declined") {
    if (!me) return;
    const res = reviewBooking(data, id, me, decision, notes[id] ?? "");
    if (typeof res === "string") {
      toast.error(res);
      return;
    }
    setBusyId(id);
    try {
      await saveBooking(res);
      log(
        `booking_${decision}`,
        "booking",
        `${decision === "approved" ? "Approved" : "Declined"} booking ${res.id} for ${lk.user(res.studentId)?.name ?? "Student"}`,
        res.id,
      );
      toast.success(decision === "approved" ? "Booking approved" : "Booking declined");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Section
      title={`Student booking approvals (${pending.length})`}
      description="Pending student slot requests awaiting administrator sign-off"
      className="mb-6"
    >
      <div className="divide-y rounded-xl border border-border">
        {pending.map((b) => (
          <div key={b.id} className="space-y-2 p-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="num font-semibold">
                  {format(new Date(b.start), "EEE d MMM · HH:mm")}–
                  {format(new Date(b.end), "HH:mm")}
                </span>
                <span className="ml-2 text-muted-foreground">
                  {lk.user(b.studentId)?.name ?? "Student"} ·{" "}
                  {lk.aircraft(b.aircraftId)?.reg ?? "Aircraft"} ·{" "}
                  {b.reason ? reasonLabel[b.reason] : b.type}
                </span>
              </div>
              <Chip tone="soon">pending approval</Chip>
            </div>
            {b.notes && <p className="text-muted-foreground">“{b.notes}”</p>}
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Approval / decline note (optional)"
                value={notes[b.id] ?? ""}
                onChange={(e) => setNotes((prev) => ({ ...prev, [b.id]: e.target.value }))}
                className="h-8 flex-1 text-xs"
              />
              <Button
                size="sm"
                disabled={busyId === b.id}
                onClick={() => void decide(b.id, "approved")}
              >
                <Check className="mr-1 h-3.5 w-3.5" /> Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={busyId === b.id}
                onClick={() => void decide(b.id, "declined")}
              >
                <X className="mr-1 h-3.5 w-3.5" /> Decline
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
