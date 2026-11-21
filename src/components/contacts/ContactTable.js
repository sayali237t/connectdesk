"use client";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ContactTable({ contacts, onEdit, onDelete }) {
  const router = useRouter();
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Vertical</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Added</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c._id} className="cursor-pointer border-b last:border-0 hover:bg-slate-50" onClick={() => router.push(`/contacts/${c._id}`)}>
              <td className="px-4 py-3 font-medium">{c.name}</td>
              <td className="px-4 py-3">{c.email || "—"}</td>
              <td className="px-4 py-3">{c.phone || "—"}</td>
              <td className="px-4 py-3">{c.vertical || "—"}</td>
              <td className="px-4 py-3">{c.contactType ? <span className="badge">{c.contactType}</span> : "—"}</td>
              <td className="px-4 py-3">{formatDate(c.createdAt)}</td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-2">
                  <button aria-label="Edit" onClick={() => onEdit(c)}><Pencil size={16} /></button>
                  <button aria-label="Delete" className="text-red-600" onClick={() => onDelete(c)}><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
