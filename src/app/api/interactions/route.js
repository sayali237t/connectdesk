import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import Interaction from "@/models/Interaction";
import { apiError, badId, isValidId, notFound } from "@/lib/utils";

export async function GET(req) {
  try {
    await connectDB();
    const sp = new URL(req.url).searchParams;
    const contactId = sp.get("contactId");
    const type = sp.get("type");
    const sort = sp.get("sort") === "asc" ? 1 : -1;
    const q = {};
    if (contactId) {
      if (!isValidId(contactId)) return badId();
      q.contactId = contactId;
    }
    if (type) q.type = type;
    const items = await Interaction.find(q).sort({ date: sort }).populate("contactId", "name");
    return NextResponse.json(items);
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { contactId, type, title, notes, date, followUpDate } = await req.json();
    if (!contactId || !isValidId(contactId)) return badId();
    if (!(await Contact.exists({ _id: contactId }))) return notFound("Contact");
    const item = await Interaction.create({ contactId, type, title, notes, date, followUpDate: followUpDate || null });
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}
