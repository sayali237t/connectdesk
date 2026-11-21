"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import Header from "@/components/layout/Header";
import { Spinner, Empty, ErrorBox } from "@/components/ui";
import { api, INTERACTION_TYPES, formatDateTime, isOverdue } from "@/lib/utils";

export default function ActivitiesPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("desc");
  const [followOnly, setFollowOnly] = useState(false);

  const load = useCallback(async () => {
    try {
      const p = new URLSearchParams({ sort });
      if (type) p.set("type", type);
      setItems(await api(`/api/interactions?${p}`));
      setError("");
    } catch (e) { setError(e.message); setItems([]); }
  }, [type, sort]);

  useEffect(() => { load(); }, [load]);

  const shown = items && (followOnly ? items.filter((i) => i.followUpDate) : items);

  return (
    <>
      <Header title="Activities" subtitle="Interaction history across all contacts" />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {INTERACTION_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={followOnly} onChange={(e) => setFollowOnly(e.target.checked)} /> Only with follow-ups (upcoming & overdue)
        </label>
      </div>
      <ErrorBox message={error} />
      {!shown ? <Spinner /> : shown.length === 0 ? (
        <div className="card"><Empty>No activities found.</Empty></div>
      ) : (
        <ul className="space-y-3">
          {shown.map((i) => (
            <li key={i._id}>
              <Link href={`/contacts/${i.contactId?._id}`} className="card block p-4 hover:border-indigo-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div><span className="badge mr-2">{i.type}</span><span className="font-medium">{i.title}</span></div>
                  <span className="text-xs text-slate-500">{formatDateTime(i.date)}</span>
                </div>
                <div className="mt-1 text-sm text-slate-600">{i.contactId?.name}</div>
                {i.notes && <p className="mt-1 line-clamp-2 text-sm text-slate-700">{i.notes}</p>}
                {i.followUpDate && (
                  <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${isOverdue(i.followUpDate) ? "text-red-600" : "text-emerald-600"}`}>
                    <CalendarClock size={14} /> Follow-up: {formatDateTime(i.followUpDate)} {isOverdue(i.followUpDate) && "(overdue)"}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
