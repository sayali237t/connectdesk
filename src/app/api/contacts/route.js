import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { apiError, escapeRegex } from "@/lib/utils";

export async function GET(req) {
  try {
    await connectDB();
    const sp = new URL(req.url).searchParams;
    const search = sp.get("search")?.trim();
    const vertical = sp.get("vertical")?.trim();
    const contactType = sp.get("contactType")?.trim();
    const q = {};
    if (search) {
      const r = new RegExp(escapeRegex(search), "i");
      q.$or = [{ name: r }, { email: r }, { phone: r }];
    }
    if (vertical) q.vertical = new RegExp(`^${escapeRegex(vertical)}$`, "i");
    if (contactType) q.contactType = contactType;
    const contacts = await Contact.find(q).sort({ createdAt: -1 });
    return NextResponse.json(contacts);
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, phone, vertical, contactType, description } = await req.json();
    const contact = await Contact.create({ name, email, phone, vertical, contactType, description });
    return NextResponse.json(contact, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}
