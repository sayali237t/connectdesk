"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import ContactCard from "@/components/contacts/ContactCard";
import ContactForm from "@/components/contacts/ContactForm";
import ActivityTimeline from "@/components/interactions/ActivityTimeline";
import InteractionForm from "@/components/interactions/InteractionForm";
import { Spinner, Empty, ErrorBox, confirmDelete } from "@/components/ui";
import { api } from "@/lib/utils";

export default function ContactProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [contact, setContact] = useState(null);
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [editContact, setEditContact] = useState(false);
  const [editing, setEditing] = useState(null); // interaction | "new" | null

  const load = useCallback(async () => {
    try {
      const [c, i] = await Promise.all([api(`/api/contacts/${id}`), api(`/api/interactions?contactId=${id}&sort=desc`)]);
      setContact(c);
      setItems(i);
    } catch (e) {
      setError(e.message);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function removeContact() {
    if (!confirmDelete("contact and all of its interactions")) return;
    try {
      await api(`/api/contacts/${id}`, { method: "DELETE" });
      router.push("/contacts");
    } catch (e) { setError(e.message); }
  }

  async function removeInteraction(i) {
    if (!confirmDelete("interaction")) return;
    try {
      await api(`/api/interactions/${i._id}`, { method: "DELETE" });
      load();
    } catch (e) { setError(e.message); }
  }

  return (
    <>
      <Link href="/contacts" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-indigo-600"><ArrowLeft size={14} /> Contacts</Link>
      <ErrorBox message={error} />
      {!contact && !error && <Spinner />}
      {contact && (
        <div className="space-y-6">
          <ContactCard contact={contact} onEdit={() => setEditContact(true)} onDelete={removeContact} />
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Interaction timeline</h2>
              <button className="btn-primary" onClick={() => setEditing("new")}><Plus size={16} /> Add Interaction</button>
            </div>
            {!items ? <Spinner /> : items.length === 0 ? (
              <div className="card"><Empty>No interactions yet.</Empty></div>
            ) : (
              <ActivityTimeline items={items} onEdit={setEditing} onDelete={removeInteraction} />
            )}
          </div>
        </div>
      )}
      {editContact && <ContactForm contact={contact} onClose={() => setEditContact(false)} onSaved={() => { setEditContact(false); load(); }} />}
      {editing && (
        <InteractionForm
          contactId={id}
          interaction={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </>
  );
}
