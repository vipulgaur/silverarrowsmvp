import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  CalendarPlus,
  ClipboardCheck,
  GraduationCap,
  Plane,
  School,
  ShieldAlert,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Chip, Field, NativeSelect, PageHeader, Section } from "@/components/app-ui";
import { useMe } from "@/lib/store";
import { provisionAuthUserWithoutSessionSwitch } from "@/integrations/supabase/client";
import { activeUsers, GENDERS, SOLE_ADMIN_EMAIL, uid, validateAccountCreation } from "@/lib/logic";
import { roleLabel, type Lesson, type Role, type User } from "@/lib/types";

export const Route = createFileRoute("/_shell/admin/create")({
  head: () => ({
    meta: [
      { title: "Create entities — SilverArrows" },
      {
        name: "description",
        content:
          "Administrator master creation console: register new students/members (full registration form), aircraft, training programs, lessons, classrooms, lectures, and exam subjects.",
      },
    ],
  }),
  component: AdminCreatePage,
});

function AdminCreatePage() {
  const { data, update, log } = useMe();
  const instructors = activeUsers(data, "instructor");
  const groundInstructors = [...activeUsers(data, "ground"), ...activeUsers(data, "instructor")];
  const activeStudents = activeUsers(data, "student");

  // 1. Member registration form state (full registration form)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [callsign, setCallsign] = useState("");
  const [phone, setPhone] = useState("");
  const [programId, setProgramId] = useState(data.programs[0]?.id ?? "p-ppl");
  const [instructorId, setInstructorId] = useState(instructors[0]?.id ?? "");
  const [stage, setStage] = useState("Phase 1 — Circuit Consolidation");
  const [licence, setLicence] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [medicalClass, setMedicalClass] = useState<1 | 2>(2);
  const [medicalExpiry, setMedicalExpiry] = useState("2027-06-30");
  const [ratingExpiry, setRatingExpiry] = useState("2027-08-15");
  const [icaoLevel, setIcaoLevel] = useState("5");
  const [priorHours, setPriorHours] = useState("0");
  const [dateOfBirth, setDateOfBirth] = useState("1999-05-14");
  const [gender, setGender] = useState<string>("Male");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [caaRef, setCaaRef] = useState("");
  const [userReference, setUserReference] = useState("");
  const [address, setAddress] = useState("");
  const [postCode, setPostCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Denmark");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [publicNote, setPublicNote] = useState("");
  const [instructorNote, setInstructorNote] = useState("");
  const [adminNote, setAdminNote] = useState("");

  // 2. Aircraft form state
  const [reg, setReg] = useState("");
  const [type, setType] = useState("Cessna 172S Skyhawk SP");
  const [hourlyRate, setHourlyRate] = useState("220");
  const [totalHours, setTotalHours] = useState("1000");
  const [tachHours, setTachHours] = useState("1000");
  const [lastService, setLastService] = useState(format(new Date(), "yyyy-MM-dd"));

  // 3. Program form state
  const [progName, setProgName] = useState("");
  const [progCode, setProgCode] = useState("");

  // 4. Lesson form state
  const [lessonProgramId, setLessonProgramId] = useState(data.programs[0]?.id ?? "p-ppl");
  const [lessonCode, setLessonCode] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [lessonKind, setLessonKind] = useState<Lesson["kind"]>("dual");
  const [lessonMinutes, setLessonMinutes] = useState("60");
  const [lessonDesc, setLessonDesc] = useState("");

  // 5. Classroom form state
  const [roomName, setRoomName] = useState("");
  const [roomCapacity, setRoomCapacity] = useState("16");

  // 6. Lecture form state
  const [lectureSubjectId, setLectureSubjectId] = useState(data.subjects[0]?.id ?? "s-air");
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDate, setLectureDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [lectureStart, setLectureStart] = useState("09:00");
  const [lectureEnd, setLectureEnd] = useState("11:00");
  const [lectureRoomId, setLectureRoomId] = useState(data.classrooms[0]?.id ?? "c-a");
  const [lectureInstructorId, setLectureInstructorId] = useState(
    groundInstructors[0]?.id ?? "u-anj",
  );
  const [enrolAllStudents, setEnrolAllStudents] = useState(true);

  // 7. Exam Subject form state
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const liveMemberValidationError = useMemo(() => {
    const n = name.trim();
    const e = email.trim().toLowerCase();
    const p = phone.trim();
    if (!n && !e && !p) return null;

    const activeMembers = data.users.filter((u) => u.status !== "deleted");
    const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

    if (n) {
      const nNorm = norm(n);
      const firstToken = nNorm.split(" ")[0] ?? "";
      if (firstToken === "sakshi" || nNorm === "system administrator" || firstToken === "admin") {
        return `Name "${n}" is reserved by system administration and cannot be registered.`;
      }
      const nameMatch = activeMembers.find((u) => {
        const uNorm = norm(u.name);
        const uFirst = uNorm.split(" ")[0] ?? "";
        return (
          uNorm === nNorm ||
          (!nNorm.includes(" ") && uFirst === nNorm && nNorm.length >= 3)
        );
      });
      if (nameMatch) {
        return `An account for "${nameMatch.name}" (${nameMatch.email}) already exists. Anyone with the same name cannot register a duplicate account or share an email ID.`;
      }
    }

    if (e) {
      if (e === SOLE_ADMIN_EMAIL || e === "sakshi@flysilverarrows.com") {
        return `The email ID "${e}" is reserved for the sole System Administrator.`;
      }
      const emailMatch = activeMembers.find((u) => u.email.trim().toLowerCase() === e);
      if (emailMatch) {
        return `A member with email ID "${e}" already exists (${emailMatch.name}). Anyone with the same name cannot have the same email ID.`;
      }
    }

    if (p) {
      const normPhone = p.replace(/[\s\-().]/g, "");
      if (normPhone.length >= 7) {
        const phoneMatch = activeMembers.find(
          (u) => u.phone && u.phone.replace(/[\s\-().]/g, "") === normPhone,
        );
        if (phoneMatch) {
          return `A member with phone number "${p}" already exists (${phoneMatch.name}).`;
        }
      }
    }

    if (n && e && p) {
      return validateAccountCreation({ name: n, email: e, phone: p, role }, data.users);
    }

    return null;
  }, [name, email, phone, role, data.users]);

  function createUser(e: FormEvent) {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const validationErr = validateAccountCreation(
      {
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        role,
      },
      data.users,
    );
    if (validationErr) {
      toast.error(validationErr);
      return;
    }

    const priorMin = Math.max(0, Math.round((Number(priorHours) || 0) * 60));
    const newUser: User = {
      id: `u-${uid().slice(0, 6)}`,
      name: name.trim(),
      email: cleanEmail,
      role,
      status: "active",
      callsign: callsign.trim() || name.trim().slice(0, 3).toUpperCase(),
      ...(phone.trim() ? { phone: phone.trim() } : {}),
      ...(role === "student" && programId ? { programId } : {}),
      ...(role === "student" && instructorId ? { instructorId } : {}),
      ...(stage.trim() ? { stage: stage.trim() } : {}),
      ...(licence.trim() ? { licence: licence.trim() } : {}),
      ...(speciality.trim() ? { speciality: speciality.trim() } : {}),
      ...(role === "student" || role === "instructor"
        ? {
            medicalClass,
            medicalExpiry: medicalExpiry || undefined,
            ratingExpiry: ratingExpiry || undefined,
          }
        : {}),
      ...(Number(icaoLevel) >= 1 && Number(icaoLevel) <= 6 ? { icaoLevel: Number(icaoLevel) } : {}),
      ...(priorMin > 0 ? { priorMinutes: priorMin } : {}),
      ...(dateOfBirth ? { dateOfBirth } : {}),
      ...(gender ? { gender } : {}),
      ...(placeOfBirth.trim() ? { placeOfBirth: placeOfBirth.trim() } : {}),
      ...(caaRef.trim() ? { caaRef: caaRef.trim() } : {}),
      ...(userReference.trim() ? { userReference: userReference.trim() } : {}),
      ...(address.trim() ? { address: address.trim() } : {}),
      ...(postCode.trim() ? { postCode: postCode.trim() } : {}),
      ...(city.trim() ? { city: city.trim() } : {}),
      ...(country.trim() ? { country: country.trim() } : {}),
      ...(emergencyName.trim() ? { emergencyName: emergencyName.trim() } : {}),
      ...(emergencyPhone.trim() ? { emergencyPhone: emergencyPhone.trim() } : {}),
      ...(emergencyRelation.trim() ? { emergencyRelation: emergencyRelation.trim() } : {}),
      ...(publicNote.trim() ? { publicNote: publicNote.trim() } : {}),
      ...(instructorNote.trim() ? { instructorNote: instructorNote.trim() } : {}),
      ...(adminNote.trim() ? { adminNote: adminNote.trim() } : {}),
    };

    update((d) => ({
      ...d,
      users: [...d.users, newUser],
    }));

    // Pre-provision Supabase Auth credentials with testing master password on a stateless client
    // so the currently signed-in Administrator's session is never replaced
    void provisionAuthUserWithoutSessionSwitch(cleanEmail, "Vipul@1011");

    log(
      "user_created",
      "user",
      `Registered new ${roleLabel[role]}: ${newUser.name} (${newUser.email})`,
      newUser.id,
    );
    toast.success(`Registered ${roleLabel[role]} ${newUser.name}`);
    setName("");
    setEmail("");
    setCallsign("");
    setPhone("");
    setLicence("");
    setSpeciality("");
    setPlaceOfBirth("");
    setCaaRef("");
    setUserReference("");
    setAddress("");
    setPostCode("");
    setCity("");
    setEmergencyName("");
    setEmergencyPhone("");
    setEmergencyRelation("");
    setPublicNote("");
    setInstructorNote("");
    setAdminNote("");
  }

  function createAircraft(e: FormEvent) {
    e.preventDefault();
    const cleanReg = reg.trim().toUpperCase();
    if (!cleanReg || !type.trim()) {
      toast.error("Registration and aircraft type are required.");
      return;
    }
    if (data.aircraft.some((a) => a.reg.toUpperCase() === cleanReg)) {
      toast.error("An aircraft with this registration already exists.");
      return;
    }
    const hrs = Math.max(0, Number(totalHours) || 0);
    const tach = Math.max(0, Number(tachHours) || hrs);
    const rate = Math.max(0, Number(hourlyRate) || 220);
    const id = `a-${uid().slice(0, 5)}`;

    update((d) => ({
      ...d,
      aircraft: [
        ...d.aircraft,
        {
          id,
          reg: cleanReg,
          type: type.trim(),
          hourlyRate: rate,
          totalHours: hrs,
          tachHours: tach,
          lastService: lastService || format(new Date(), "yyyy-MM-dd"),
          status: "available",
          grounded: false,
        },
      ],
    }));

    log("aircraft_created", "aircraft", `Added aircraft ${cleanReg} (${type.trim()}) to fleet`, id);
    toast.success(`Added ${cleanReg} to fleet`);
    setReg("");
  }

  function createProgram(e: FormEvent) {
    e.preventDefault();
    if (!progName.trim()) {
      toast.error("Program name is required.");
      return;
    }
    const id = progCode.trim()
      ? `p-${progCode
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`
      : `p-${uid().slice(0, 5)}`;
    if (data.programs.some((p) => p.id === id)) {
      toast.error("A program with this code already exists.");
      return;
    }
    update((d) => ({
      ...d,
      programs: [...d.programs, { id, name: progName.trim(), lessons: [] }],
    }));
    log("program_created", "lesson", `Created training program "${progName.trim()}"`, id);
    toast.success(`Created training program ${progName.trim()}`);
    setProgName("");
    setProgCode("");
  }

  function createLesson(e: FormEvent) {
    e.preventDefault();
    if (!lessonName.trim() || !lessonProgramId) {
      toast.error("Select a program and enter a lesson title.");
      return;
    }
    const id = `l-${uid().slice(0, 5)}`;
    const mins = Math.max(15, Number(lessonMinutes) || 60);
    const newLesson: Lesson = {
      id,
      code: lessonCode.trim() || `EX-${uid().slice(0, 3).toUpperCase()}`,
      name: lessonName.trim(),
      kind: lessonKind,
      minutes: mins,
      ...(lessonDesc.trim() ? { description: lessonDesc.trim() } : {}),
    };
    update((d) => ({
      ...d,
      programs: d.programs.map((p) =>
        p.id === lessonProgramId ? { ...p, lessons: [...p.lessons, newLesson] } : p,
      ),
    }));
    log(
      "lesson_created",
      "lesson",
      `Added lesson ${newLesson.code} (${newLesson.name}) to program ${lessonProgramId}`,
      id,
    );
    toast.success(`Added lesson ${newLesson.name}`);
    setLessonCode("");
    setLessonName("");
    setLessonDesc("");
  }

  function createClassroom(e: FormEvent) {
    e.preventDefault();
    if (!roomName.trim()) {
      toast.error("Classroom name is required.");
      return;
    }
    const id = `c-${uid().slice(0, 5)}`;
    const cap = Math.max(1, Number(roomCapacity) || 12);
    update((d) => ({
      ...d,
      classrooms: [...d.classrooms, { id, name: roomName.trim(), capacity: cap }],
    }));
    log(
      "classroom_created",
      "lecture",
      `Created classroom "${roomName.trim()}" (capacity ${cap})`,
      id,
    );
    toast.success(`Created classroom ${roomName.trim()}`);
    setRoomName("");
  }

  function createLecture(e: FormEvent) {
    e.preventDefault();
    if (!lectureTitle.trim() || !lectureDate) {
      toast.error("Lecture title and date are required.");
      return;
    }
    const id = `lec-${uid().slice(0, 5)}`;
    const startIso = new Date(`${lectureDate}T${lectureStart}:00`).toISOString();
    const endIso = new Date(`${lectureDate}T${lectureEnd}:00`).toISOString();
    const enrolled = enrolAllStudents ? activeStudents.map((s) => s.id) : [];

    update((d) => ({
      ...d,
      lectures: [
        ...d.lectures,
        {
          id,
          subjectId: lectureSubjectId,
          title: lectureTitle.trim(),
          start: startIso,
          end: endIso,
          roomId: lectureRoomId,
          instructorId: lectureInstructorId,
          enrolled,
          attended: [],
          signedOff: false,
        },
      ],
    }));
    log(
      "lecture_scheduled",
      "lecture",
      `Scheduled lecture "${lectureTitle.trim()}" on ${lectureDate} (${lectureStart}–${lectureEnd})`,
      id,
    );
    toast.success(`Scheduled lecture ${lectureTitle.trim()}`);
    setLectureTitle("");
  }

  function createSubject(e: FormEvent) {
    e.preventDefault();
    if (!subjectCode.trim() || !subjectName.trim()) {
      toast.error("Subject code and title are required.");
      return;
    }
    const id = `s-${uid().slice(0, 5)}`;
    update((d) => ({
      ...d,
      subjects: [
        ...d.subjects,
        { id, code: subjectCode.trim().toUpperCase(), name: subjectName.trim() },
      ],
    }));
    log(
      "subject_created",
      "exam",
      `Added EASA theory subject ${subjectCode.trim().toUpperCase()} — ${subjectName.trim()}`,
      id,
    );
    toast.success(`Added subject ${subjectCode.trim().toUpperCase()} — ${subjectName.trim()}`);
    setSubjectCode("");
    setSubjectName("");
  }

  return (
    <div>
      <Link
        to="/portal/admin"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Admin Hub
      </Link>

      <PageHeader
        title="Create entities"
        subtitle="Register new students/members (full registration form), aircraft, programs, lessons, classrooms, lectures, and exam subjects."
      >
        <Chip variant="info">7 Entity Types</Chip>
      </PageHeader>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="members" className="gap-1.5 text-xs">
            <UserPlus className="h-3.5 w-3.5" /> Members ({data.users.length})
          </TabsTrigger>
          <TabsTrigger value="aircraft" className="gap-1.5 text-xs">
            <Plane className="h-3.5 w-3.5" /> Aircraft ({data.aircraft.length})
          </TabsTrigger>
          <TabsTrigger value="programs" className="gap-1.5 text-xs">
            <GraduationCap className="h-3.5 w-3.5" /> Programs &amp; Lessons ({data.programs.length}
            )
          </TabsTrigger>
          <TabsTrigger value="ground" className="gap-1.5 text-xs">
            <School className="h-3.5 w-3.5" /> Classrooms &amp; Lectures ({data.classrooms.length} /{" "}
            {data.lectures.length})
          </TabsTrigger>
          <TabsTrigger value="subjects" className="gap-1.5 text-xs">
            <ClipboardCheck className="h-3.5 w-3.5" /> Exam Subjects ({data.subjects.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: FULL MEMBER REGISTRATION FORM */}
        <TabsContent value="members">
          <Section
            title="Register academy member (Full registration form)"
            description="Create a student pilot, flight instructor (CFI), or ground instructor with full personal, licensing, medical, address, and emergency contact records. Note: admin@flysilverarrows.com is the sole Administrator account."
          >
            <form onSubmit={createUser} className="space-y-5">
              {liveMemberValidationError && (
                <div
                  data-testid="admin-create-validation-alert"
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-destructive/50 bg-destructive/10 p-3.5 text-xs text-destructive"
                >
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Duplicate or Reserved Account Blocked</div>
                    <div className="mt-0.5 text-[11px]">{liveMemberValidationError}</div>
                  </div>
                </div>
              )}
              <div>
                <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  1. Identity &amp; Role Assignment
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Full name *">
                    <Input
                      placeholder="e.g. Rohan Verma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Email address *">
                    <Input
                      type="email"
                      placeholder="rohan@flysilverarrows.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Role *">
                    <NativeSelect value={role} onChange={(e) => setRole(e.target.value as Role)}>
                      {(Object.keys(roleLabel) as Role[])
                        .filter((r) => r !== "admin")
                        .map((r) => (
                          <option key={r} value={r}>
                            {roleLabel[r]}
                          </option>
                        ))}
                    </NativeSelect>
                  </Field>
                  <Field label="Call sign">
                    <Input
                      placeholder="RV1"
                      value={callsign}
                      onChange={(e) => setCallsign(e.target.value)}
                    />
                  </Field>
                  <Field label="Phone number *">
                    <Input
                      type="tel"
                      placeholder="+45 20 99 00 11 or +91 98111 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Date of birth">
                    <Input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </Field>
                  <Field label="Gender">
                    <NativeSelect value={gender} onChange={(e) => setGender(e.target.value)}>
                      {GENDERS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </NativeSelect>
                  </Field>
                  <Field label="Place of birth">
                    <Input
                      placeholder="Copenhagen"
                      value={placeOfBirth}
                      onChange={(e) => setPlaceOfBirth(e.target.value)}
                    />
                  </Field>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  2. Training Programme, Licensing &amp; Medical Currency
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {role === "student" && (
                    <>
                      <Field label="Enrolled training program">
                        <NativeSelect
                          value={programId}
                          onChange={(e) => setProgramId(e.target.value)}
                        >
                          {data.programs.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </NativeSelect>
                      </Field>
                      <Field label="Assigned Flight Instructor (CFI)">
                        <NativeSelect
                          value={instructorId}
                          onChange={(e) => setInstructorId(e.target.value)}
                        >
                          {instructors.map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.name} ({i.callsign ?? "CFI"})
                            </option>
                          ))}
                        </NativeSelect>
                      </Field>
                    </>
                  )}
                  <Field label="Training stage / title">
                    <Input
                      placeholder="Phase 1 — Circuit Consolidation"
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                    />
                  </Field>
                  <Field label="Licence / ratings">
                    <Input
                      placeholder="DK.FCL.PPL / FI(A)"
                      value={licence}
                      onChange={(e) => setLicence(e.target.value)}
                    />
                  </Field>
                  <Field label="Speciality">
                    <Input
                      placeholder="VFR Navigation & Night Rating"
                      value={speciality}
                      onChange={(e) => setSpeciality(e.target.value)}
                    />
                  </Field>
                  <Field label="Medical class">
                    <NativeSelect
                      value={String(medicalClass)}
                      onChange={(e) => setMedicalClass(Number(e.target.value) as 1 | 2)}
                    >
                      <option value="1">Class 1</option>
                      <option value="2">Class 2</option>
                    </NativeSelect>
                  </Field>
                  <Field label="Medical expiry">
                    <Input
                      type="date"
                      value={medicalExpiry}
                      onChange={(e) => setMedicalExpiry(e.target.value)}
                    />
                  </Field>
                  <Field label="SEP / FI rating expiry">
                    <Input
                      type="date"
                      value={ratingExpiry}
                      onChange={(e) => setRatingExpiry(e.target.value)}
                    />
                  </Field>
                  <Field label="ICAO English level (1–6)">
                    <NativeSelect value={icaoLevel} onChange={(e) => setIcaoLevel(e.target.value)}>
                      {[4, 5, 6, 3, 2, 1].map((lvl) => (
                        <option key={lvl} value={String(lvl)}>
                          Level {lvl}
                        </option>
                      ))}
                    </NativeSelect>
                  </Field>
                  <Field label="Prior flight hours (h)">
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      value={priorHours}
                      onChange={(e) => setPriorHours(e.target.value)}
                    />
                  </Field>
                  <Field label="CAA reference number">
                    <Input
                      placeholder="CAA-DK-40291"
                      value={caaRef}
                      onChange={(e) => setCaaRef(e.target.value)}
                    />
                  </Field>
                  <Field label="Academy user reference">
                    <Input
                      placeholder="SA-2026-019"
                      value={userReference}
                      onChange={(e) => setUserReference(e.target.value)}
                    />
                  </Field>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  3. Residential Address &amp; Emergency Contact
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Street address">
                    <Input
                      placeholder="Lufthavnsboulevarden 6"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Field>
                  <Field label="Post code">
                    <Input
                      placeholder="2770"
                      value={postCode}
                      onChange={(e) => setPostCode(e.target.value)}
                    />
                  </Field>
                  <Field label="City">
                    <Input
                      placeholder="Kastrup"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Field>
                  <Field label="Country">
                    <Input
                      placeholder="Denmark"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </Field>
                  <Field label="Emergency contact name">
                    <Input
                      placeholder="Meera Verma"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                    />
                  </Field>
                  <Field label="Emergency contact phone">
                    <Input
                      placeholder="+45 31 22 44 55"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                    />
                  </Field>
                  <Field label="Emergency contact relation">
                    <Input
                      placeholder="Spouse / Parent"
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                    />
                  </Field>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  4. Operational &amp; Staff Notes
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Public note">
                    <Textarea
                      rows={2}
                      placeholder="Visible on member profile…"
                      value={publicNote}
                      onChange={(e) => setPublicNote(e.target.value)}
                    />
                  </Field>
                  <Field label="Instructor note (staff only)">
                    <Textarea
                      rows={2}
                      placeholder="Training notes for CFIs…"
                      value={instructorNote}
                      onChange={(e) => setInstructorNote(e.target.value)}
                    />
                  </Field>
                  <Field label="Admin note (staff only)">
                    <Textarea
                      rows={2}
                      placeholder="Administrative / billing remarks…"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                    />
                  </Field>
                </div>
              </div>

              <Button type="submit" className="w-full sm:w-auto">
                <UserPlus className="mr-1.5 h-4 w-4" /> Register Member Record
              </Button>
            </form>
          </Section>
        </TabsContent>

        {/* TAB 2: AIRCRAFT */}
        <TabsContent value="aircraft">
          <Section
            title="Register training aircraft"
            description="Add a new airframe to the dispatch schedule and maintenance tracker."
          >
            <form onSubmit={createAircraft} className="space-y-4 max-w-2xl">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Registration (tail number) *">
                  <Input
                    placeholder="OY-SAD"
                    value={reg}
                    onChange={(e) => setReg(e.target.value)}
                    required
                  />
                </Field>
                <Field label="Aircraft type *">
                  <Input
                    placeholder="Diamond DA40 NG"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  />
                </Field>
                <Field label="Hourly rate (EUR / h)">
                  <Input
                    type="number"
                    step="1"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    required
                  />
                </Field>
                <Field label="Last 100h service date">
                  <Input
                    type="date"
                    value={lastService}
                    onChange={(e) => setLastService(e.target.value)}
                  />
                </Field>
                <Field label="Initial airframe total hours">
                  <Input
                    type="number"
                    step="0.1"
                    value={totalHours}
                    onChange={(e) => {
                      setTotalHours(e.target.value);
                      setTachHours(e.target.value);
                    }}
                    required
                  />
                </Field>
                <Field label="Initial tach hours">
                  <Input
                    type="number"
                    step="0.1"
                    value={tachHours}
                    onChange={(e) => setTachHours(e.target.value)}
                    required
                  />
                </Field>
              </div>

              <Button type="submit">
                <Plane className="mr-1.5 h-4 w-4" /> Add Aircraft to Fleet
              </Button>
            </form>
          </Section>
        </TabsContent>

        {/* TAB 3: PROGRAMS & LESSONS */}
        <TabsContent value="programs">
          <div className="grid gap-6 lg:grid-cols-2">
            <Section
              title="Create training program"
              description="Define a new syllabus program (e.g. Night Rating, MEP, Instrument Rating)."
            >
              <form onSubmit={createProgram} className="space-y-3">
                <Field label="Program code (optional)">
                  <Input
                    placeholder="nr"
                    value={progCode}
                    onChange={(e) => setProgCode(e.target.value)}
                  />
                </Field>
                <Field label="Program name *">
                  <Input
                    placeholder="EASA Part-FCL Night Rating (NR)"
                    value={progName}
                    onChange={(e) => setProgName(e.target.value)}
                    required
                  />
                </Field>
                <Button type="submit" className="w-full">
                  <GraduationCap className="mr-1.5 h-4 w-4" /> Create Training Program
                </Button>
              </form>
            </Section>

            <Section
              title="Create syllabus lesson"
              description="Append a flight, simulator, or ground lesson to an existing program."
            >
              <form onSubmit={createLesson} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Target program *">
                    <NativeSelect
                      value={lessonProgramId}
                      onChange={(e) => setLessonProgramId(e.target.value)}
                    >
                      {data.programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.lessons.length} lessons)
                        </option>
                      ))}
                    </NativeSelect>
                  </Field>
                  <Field label="Exercise code">
                    <Input
                      placeholder="PPL-11"
                      value={lessonCode}
                      onChange={(e) => setLessonCode(e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Lesson title *">
                  <Input
                    placeholder="Exercise 14 — First Solo Circuit"
                    value={lessonName}
                    onChange={(e) => setLessonName(e.target.value)}
                    required
                  />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Lesson kind">
                    <NativeSelect
                      value={lessonKind}
                      onChange={(e) => setLessonKind(e.target.value as Lesson["kind"])}
                    >
                      <option value="dual">Dual flight instruction</option>
                      <option value="solo">Supervised solo flight</option>
                      <option value="sim">FNPT II Simulator</option>
                      <option value="ground">Ground briefing</option>
                    </NativeSelect>
                  </Field>
                  <Field label="Target duration (minutes)">
                    <Input
                      type="number"
                      step="15"
                      min="15"
                      value={lessonMinutes}
                      onChange={(e) => setLessonMinutes(e.target.value)}
                      required
                    />
                  </Field>
                </div>
                <Field label="Syllabus objective &amp; completion standards">
                  <Textarea
                    rows={2}
                    placeholder="Safe take-off, circuit geometry, stabilized approach and landing…"
                    value={lessonDesc}
                    onChange={(e) => setLessonDesc(e.target.value)}
                  />
                </Field>
                <Button type="submit" className="w-full">
                  <BookOpen className="mr-1.5 h-4 w-4" /> Add Lesson to Program
                </Button>
              </form>
            </Section>
          </div>
        </TabsContent>

        {/* TAB 4: CLASSROOMS & LECTURES */}
        <TabsContent value="ground">
          <div className="grid gap-6 lg:grid-cols-2">
            <Section
              title="Create classroom"
              description="Register a new ground school classroom or briefing room."
            >
              <form onSubmit={createClassroom} className="space-y-3">
                <Field label="Classroom name *">
                  <Input
                    placeholder="Room C — Meteorology & Flight Planning Lab"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                </Field>
                <Field label="Seating capacity *">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={roomCapacity}
                    onChange={(e) => setRoomCapacity(e.target.value)}
                    required
                  />
                </Field>
                <Button type="submit" className="w-full">
                  <School className="mr-1.5 h-4 w-4" /> Create Classroom
                </Button>
              </form>
            </Section>

            <Section
              title="Schedule ground school lecture"
              description="Create a classroom lecture and optionally enrol all active students."
            >
              <form onSubmit={createLecture} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Theory subject *">
                    <NativeSelect
                      value={lectureSubjectId}
                      onChange={(e) => setLectureSubjectId(e.target.value)}
                    >
                      {data.subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.code} — {s.name}
                        </option>
                      ))}
                    </NativeSelect>
                  </Field>
                  <Field label="Classroom *">
                    <NativeSelect
                      value={lectureRoomId}
                      onChange={(e) => setLectureRoomId(e.target.value)}
                    >
                      {data.classrooms.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} (cap. {c.capacity})
                        </option>
                      ))}
                    </NativeSelect>
                  </Field>
                </div>
                <Field label="Lecture topic / title *">
                  <Input
                    placeholder="ICAO Annex 2 Rules of the Air & VFR Minima"
                    value={lectureTitle}
                    onChange={(e) => setLectureTitle(e.target.value)}
                    required
                  />
                </Field>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Date *">
                    <Input
                      type="date"
                      value={lectureDate}
                      onChange={(e) => setLectureDate(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Start time">
                    <Input
                      type="time"
                      value={lectureStart}
                      onChange={(e) => setLectureStart(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="End time">
                    <Input
                      type="time"
                      value={lectureEnd}
                      onChange={(e) => setLectureEnd(e.target.value)}
                      required
                    />
                  </Field>
                </div>
                <Field label="Ground / Flight Instructor">
                  <NativeSelect
                    value={lectureInstructorId}
                    onChange={(e) => setLectureInstructorId(e.target.value)}
                  >
                    {groundInstructors.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({roleLabel[inst.role]})
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                <label className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <Checkbox
                    checked={enrolAllStudents}
                    onCheckedChange={(checked) => setEnrolAllStudents(Boolean(checked))}
                  />
                  <span>Enrol all active students ({activeStudents.length})</span>
                </label>
                <Button type="submit" className="w-full">
                  <CalendarPlus className="mr-1.5 h-4 w-4" /> Schedule Lecture
                </Button>
              </form>
            </Section>
          </div>
        </TabsContent>

        {/* TAB 5: EXAM SUBJECTS */}
        <TabsContent value="subjects">
          <Section
            title="Create EASA theory exam subject"
            description="Add a new theoretical knowledge examination subject to the ground school catalogue."
          >
            <form onSubmit={createSubject} className="space-y-4 max-w-xl">
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Subject code *">
                  <Input
                    placeholder="090"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    required
                  />
                </Field>
                <Field label="Subject name *" className="sm:col-span-2">
                  <Input
                    placeholder="VFR & IFR Communications"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    required
                  />
                </Field>
              </div>
              <Button type="submit">
                <ClipboardCheck className="mr-1.5 h-4 w-4" /> Add Exam Subject
              </Button>
            </form>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
