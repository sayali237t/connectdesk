"use client";
import { Pencil, Trash2, CalendarClock } from "lucide-react";
import { formatDateTime, isOverdue } from "@/lib/utils";

export default function ActivityTimeline({ items, onEdit, onDelete }) {
  return (
    <ol className="space-y-3">
      {items.map((i) => (
        <li key={i._id} className="card p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="badge mr-2">{i.type}</span>
              <span className="font-medium">{i.title}</span>
              <div className="mt-1 text-xs text-slate-500">{formatDateTime(i.date)}</div>
            </div>
            <div className="flex gap-2">
              <button aria-label="Edit" onClick={() => onEdit(i)}><Pencil size={16} /></button>
              <button aria-label="Delete" className="text-red-600" onClick={() => onDelete(i)}><Trash2 size={16} /></button>
            </div>
          </div>
          {i.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{i.notes}</p>}
          {i.followUpDate && (
            <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${isOverdue(i.followUpDate) ? "text-red-600" : "text-emerald-600"}`}>
              <CalendarClock size={14} /> Follow-up: {formatDateTime(i.followUpDate)} {isOverdue(i.followUpDate) && "(overdue)"}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
