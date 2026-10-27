import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-ui";
import { AssignedCoursesPanel } from "@/components/assigned-courses-panel";
import { learningMeta } from "@/lib/learning-content";
import { useMe } from "@/lib/store";
import { roleLabel } from "@/lib/types";

export const Route = createFileRoute("/_shell/learning/")({
  head: () =>
    learningMeta(
      "My Assigned E-Learning Courses",
      "Access your individual assigned aviation E-Learning courses.",
    ),
  component: LearningIndexPage,
});

function LearningIndexPage() {
  const { me } = useMe();

  return (
    <div>
      <PageHeader
        title={me.role === "admin" ? "All E-Learning Modules" : "My Assigned E-Learning Courses"}
        subtitle={`${me.name} · ${roleLabel[me.role]} · ${
          me.role === "admin"
            ? "Administrator full course access"
            : "Only courses assigned to your profile by an administrator are visible here"
        }`}
      />

      <AssignedCoursesPanel person={me} />
    </div>
  );
}
