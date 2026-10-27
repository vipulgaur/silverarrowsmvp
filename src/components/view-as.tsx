import { useNavigate } from "@tanstack/react-router";
import { NativeSelect } from "@/components/app-ui";
import { activeUsers } from "@/lib/logic";
import { useStore } from "@/lib/store";
import type { Role, User } from "@/lib/types";

export function viewAsSearch(search: Record<string, unknown>): { id?: string } {
  return typeof search.id === "string" && search.id ? { id: search.id } : {};
}

export function useViewAs(role: Role, id?: string): User | undefined {
  const { data, me } = useStore();
  if (!me) return undefined;
  if (me.role !== "admin") {
    return me.role === role ? me : undefined;
  }
  const pool = activeUsers(data, role);
  if (id) {
    const picked = pool.find((u) => u.id === id);
    if (picked) return picked;
  }
  return pool[0];
}

export function ViewAsPicker({ role, current, to }: { role: Role; current?: User; to: string }) {
  const { data, me } = useStore();
  const navigate = useNavigate();

  if (!me || me.role !== "admin") return null;

  const candidates = activeUsers(data, role);
  if (candidates.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">View as:</span>
      <NativeSelect
        aria-label={`Select ${role} to view`}
        value={current?.id ?? ""}
        onChange={(e) => {
          const nextId = e.target.value;
          void navigate({
            to: to as never,
            search: (nextId ? { id: nextId } : {}) as never,
          });
        }}
        className="w-auto min-w-[180px]"
      >
        {candidates.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} {u.callsign ? `(${u.callsign})` : ""}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}
