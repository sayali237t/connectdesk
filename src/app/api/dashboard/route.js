import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import Interaction from "@/models/Interaction";
import { apiError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const now = new Date();
    const [totalContacts, totalInteractions, recentContacts, recentActivities, followUps] = await Promise.all([
      Contact.countDocuments(),
      Interaction.countDocuments(),
      Contact.find().sort({ createdAt: -1 }).limit(5),
      Interaction.find().sort({ date: -1 }).limit(5).populate("contactId", "name"),
      // all interactions with a follow-up (upcoming + overdue), soonest first
      Interaction.find({ followUpDate: { $ne: null } }).sort({ followUpDate: 1 }).limit(20).populate("contactId", "name"),
    ]);
    const upcomingFollowUps = await Interaction.countDocuments({ followUpDate: { $gte: now } });
    return NextResponse.json({ totalContacts, totalInteractions, upcomingFollowUps, recentContacts, recentActivities, followUps });
  } catch (e) {
    return apiError(e);
  }
}
