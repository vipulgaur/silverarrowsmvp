import { useState } from "react";
import { Clock } from "lucide-react";
import { Section } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cumulativeHours, demoHourEntries, fmtDec, fmtHours } from "@/lib/logic";
import { useStore } from "@/lib/store";
import type { User } from "@/lib/types";

export function CumulativeHours({ person }: { person: User }) {
  const { data, log } = useStore();
  const [includeDemo, setIncludeDemo] = useState(true);

  const entries = includeDemo ? [...data.flights, ...demoHourEntries(person)] : data.flights;
  const rows = cumulativeHours(person, entries);

  return (
    <Section
      title={`Cumulative Flight Hours — ${person.name}`}
      description="Regulatory FTL & logbook experience across 9 standard rolling windows"
      className="mt-6"
      action={
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const next = !includeDemo;
            setIncludeDemo(next);
            log(
              "cumulative_hours_mode_toggled",
              "flight",
              `${next ? "Included" : "Excluded"} synthetic historical hours for ${person.name}`,
              person.id,
            );
          }}
        >
          <Clock className="mr-1.5 h-3.5 w-3.5" />
          {includeDemo ? "Logbook + Historical Demo" : "Stored Flights Only"}
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Window</TableHead>
            <TableHead className="text-right">Flights</TableHead>
            <TableHead className="text-right">Dual (h)</TableHead>
            <TableHead className="text-right">Solo (h)</TableHead>
            <TableHead className="text-right">PIC (h)</TableHead>
            <TableHead className="text-right">Instructed (h)</TableHead>
            <TableHead className="text-right">SIM (h)</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.label}>
              <TableCell className="font-medium text-xs">{r.label}</TableCell>
              <TableCell className="num text-xs text-muted-foreground">
                {r.start === r.end ? r.start : `${r.start} → ${r.end}`}
              </TableCell>
              <TableCell className="num text-right text-xs">{r.flights}</TableCell>
              <TableCell className="num text-right text-xs">{fmtDec(r.dual)}</TableCell>
              <TableCell className="num text-right text-xs">{fmtDec(r.solo)}</TableCell>
              <TableCell className="num text-right text-xs">{fmtDec(r.pic)}</TableCell>
              <TableCell className="num text-right text-xs">{fmtDec(r.instructed)}</TableCell>
              <TableCell className="num text-right text-xs">{fmtDec(r.sim)}</TableCell>
              <TableCell className="num text-right text-xs font-semibold">
                {fmtHours(r.total)} ({fmtDec(r.total)} h)
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}
