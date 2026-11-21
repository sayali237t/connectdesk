"use client";
import { useState } from "react";
import { Modal, ErrorBox } from "@/components/ui";
import { api, INTERACTION_TYPES, toLocalInput } from "@/lib/utils";

export default function InteractionForm({ contactId, interaction, onClose, onSaved }) {
  const [form, setForm] = useState({
    type: interaction?.type || "Call",
    title: interaction?.title || "",
    notes: interaction?.notes || "",
    date: toLocalInput(interaction?.date || new Date()),
    followUpDate: toLocalInput(interaction?.followUpDate),
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required");
    if (!form.date) return setError("Date is required");
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        date: new Date(form.date).toISOString(),
        followUpDate: form.followUpDate ? new Date(form.followUpDate).toISOString() : null,
      };
      if (!interaction) payload.contactId = contactId;
      const saved = await api(interaction ? `/api/interactions/${interaction._id}` : "/api/interactions", {
        method: interaction ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      onSaved(saved);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title={interaction ? "Edit interaction" : "Add interaction"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <ErrorBox message={error} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Type *</label>
            <select className="input" value={form.type} onChange={set("type")}>
              {INTERACTION_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label className="label">Title *</label><input className="input" value={form.title} onChange={set("title")} /></div>
          <div><label className="label">Date & time *</label><input type="datetime-local" className="input" value={form.date} onChange={set("date")} /></div>
          <div><label className="label">Follow-up date</label><input type="datetime-local" className="input" value={form.followUpDate} onChange={set("followUpDate")} /></div>
        </div>
        <div><label className="label">Notes</label><textarea rows={3} className="input" value={form.notes} onChange={set("notes")} /></div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </Modal>
  );
}
