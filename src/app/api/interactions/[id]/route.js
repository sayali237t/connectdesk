import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Interaction from "@/models/Interaction";
import { apiError, badId, isValidId, notFound } from "@/lib/utils";

export async function GET(_req, { params }) {
  try {
    if (!isValidId(params.id)) return badId();
    await connectDB();
    const item = await Interaction.findById(params.id).populate("contactId", "name");
    if (!item) return notFound("Interaction");
    return NextResponse.json(item);
  } catch (e) {
    return apiError(e);
  }
}

export async function PUT(req, { params }) {
  try {
    if (!isValidId(params.id)) return badId();
    await connectDB();
    const body = await req.json();
    const item = await Interaction.findById(params.id);
    if (!item) return notFound("Interaction");
    // contactId is immutable
    for (const k of ["type", "title", "notes", "date"]) if (body[k] !== undefined) item[k] = body[k];
    if (body.followUpDate !== undefined) item.followUpDate = body.followUpDate || null;
    await item.save();
    return NextResponse.json(item);
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(_req, { params }) {
  try {
    if (!isValidId(params.id)) return badId();
    await connectDB();
    const item = await Interaction.findByIdAndDelete(params.id);
    if (!item) return notFound("Interaction");
    return NextResponse.json({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
