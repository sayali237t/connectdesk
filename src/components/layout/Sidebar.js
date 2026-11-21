"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Activity, Contact2 } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/activities", label: "Activities", icon: Activity },
];

export default function Sidebar() {
  const path = usePathname();
  const active = (h) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <aside className="border-b border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 px-4 py-3 text-lg font-bold text-indigo-600 md:py-5">
        <Contact2 /> ConnectDesk
      </div>
      <nav className="flex gap-1 px-2 pb-2 md:flex-col md:px-3">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium md:flex-none ${
              active(href) ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
