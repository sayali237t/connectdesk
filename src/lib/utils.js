import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const CONTACT_TYPES = ["Student", "Client", "Candidate", "Professional", "Other"];
export const INTERACTION_TYPES = ["Call", "Meeting", "Interview", "Email", "General Note"];

export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);

export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function apiError(error) {
  if (error?.name === "ValidationError") {
    const msg = Object.values(error.errors).map((e) => e.message).join(", ");
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  if (error?.name === "CastError") {
    return NextResponse.json({ error: "Invalid value: " + error.path }, { status: 400 });
  }
  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export const badId = () => NextResponse.json({ error: "Invalid ID" }, { status: 400 });
export const notFound = (what) => NextResponse.json({ error: `${what} not found` }, { status: 404 });

export function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
export function formatDateTime(d) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
// value for <input type="datetime-local">
export function toLocalInput(d) {
  if (!d) return "";
  const dt = new Date(d);
  const off = dt.getTimezoneOffset() * 60000;
  return new Date(dt.getTime() - off).toISOString().slice(0, 16);
}
export function isOverdue(d) {
  return d && new Date(d) < new Date();
}

export async function api(url, options) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}
