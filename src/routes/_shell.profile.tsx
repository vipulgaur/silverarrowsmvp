import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, KV } from "@/components/app-ui";
import { ProfileEditor } from "@/components/profile-editor";
import { ProfileRequests } from "@/components/profile-requests";
import { ProfileSetup } from "@/components/profile-setup";
import { ProficiencyBadges } from "@/components/proficiency-badges";
import { LoginPrivacyPanel } from "@/components/login-privacy-panel";
import { StudentAviationRecords } from "@/components/student-aviation-records";
import { PROFILE_FIELDS, STAFF_ONLY_FIELDS } from "@/lib/logic";
import { useMe } from "@/lib/store";
import { roleLabel, type ProfileChanges } from "@/lib/types";

export const Route = createFileRoute("/_shell/profile")({
  head: () => ({
    meta: [
      { title: "My profile — SilverArrows" },
      {
        name: "description",
        content:
          "Your approved member profile, aviation identification, licences & documents, examinations, flying experience, and profile change request history.",
      },
      { property: "og:title", content: "My profile — SilverArrows" },
      {
        property: "og:description",
        content:
          "Member profile, aviation records, licences & documents, administrator approvals and change request history.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

const STUDENT_AVIATION_CARD_KEYS = new Set<keyof ProfileChanges>([
  "computerNumber",
  "egcaId",
  "fileNumber",
  "splNumber",
  "splExpiry",
  "frtolNumber",
  "frtolExpiry",
  "rtrNumber",
  "rtrExpiry",
  "medicalExpiry",
  "examAirRegulation",
  "examMeteorology",
  "examAirNavigation",
  "examTechnicalGeneral",
  "examTechnicalSpecific",
]);

function ProfilePage() {
  const { me } = useMe();
  return (
    <div className="space-y-6">
      <PageHeader
        title="My profile & aviation records"
        subtitle={`${me.name} · ${roleLabel[me.role]}`}
      >
        <ProfileEditor person={me} />
      </PageHeader>
      <ProfileSetup />
      <LoginPrivacyPanel person={me} />
      <ProficiencyBadges person={me} />
      {me.role === "student" && <StudentAviationRecords student={me} />}
      <section
        aria-label="Approved profile"
        className="mt-6 w-full rounded-2xl border border-border bg-card p-5"
      >
        <h2 className="mb-3 text-lg font-semibold">Personal &amp; contact details</h2>
        <div className="grid gap-x-8 md:grid-cols-2">
          {(Object.keys(PROFILE_FIELDS) as (keyof ProfileChanges)[])
            .filter(
              (key) =>
                !(me.role === "student" && (STAFF_ONLY_FIELDS as readonly string[]).includes(key)),
            )
            .filter((key) => !(me.role === "student" && STUDENT_AVIATION_CARD_KEYS.has(key)))
            .filter(
              (key) =>
                me[key] !== undefined || ["name", "email", "phone", "callsign"].includes(key),
            )
            .map((key) => (
              <KV
                key={key}
                k={PROFILE_FIELDS[key]}
                v={
                  <span className="break-all">
                    {typeof me[key] === "boolean"
                      ? me[key]
                        ? "Passed"
                        : "Pending"
                      : String(me[key] ?? "—")}
                  </span>
                }
              />
            ))}
        </div>
      </section>
      <ProfileRequests />
    </div>
  );
}
