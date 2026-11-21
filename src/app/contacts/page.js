"use client";
import { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import ContactTable from "@/components/contacts/ContactTable";
import ContactForm from "@/components/contacts/ContactForm";
import { Spinner, Empty, ErrorBox, confirmDelete } from "@/components/ui";
import { api, CONTACT_TYPES } from "@/lib/utils";

export default function ContactsPage() {
  const [contacts, setContacts] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [vertical, setVertical] = useState("");
  const [contactType, setContactType] = useState("");
  const [editing, setEditing] = useState(null); // contact | "new" | null

  const load = useCallback(async () => {
    try {
      const p = new URLSearchParams();
      if (search) p.set("search", search);
      if (vertical) p.set("vertical", vertical);
      if (contactType) p.set("contactType", contactType);
      setContacts(await api(`/api/contacts?${p}`));
      setError("");
    } catch (e) {
      setError(e.message);
      setContacts([]);
    }
  }, [search, vertical, contactType]);

  useEffect(() => {
    const t = setTimeout(load, 250); // debounce typing
    return () => clearTimeout(t);
  }, [load]);

  async function remove(c) {
    if (!confirmDelete(`contact "${c.name}" and all of their interactions`)) return;
    try {
      await api(`/api/contacts/${c._id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <Header title="Contacts" subtitle="Manage and search your contacts">
        <button className="btn-primary" onClick={() => setEditing("new")}><Plus size={16} /> Add contact</button>
      </Header>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input className="input pl-9" placeholder="Search name, email or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <input className="input" placeholder="Filter by vertical" value={vertical} onChange={(e) => setVertical(e.target.value)} />
        <select className="input" value={contactType} onChange={(e) => setContactType(e.target.value)}>
          <option value="">All contact types</option>
          {CONTACT_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <ErrorBox message={error} />
      {!contacts ? <Spinner /> : contacts.length === 0 ? (
        <div className="card"><Empty>No contacts found. Add your first contact to get started.</Empty></div>
      ) : (
        <ContactTable contacts={contacts} onEdit={setEditing} onDelete={remove} />
      )}
      {editing && (
        <ContactForm
          contact={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </>
  );
}
