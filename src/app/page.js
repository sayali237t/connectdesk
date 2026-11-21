"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Header from "@/components/layout/Header";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentContacts from "@/components/dashboard/RecentContacts";
import RecentActivities from "@/components/dashboard/RecentActivities";
import FollowUps from "@/components/dashboard/FollowUps";
import ContactForm from "@/components/contacts/ContactForm";
import { Spinner, ErrorBox } from "@/components/ui";
import { api } from "@/lib/utils";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api("/api/dashboard").then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <Header title="Dashboard" subtitle="Overview of your contacts and activity">
        <button className="btn-primary" onClick={() => setAdding(true)}><Plus size={16} /> Quick Add</button>
      </Header>
      <ErrorBox message={error} />
      {!data && !error && <Spinner />}
      {data && (
        <div className="space-y-4">
          <StatsCards data={data} />
          <FollowUps followUps={data.followUps} />
          <div className="grid gap-4 lg:grid-cols-2">
            <RecentContacts contacts={data.recentContacts} />
            <RecentActivities activities={data.recentActivities} />
          </div>
        </div>
      )}
      {adding && <ContactForm onClose={() => setAdding(false)} onSaved={(c) => router.push(`/contacts/${c._id}`)} />}
    </>
  );
}
