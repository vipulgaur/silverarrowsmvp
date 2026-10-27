import { useEffect, useMemo, useState, type FormEvent } from "react";
import { UserPen } from "lucide-react";
import { toast } from "sonner";
import { Field, NativeSelect } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  BOOLEAN_PROFILE_FIELDS,
  DATE_PROFILE_FIELDS,
  GENDERS,
  PROFILE_FIELDS,
  STAFF_ONLY_FIELDS,
  TECHNICAL_SPECIFIC_OPTIONS,
  submitProfileRequest,
} from "@/lib/logic";
import { useStore } from "@/lib/store";
import type { ProfileChanges, ProfileField, User } from "@/lib/types";

export function ProfileEditor({
  person,
  user,
  open: controlledOpen,
  onOpenChange,
}: {
  person?: User;
  user?: User;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { data, me, commit, log } = useStore();
  const target = person ?? user ?? me;
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  const isAdmin = me?.role === "admin";
  const editableKeys = useMemo(
    () =>
      (Object.keys(PROFILE_FIELDS) as ProfileField[]).filter(
        (k) => !(isAdmin ? false : (STAFF_ONLY_FIELDS as readonly string[]).includes(k)),
      ),
    [isAdmin],
  );

  const [draft, setDraft] = useState<Record<string, string>>(() => {
    if (!target) return {};
    return Object.fromEntries(editableKeys.map((k) => [k, String(target[k] ?? "")]));
  });

  useEffect(() => {
    if (target && isOpen) {
      setDraft(Object.fromEntries(editableKeys.map((k) => [k, String(target[k] ?? "")])));
    }
  }, [target, isOpen, editableKeys]);

  if (!target || !me) return null;
  if (me.role !== "admin" && me.id !== target.id) return null;

  function handleOpen() {
    setDraft(Object.fromEntries(editableKeys.map((k) => [k, String(target![k] ?? "")])));
    setIsOpen(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!me || !target) return;

    const changes: ProfileChanges = {};
    for (const k of editableKeys) {
      const raw = (draft[k] ?? "").trim();
      const orig = String(target[k] ?? "").trim();
      if (raw === orig) continue;
      if (k === "medicalClass") {
        changes[k] = raw ? (Number(raw) as 1 | 2) : undefined;
      } else if (k === "icaoLevel") {
        changes[k] = raw ? Number(raw) : undefined;
      } else if ((BOOLEAN_PROFILE_FIELDS as readonly string[]).includes(k)) {
        changes[k as "examAirRegulation"] = raw === "true";
      } else {
        changes[k as "name"] = raw;
      }
    }

    const res = submitProfileRequest(data, me, target.id, changes);
    const err = commit(res);
    if (err) {
      toast.error(err);
      return;
    }

    const approved = me.role === "admin";
    log(
      approved ? "profile_updated" : "profile_change_requested",
      "user",
      approved
        ? `Updated profile for ${target.name}`
        : `Submitted profile change request for ${target.name}`,
      target.id,
    );
    toast.success(
      approved ? "Profile updated" : "Profile change submitted for administrator approval",
    );
    setIsOpen(false);
  }

  const isDateField = (k: ProfileField) =>
    (DATE_PROFILE_FIELDS as readonly string[]).includes(k);

  const isBooleanField = (k: ProfileField) =>
    (BOOLEAN_PROFILE_FIELDS as readonly string[]).includes(k);

  return (
    <>
      {controlledOpen === undefined && (
        <Button size="sm" variant="outline" onClick={handleOpen}>
          <UserPen className="mr-1.5 h-3.5 w-3.5" />
          Edit profile
        </Button>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit profile — {target.name}</DialogTitle>
            <DialogDescription>
              {me.role === "admin"
                ? "Administrator edits take effect immediately and are logged in the audit trail."
                : "Changes are submitted for review and take effect once approved."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 py-2">
            <div className="grid gap-3 sm:grid-cols-2">
              {editableKeys.map((key) => (
                <Field key={key} label={PROFILE_FIELDS[key]}>
                  {key === "gender" ? (
                    <NativeSelect
                      value={draft[key] ?? ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                    >
                      <option value="">— Select —</option>
                      {GENDERS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </NativeSelect>
                  ) : key === "medicalClass" ? (
                    <NativeSelect
                      value={draft[key] ?? ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                    >
                      <option value="">— Select —</option>
                      <option value="1">Class 1</option>
                      <option value="2">Class 2</option>
                    </NativeSelect>
                  ) : key === "examTechnicalSpecific" ? (
                    <NativeSelect
                      value={draft[key] ?? "Not Attempted"}
                      onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                    >
                      {TECHNICAL_SPECIFIC_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </NativeSelect>
                  ) : isBooleanField(key) ? (
                    <label className="flex h-9 cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground">
                      <input
                        type="checkbox"
                        checked={draft[key] === "true"}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            [key]: e.target.checked ? "true" : "false",
                          }))
                        }
                        className="h-4 w-4 rounded border-border accent-primary"
                      />
                      <span>{draft[key] === "true" ? "Completed / Passed" : "Pending"}</span>
                    </label>
                  ) : (
                    <Input
                      type={
                        isDateField(key)
                          ? "date"
                          : key === "email"
                            ? "email"
                            : key === "icaoLevel"
                              ? "number"
                              : "text"
                      }
                      value={draft[key] ?? ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                  )}
                </Field>
              ))}
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {me.role === "admin" ? "Save changes" : "Submit for approval"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
