import Link from "next/link";
import { Empty } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default function RecentContacts({ contacts }) {
  return (
    <section className="card p-4">
      <h2 className="mb-2 font-semibold">Recent Contacts</h2>
      {contacts.length === 0 ? <Empty>No contacts yet.</Empty> : (
        <ul className="divide-y">
          {contacts.map((c) => (
            <li key={c._id}>
              <Link href={`/contacts/${c._id}`} className="flex justify-between py-2 text-sm hover:text-indigo-600">
                <span className="font-medium">{c.name}</span><span className="text-slate-500">{formatDate(c.createdAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
