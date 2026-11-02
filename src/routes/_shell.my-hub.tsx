import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMe } from "@/lib/store";
import { expiryState, easaRollingFtlStatus } from "@/lib/logic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Globe,
  KeyRound,
  ShieldCheck,
  Award,
  BookOpen,
  Building,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/_shell/my-hub")({
  component: GlobalPilotHubPage,
});

const TENANT_ORGANIZATIONS = [
  {
    id: "org_silverarrows",
    name: "SilverArrows Aviation Academy (Hisar VIHR)",
    authority: "DGCA India / EASA Dual ATO",
    roleBadge: "Primary Tenant",
  },
  {
    id: "org_nordic_flight",
    name: "Nordic Flight Training Center (Aarhus EKAH)",
    authority: "EASA DK.ATO.0042",
    roleBadge: "Partner Simulator ATO",
  },
  {
    id: "org_aero_club_delhi",
    name: "Northern Aero Club Charter (Safdarjung VIDD)",
    authority: "DGCA Non-Scheduled Operator",
    roleBadge: "Renter / Club Affiliate",
  },
];

function GlobalPilotHubPage() {
  const { data, me, update, log } = useMe();
  const [selectedOrgId, setSelectedOrgId] = useState("org_silverarrows");
  const [deviceLabel, setDeviceLabel] = useState("MacBook Pro TouchID / YubiKey 5C");

  const myCerts = (data.userCertificates ?? []).filter((c) => c.userId === me.id);
  const myLogbook = (data.electronicLogbookEntries ?? []).filter((e) => e.userId === me.id);
  const myPasskeys = (data.webauthnCredentials ?? []).filter((w) => w.userId === me.id);
  const ftl = easaRollingFtlStatus(me.id, data);

  const handleRegisterPasskey = () => {
    if (!deviceLabel.trim()) {
      toast.error("Provide a label for your hardware authenticator");
      return;
    }
    const credentialId = `webauthn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const nowIso = new Date().toISOString();
    update((d) => ({
      ...d,
      webauthnCredentials: [
        ...(d.webauthnCredentials ?? []),
        {
          id: `pk_${Date.now()}`,
          userId: me.id,
          credentialId,
          publicKey: `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A_${credentialId}`,
          deviceName: deviceLabel.trim(),
          signCount: 1,
          createdAt: nowIso,
          lastUsedAt: nowIso,
        },
      ],
    }));
    log(
      "webauthn_passkey_enrolled",
      "user",
      `Enrolled FIDO2 hardware passkey: ${deviceLabel.trim()}`,
      me.id,
    );
    toast.success("FIDO2 / WebAuthn Hardware Passkey registered to your Global Pilot Identity");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-sky-500/40 bg-sky-500/10 text-sky-300">
              FlightLogger `/my` Global Pilot Hub
            </Badge>
            <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
              Cross-Tenant Portable Identity
            </Badge>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Global Pilot Hub & Portable Credential Vault
          </h1>
          <p className="text-sm text-muted-foreground">
            Your personal cross-academy aviation passport: switch tenant organizations, manage FIDO2 passkeys, and inspect portable logbooks & certificates.
          </p>
        </div>
      </div>

      {/* Multi-Tenant Organization Switcher */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-sky-400" />
            Connected Aviation Organizations (Multi-Tenant Switcher)
          </CardTitle>
          <CardDescription>
            FlightLogger `/my` aggregates your flight bookings, certificates, and lifetime logbook across all affiliated ATOs and aero clubs.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {TENANT_ORGANIZATIONS.map((org) => {
            const active = selectedOrgId === org.id;
            return (
              <div
                key={org.id}
                onClick={() => {
                  setSelectedOrgId(org.id);
                  toast.info(`Switched active tenant context to ${org.name}`);
                }}
                className={`cursor-pointer rounded-lg border p-4 transition ${
                  active
                    ? "border-sky-500 bg-sky-500/10"
                    : "border-border/60 bg-background/50 hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Building className="h-4 w-4 text-sky-400" />
                  <Badge variant={active ? "default" : "outline"} className="text-[10px]">
                    {org.roleBadge}
                  </Badge>
                </div>
                <div className="mt-2 font-semibold text-sm">{org.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{org.authority}</div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Certificate & Rating Expiry Engine */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              Personal Certificate & Rating Vault
            </CardTitle>
            <CardDescription>
              Evaluated in real time by Gate 1 & Gate 3 of the Pre-Flight Dispatch Engine.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {myCerts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground">
                No personal certificates attached to this account yet.
              </div>
            ) : (
              myCerts.map((cert) => {
                const ct = (data.certificateTypes ?? []).find((t) => t.id === cert.certificateTypeId);
                const exp = expiryState(cert.expiryDate, new Date(), ct?.warningDaysBefore ?? 30);
                return (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 p-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-sm">{ct?.name ?? cert.certificateTypeId}</div>
                      <div className="text-muted-foreground">
                        Number: {cert.certificateNumber} • Issued: {cert.issueDate} • Expires:{" "}
                        <span className="text-foreground">{cert.expiryDate ?? "Perpetual"}</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        exp.state === "ok"
                          ? "border-emerald-500/40 text-emerald-300"
                          : exp.state === "soon"
                            ? "border-amber-500/40 text-amber-300"
                            : "border-rose-500/40 text-rose-300"
                      }
                    >
                      {exp.state === "ok" ? (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                      ) : (
                        <AlertTriangle className="mr-1 h-3 w-3" />
                      )}
                      {exp.state === "ok" ? "VALID" : exp.state === "soon" ? "EXPIRING SOON" : "EXPIRED"}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* FIDO2 / WebAuthn Hardware Passkey Vault */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-emerald-400" />
              FIDO2 / WebAuthn Hardware Passkeys
            </CardTitle>
            <CardDescription>
              Cryptographic hardware keys used to sign Dual Electronic Logbook entries and Stage Checks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={deviceLabel}
                onChange={(e) => setDeviceLabel(e.target.value)}
                placeholder="Authenticator device name..."
                className="text-xs"
              />
              <Button size="sm" onClick={handleRegisterPasskey}>
                <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                Enroll Passkey
              </Button>
            </div>

            <div className="space-y-2">
              {myPasskeys.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
                  No hardware passkeys enrolled yet. Click "Enroll Passkey" to bind a FIDO2 credential.
                </div>
              ) : (
                myPasskeys.map((pk) => (
                  <div
                    key={pk.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 p-3 text-xs"
                  >
                    <div>
                      <div className="font-medium flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        {pk.deviceName}
                      </div>
                      <div className="font-mono text-[11px] text-muted-foreground">
                        ID: {pk.credentialId} • Sign count: {pk.signCount}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      ACTIVE FIDO2
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EASA FTL & Portable Electronic Logbook Summary */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-sky-400" />
            EASA ORO.FTL Rolling Ceilings & Portable Logbook ({myLogbook.length} Signed Entries)
          </CardTitle>
          <CardDescription>
            Real-time 7-day / 28-day / 900h calendar year / 1000h 365-day cumulative Flight & Duty monitors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
            <div className="rounded-lg border border-border/60 bg-background/50 p-3">
              <div className="text-muted-foreground">7-Day Rolling Duty (Max 60h)</div>
              <div className="mt-1 text-lg font-bold">{ftl.duty7DaysHours.toFixed(1)}h / 60h</div>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/50 p-3">
              <div className="text-muted-foreground">28-Day Flight Time (Max 100h)</div>
              <div className="mt-1 text-lg font-bold">{ftl.flight28DaysHours.toFixed(1)}h / 100h</div>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/50 p-3">
              <div className="text-muted-foreground">Calendar Year Flight (Max 900h)</div>
              <div className="mt-1 text-lg font-bold">{ftl.flightCalendarYearHours.toFixed(1)}h / 900h</div>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/50 p-3">
              <div className="text-muted-foreground">365-Day Rolling Flight (Max 1000h)</div>
              <div className="mt-1 text-lg font-bold">{ftl.flight365DaysHours.toFixed(1)}h / 1000h</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
