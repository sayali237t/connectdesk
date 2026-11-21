"use client";
import { Pencil, Trash2, Mail, Phone } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Contact info panel for the profile page
export default function ContactCard({ contact, onEdit, onDelete }) {
  const Row = ({ label, children }) => (
    <div><dt className="text-xs uppercase text-slate-500">{label}</dt><dd className="text-sm">{children || "—"}</dd></div>
  );
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-start justify-between gap-2">
        <h2 className="text-xl font-semibold">{contact.name}</h2>
        <div className="flex gap-2">
          <button className="btn-outline" onClick={onEdit}><Pencil size={14} /> Edit</button>
          <button className="btn-danger" onClick={onDelete}><Trash2 size={14} /> Delete</button>
        </div>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">
        <Row label="Email">{contact.email && <span className="inline-flex items-center gap-1"><Mail size={14} />{contact.email}</span>}</Row>
        <Row label="Phone">{contact.phone && <span className="inline-flex items-center gap-1"><Phone size={14} />{contact.phone}</span>}</Row>
        <Row label="Vertical">{contact.vertical}</Row>
        <Row label="Contact type">{contact.contactType}</Row>
        <Row label="Date added">{formatDate(contact.createdAt)}</Row>
        <div className="sm:col-span-2"><Row label="Description">{contact.description}</Row></div>
      </dl>
    </div>
  );
}
