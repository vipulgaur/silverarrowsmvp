import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CheckCircle2, Plane, Plus, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chip, Field, NativeSelect, PageHeader, Section, Stat } from "@/components/app-ui";
import { useLookup, useMe } from "@/lib/store";
import {
  aircraftUnavailable,
  can,
  hoursToService,
  maintenanceState,
  reportAircraftRemark,
  resolveAircraftRemark,
  uid,
} from "@/lib/logic";
import type { Aircraft, AircraftRemark } from "@/lib/types";

export const Route = createFileRoute("/_shell/fleet")({
  head: () => ({
    meta: [
      { title: "Fleet & airworthiness — SilverArrows" },
      {
        name: "description",
        content:
          "Aircraft airframe hours, 50h/100h/ARC maintenance tracking, pilot squawk sheet, CAMO CRS release, and grounding controls.",
      },
    ],
  }),
  component: FleetPage,
});

function FleetPage() {
  const { data, me, update, log } = useMe();
  const lk = useLookup();

  const [aircraftId, setAircraftId] = useState(data.aircraft[0]?.id ?? "ac-1");
  const [title, setTitle] = useState("");
  const [dueHours, setDueHours] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Squawk & CAMO CRS state
  const [squawkAcId, setSquawkAcId] = useState(data.aircraft[0]?.id ?? "ac-1");
  const [squawkSeverity, setSquawkSeverity] = useState<AircraftRemark["severity"]>("warning");
  const [squawkDesc, setSquawkDesc] = useState("");
  const [crsLicense, setCrsLicense] = useState("DGCA-AME-B1.2-08419");
  const [crsNotes, setCrsNotes] = useState(
    "Inspected and rectified IAW Cessna 172S AMM Chapter 32; released to service.",
  );

  function handleReportSquawk(e: FormEvent) {
    e.preventDefault();
    const res = reportAircraftRemark(data, me, {
      aircraftId: squawkAcId,
      severity: squawkSeverity,
      description: squawkDesc,
    });
    if (typeof res === "string") {
      toast.error(res);
      return;
    }
    update(() => res);
    log(
      "aircraft_squawk_reported",
      "aircraft",
      `Reported ${squawkSeverity} squawk on ${lk.aircraft(squawkAcId)?.reg ?? squawkAcId}: ${squawkDesc}`,
      squawkAcId,
    );
    setSquawkDesc("");
    toast.success(
      squawkSeverity === "grounding_defect"
        ? "Grounding defect logged — aircraft automatically grounded (AOG)"
        : "Aircraft squawk logged in technical log",
    );
  }

  function handleResolveSquawk(remarkId: string) {
    const res = resolveAircraftRemark(data, remarkId, me, {
      rectifiedByLicense: crsLicense,
      rectificationNotes: crsNotes,
    });
    if (typeof res === "string") {
      toast.error(res);
      return;
    }
    update(() => res);
    log(
      "camo_crs_issued",
      "maintenance",
      `Issued CAMO Certificate of Release to Service (CRS) for squawk ${remarkId} (${crsLicense})`,
      remarkId,
    );
    toast.success("CAMO Certificate of Release to Service (CRS) signed off");
  }

  function toggleGround(ac: Aircraft) {
    const isCurrentlyGrounded = Boolean(ac.grounded || ac.status === "grounded");
    const nextStatus = isCurrentlyGrounded ? "available" : "grounded";
    update((d) => ({
      ...d,
      aircraft: d.aircraft.map((a) =>
        a.id === ac.id ? { ...a, grounded: !isCurrentlyGrounded, status: nextStatus } : a,
      ),
    }));
    log(
      nextStatus === "grounded" ? "aircraft_grounded" : "aircraft_released",
      "aircraft",
      `${nextStatus === "grounded" ? "Grounded" : "Released to service"} ${ac.reg} (${ac.type})`,
      ac.id,
    );
    toast.success(
      nextStatus === "grounded"
        ? `${ac.reg} grounded — new flight bookings blocked`
        : `${ac.reg} returned to service`,
    );
  }

  function completeMaint(id: string) {
    const m = data.maintenance.find((x) => x.id === id);
    if (!m) return;
    const ac = lk.aircraft(m.aircraftId);
    update((d) => ({
      ...d,
      maintenance: d.maintenance.map((x) =>
        x.id === id
          ? {
              ...x,
              dueHours: x.dueHours && ac ? Math.round(ac.totalHours + 100) : x.dueHours,
              dueDate: x.dueDate
                ? format(
                    new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    "yyyy-MM-dd",
                  )
                : x.dueDate,
              completedAt: format(new Date(), "yyyy-MM-dd"),
              notes: `Signed off by ${me.name} on ${format(new Date(), "dd.MM.yyyy")}`,
            }
          : x,
      ),
    }));
    log(
      "maintenance_completed",
      "maintenance",
      `Signed off "${m.title}" on ${ac?.reg ?? m.aircraftId}`,
      m.id,
    );
    toast.success(`Signed off ${m.title}`);
  }

  function addMaintItem(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const id = `m-${uid().slice(0, 5)}`;
    const ac = lk.aircraft(aircraftId);
    update((d) => ({
      ...d,
      maintenance: [
        ...d.maintenance,
        {
          id,
          aircraftId,
          title: title.trim(),
          dueHours: dueHours ? Number(dueHours) : undefined,
          dueDate: dueDate || undefined,
        },
      ],
    }));
    log(
      "maintenance_scheduled",
      "maintenance",
      `Added maintenance item "${title.trim()}" for ${ac?.reg ?? aircraftId}`,
      id,
    );
    setTitle("");
    setDueHours("");
    setDueDate("");
    toast.success("Maintenance inspection scheduled");
  }

  const readyCount = data.aircraft.filter((a) => !aircraftUnavailable(a, data.maintenance)).length;

  return (
    <div>
      <PageHeader
        title="Fleet & Part-CAMO maintenance"
        subtitle="Real-time airframe hours, scheduled inspections, ARC validity, pilot squawk sheet, and CAMO CRS release."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Airworthy aircraft"
          value={`${readyCount}/${data.aircraft.length}`}
          hint="Available for dispatch"
        />
        <Stat
          label="Total fleet hours"
          value={`${data.aircraft.reduce((s, a) => s + a.totalHours, 0).toFixed(1)} h`}
          hint="Cumulative airframe time"
        />
        <Stat
          label="Tracked inspections"
          value={data.maintenance.length}
          hint="50h, 100h, annual & ARC checks"
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {data.aircraft.map((a) => {
          const unavail = aircraftUnavailable(a, data.maintenance);
          const hrsLeft = hoursToService(a, data.maintenance);
          const isGrounded = Boolean(a.grounded || a.status === "grounded");
          return (
            <div
              key={a.id}
              className="flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">{a.reg}</h3>
                  </div>
                  <Chip
                    tone={unavail ? "expired" : hrsLeft !== null && hrsLeft <= 10 ? "soon" : "ok"}
                  >
                    {unavail
                      ? "Grounded / Overdue"
                      : hrsLeft !== null && hrsLeft <= 10
                        ? "Service due soon"
                        : "Airworthy"}
                  </Chip>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.type}</p>
                <div className="num mt-4 space-y-1.5 border-t pt-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total airframe hours:</span>
                    <span className="font-semibold">{a.totalHours.toFixed(1)} h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tachometer hours:</span>
                    <span className="font-semibold">{a.tachHours.toFixed(1)} h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hours to next check:</span>
                    <span className="font-semibold">
                      {hrsLeft !== null ? `${hrsLeft.toFixed(1)} h` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last service:</span>
                    <span className="font-semibold">{a.lastService ?? "—"}</span>
                  </div>
                </div>
              </div>

              {can.manageFleet(me.role) && (
                <div className="mt-4 pt-2">
                  <Button
                    size="sm"
                    variant={isGrounded ? "default" : "outline"}
                    className="w-full"
                    onClick={() => toggleGround(a)}
                  >
                    <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
                    {isGrounded ? "Release to service" : "Ground aircraft"}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Section title="Scheduled maintenance & airworthiness directives" className="mt-6">
        {can.manageFleet(me.role) && (
          <form
            onSubmit={addMaintItem}
            className="mb-5 grid gap-3 rounded-xl border bg-muted/30 p-4 sm:grid-cols-5"
          >
            <Field label="Aircraft">
              <NativeSelect value={aircraftId} onChange={(e) => setAircraftId(e.target.value)}>
                {data.aircraft.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.reg}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Inspection / AD title">
              <Input
                placeholder="e.g. 50-hour oil & filter"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Field>
            <Field label="Due at hours (optional)">
              <Input
                type="number"
                step="0.1"
                placeholder="1450"
                value={dueHours}
                onChange={(e) => setDueHours(e.target.value)}
              />
            </Field>
            <Field label="Due date (optional)">
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </Field>
            <div className="flex items-end">
              <Button type="submit" size="sm" className="w-full">
                <Plus className="mr-1 h-4 w-4" /> Add item
              </Button>
            </div>
          </form>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aircraft</TableHead>
              <TableHead>Inspection / Directive</TableHead>
              <TableHead>Due Hours</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.maintenance.map((m) => {
              const ac = lk.aircraft(m.aircraftId);
              const st = ac ? maintenanceState(m, ac) : "ok";
              return (
                <TableRow key={m.id}>
                  <TableCell className="font-semibold">{ac?.reg ?? m.aircraftId}</TableCell>
                  <TableCell>
                    <div className="font-medium">{m.title}</div>
                    {m.notes && <div className="text-xs text-muted-foreground">{m.notes}</div>}
                  </TableCell>
                  <TableCell className="num text-xs">
                    {m.dueHours ? `${m.dueHours} h (now ${ac?.totalHours.toFixed(1)} h)` : "—"}
                  </TableCell>
                  <TableCell className="num text-xs">{m.dueDate ?? "—"}</TableCell>
                  <TableCell>
                    <Chip tone={st === "overdue" ? "expired" : st === "soon" ? "soon" : "ok"}>
                      {st === "overdue" ? "Overdue" : st === "soon" ? "Due soon" : "OK"}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-right">
                    {can.manageFleet(me.role) && (
                      <Button size="sm" variant="outline" onClick={() => completeMaint(m.id)}>
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Sign off
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Section>

      {/* Pilot Squawk Sheet & Part-CAMO Certificate of Release to Service (CRS) */}
      <Section
        title="Technical Log — Pilot Squawk Sheet & CAMO CRS Release"
        description="Report post-flight defects or sign off a Certificate of Release to Service (CRS) with AME license authentication."
        className="mt-6"
      >
        <form
          onSubmit={handleReportSquawk}
          className="mb-5 grid gap-3 rounded-xl border bg-muted/30 p-4 sm:grid-cols-4"
        >
          <Field label="Aircraft">
            <NativeSelect value={squawkAcId} onChange={(e) => setSquawkAcId(e.target.value)}>
              {data.aircraft.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.reg} ({a.type})
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Defect Severity">
            <NativeSelect
              value={squawkSeverity}
              onChange={(e) => setSquawkSeverity(e.target.value as AircraftRemark["severity"])}
            >
              <option value="info">Info / Cabin Observation</option>
              <option value="warning">Warning / Deferred MEL</option>
              <option value="grounding_defect">Grounding Defect (Auto-AOG)</option>
            </NativeSelect>
          </Field>
          <Field label="Squawk / Defect Description">
            <Input
              placeholder="e.g. LH magneto drop 175 RPM during run-up"
              value={squawkDesc}
              onChange={(e) => setSquawkDesc(e.target.value)}
              required
            />
          </Field>
          <div className="flex items-end">
            <Button type="submit" size="sm" className="w-full">
              <Plus className="mr-1 h-4 w-4" /> Log Squawk
            </Button>
          </div>
        </form>

        {can.manageFleet(me.role) && (
          <div className="mb-4 grid gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 sm:grid-cols-2">
            <Field label="CAMO / AME Certifying License # (for CRS Sign-Off)">
              <Input value={crsLicense} onChange={(e) => setCrsLicense(e.target.value)} />
            </Field>
            <Field label="Rectification & Work Order Statement">
              <Input value={crsNotes} onChange={(e) => setCrsNotes(e.target.value)} />
            </Field>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aircraft</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Defect & CRS Rectification</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data.aircraftRemarks ?? []).map((rem) => {
              const ac = lk.aircraft(rem.aircraftId);
              return (
                <TableRow key={rem.id}>
                  <TableCell className="font-semibold">{ac?.reg ?? rem.aircraftId}</TableCell>
                  <TableCell>
                    <Chip
                      tone={
                        rem.severity === "grounding_defect"
                          ? "expired"
                          : rem.severity === "warning"
                            ? "soon"
                            : "ok"
                      }
                    >
                      {rem.severity.replace("_", " ").toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-xs">{rem.description}</div>
                    {rem.rectifiedByLicense && (
                      <div className="mt-1 text-[11px] text-emerald-500">
                        CRS Signed ({rem.rectifiedByLicense} · {rem.workOrderRef}):{" "}
                        {rem.rectificationNotes}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip tone={rem.status === "rectified" ? "ok" : "soon"}>
                      {rem.status.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-right">
                    {rem.status !== "rectified" && can.manageFleet(me.role) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveSquawk(rem.id)}
                      >
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Issue CRS
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Section>
    </div>
  );
}
