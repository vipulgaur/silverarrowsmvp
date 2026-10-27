import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningReader } from "@/components/learning-reader";
import { isCourseAssignedToUser } from "@/lib/elearning-courses";
import { chapterById, learningMeta } from "@/lib/learning-content";
import { useMe } from "@/lib/store";

export const Route = createFileRoute("/_shell/learning/$chapterId")({
  head: ({ params }) =>
    learningMeta(
      chapterById(params.chapterId)?.title ?? "Chapter unavailable",
      `Flying training lesson: ${chapterById(params.chapterId)?.title ?? "chapter unavailable"}. Flying Training chapter, personal notes and learning progress.`,
    ),
  component: ChapterPage,
});

function ChapterPage() {
  const { chapterId } = Route.useParams();
  const { me, data } = useMe();
  const hasPooleyAccess = me.role === "admin" || isCourseAssignedToUser(me.id, "pooley", data);

  if (!hasPooleyAccess) {
    return (
      <div className="mx-auto mt-16 max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
        <Lock className="mx-auto h-10 w-10 text-destructive" />
        <p className="num mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Course Access Restricted
        </p>
        <h1 className="mt-2 text-xl font-bold">Course Not Assigned to Your Profile</h1>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          You only have access to E-Learning courses explicitly assigned to your profile by an
          administrator. <strong>Air Manual — Pooley</strong> is not currently assigned to you.
        </p>
        <Button asChild className="mt-6">
          <Link to="/learning">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to My Assigned Courses
          </Link>
        </Button>
      </div>
    );
  }

  return <LearningReader key={chapterId} chapterId={chapterId} />;
}
