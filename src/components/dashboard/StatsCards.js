import { Users, MessageSquare, CalendarClock } from "lucide-react";

export default function StatsCards({ data }) {
  const cards = [
    { label: "Total Contacts", value: data.totalContacts, icon: Users },
    { label: "Total Interactions", value: data.totalInteractions, icon: MessageSquare },
    { label: "Upcoming Follow-ups", value: data.upcomingFollowUps, icon: CalendarClock },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(({ label, value, icon: Icon }) => (
        <div key={label} className="card flex items-center gap-4 p-4">
          <div className="rounded-md bg-indigo-50 p-3 text-indigo-600"><Icon /></div>
          <div><div className="text-2xl font-bold">{value}</div><div className="text-sm text-slate-500">{label}</div></div>
        </div>
      ))}
    </div>
  );
}
