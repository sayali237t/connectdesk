import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import Interaction from "@/models/Interaction";
import { apiError, badId, isValidId, notFound } from "@/lib/utils";

export async function GET(_req, { params }) {
  try {
    if (!isValidId(params.id)) return badId();
    await connectDB();
    const contact = await Contact.findById(params.id);
    if (!contact) return notFound("Contact");
    return NextResponse.json(contact);
  } catch (e) {
    return apiError(e);
  }
}

export async function PUT(req, { params }) {
  try {
    if (!isValidId(params.id)) return badId();
    await connectDB();
    const body = await req.json();
    const contact = await Contact.findById(params.id);
    if (!contact) return notFound("Contact");
    for (const k of ["name", "email", "phone", "vertical", "contactType", "description"]) {
      if (body[k] !== undefined) contact[k] = body[k];
    }
    await contact.save();
    return NextResponse.json(contact);
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(_req, { params }) {
  try {
    if (!isValidId(params.id)) return badId();
    await connectDB();
    const contact = await Contact.findByIdAndDelete(params.id);
    if (!contact) return notFound("Contact");
    await Interaction.deleteMany({ contactId: params.id });
    return NextResponse.json({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
