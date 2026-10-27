import { createFileRoute } from "@tanstack/react-router";
import { AircraftAtlasApp } from "@/components/atlas/aircraft-atlas-app";
import { useMe } from "@/lib/store";

export const Route = createFileRoute("/_shell/atlas")({
  head: () => ({
    meta: [
      { title: "Aircraft Atlas · Cessna 172S Skyhawk SP — SilverArrows" },
      {
        name: "description",
        content:
          "Interactive 3D WebGL engineering telemetry console for Cessna 172S Skyhawk SP (OY-AAA · serial 172S-10542): 71 clickable assemblies across 6 systems, full Garmin G1000 cockpit interior, Lycoming IO-360-L2A engine, explode/isolate/X-ray inspection, guided camera tours and checkride.",
      },
    ],
  }),
  component: AtlasRoutePage,
});

function AtlasRoutePage() {
  const { log } = useMe();

  return (
    <AircraftAtlasApp
      onAuditLog={(action, details) => {
        log(action, "aircraft", details);
      }}
    />
  );
}
