"use client";
import { useState } from "react";
import { Modal, ErrorBox } from "@/components/ui";
import { api, CONTACT_TYPES } from "@/lib/utils";

export default function ContactForm({ contact, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: contact?.name || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    vertical: contact?.vertical || "",
    contactType: contact?.contactType || "",
    description: contact?.description || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Full name is required");
    setSaving(true);
    setError("");
    try {
      const saved = await api(contact ? `/api/contacts/${contact._id}` : "/api/contacts", {
        method: contact ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      onSaved(saved);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title={contact ? "Edit contact" : "Add contact"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <ErrorBox message={error} />
        <div><label className="label">Full name *</label><input className="input" value={form.name} onChange={set("name")} /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={set("email")} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={set("phone")} /></div>
          <div><label className="label">Vertical</label><input className="input" value={form.vertical} onChange={set("vertical")} /></div>
          <div>
            <label className="label">Contact type</label>
            <select className="input" value={form.contactType} onChange={set("contactType")}>
              <option value="">— None —</option>
              {CONTACT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div><label className="label">Description</label><textarea rows={3} className="input" value={form.description} onChange={set("description")} /></div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </Modal>
  );
}
