import Link from "next/link";
import { Empty } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

export default function RecentActivities({ activities }) {
  return (
    <section className="card p-4">
      <h2 className="mb-2 font-semibold">Recent Activities</h2>
      {activities.length === 0 ? <Empty>No activities recorded yet.</Empty> : (
        <ul className="divide-y">
          {activities.map((a) => (
            <li key={a._id}>
              <Link href={`/contacts/${a.contactId?._id}`} className="block py-2 text-sm hover:text-indigo-600">
                <div><span className="badge mr-2">{a.type}</span><span className="font-medium">{a.title}</span></div>
                <div className="text-xs text-slate-500">{a.contactId?.name} · {formatDateTime(a.date)}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
