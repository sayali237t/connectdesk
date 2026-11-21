import Link from "next/link";
import { Empty } from "@/components/ui";
import { formatDateTime, isOverdue } from "@/lib/utils";

export default function FollowUps({ followUps }) {
  return (
    <section className="card p-4">
      <h2 className="mb-2 font-semibold">Follow-ups</h2>
      {followUps.length === 0 ? <Empty>No follow-ups scheduled.</Empty> : (
        <ul className="divide-y">
          {followUps.map((f) => {
            const late = isOverdue(f.followUpDate);
            return (
              <li key={f._id}>
                <Link href={`/contacts/${f.contactId?._id}`} className="flex items-center justify-between gap-2 py-2 text-sm hover:bg-slate-50">
                  <div>
                    <div className="font-medium">{f.contactId?.name}</div>
                    <div className="text-xs text-slate-500">{f.title}</div>
                  </div>
                  <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${late ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {late ? "Overdue · " : ""}{formatDateTime(f.followUpDate)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
