import { ShieldCheck } from "lucide-react";
import { ProfileEditor } from "@/components/profile-editor";
import { useStore } from "@/lib/store";
import type { User } from "@/lib/types";

export function ProfileSetup({ user }: { user?: User }) {
  const { me } = useStore();
  const target = user ?? me;
  if (!target) return null;

  const incomplete = !target.phone || !target.medicalExpiry || !target.callsign;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 text-xs shadow-xs">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {incomplete
              ? "Complete Your Pilot & Regulatory Profile"
              : "Pilot Credentials & Medical Setup Verified"}
          </h3>
          <p className="mt-0.5 text-muted-foreground">
            {incomplete
              ? "Add your phone number, callsign, licence number, and medical expiry dates so flight operations can verify your currency."
              : "Official regulatory certificates, callsign, and licence revalidation dates registered with flight operations."}
          </p>
        </div>
      </div>
      {incomplete && <ProfileEditor person={target} />}
    </div>
  );
}
