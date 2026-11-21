// Idempotent seed: upserts demo contacts (by email) and interactions (by contact + title).
// Usage: npm run seed
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// minimal .env.local loader (no extra dependency)
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

const day = 86400000;
const ago = (d, h = 10) => new Date(Date.now() - d * day + (h - 12) * 3600000);
const ahead = (d, h = 10) => ago(-d, h);

const contacts = [
  { name: "Sayali Thakur", email: "sayali@example.com", phone: "+919876543210", vertical: "Event Planning", contactType: "Client", description: "Organising Sunburn Campus Concert in Pune. Expects ~1500 guests, budget around 8-10 lakh.", ageDays: 12 },
  { name: "Rohan Mehta", email: "rohan.mehta@example.com", phone: "+919811122233", vertical: "Performance", contactType: "Professional", description: "Band / musician, 1-2 hour sets. Brings own instruments, needs sound system on site.", ageDays: 9 },
  { name: "Priya Nair", email: "priya.nair@example.com", phone: "+919822233344", vertical: "Event Planning", contactType: "Client", description: "Corporate annual day in Mumbai, 300 attendees. Needs planner plus anchor and DJ.", ageDays: 7 },
  { name: "Arjun Kulkarni", email: "arjun.k@example.com", phone: "+919833344455", vertical: "Crew", contactType: "Professional", description: "Stage technician lead. Runs a team of lighting and sound crew for 8-hour shifts.", ageDays: 5 },
  { name: "Neha Sharma", email: "neha.sharma@example.com", phone: "+919844455566", vertical: "Performance", contactType: "Candidate", description: "Classical and fusion dancer, available for college fests. Duration 30-60 minutes.", ageDays: 3 },
  { name: "Vikram Singh", email: "vikram@example.com", phone: "", vertical: "Crew", contactType: "Other", description: "Met at an event expo. Supplies volunteers and backstage crew for wedding events.", ageDays: 1 },
];

const interactions = [
  { email: "sayali@example.com", type: "Meeting", title: "Event requirements discussion", notes: "Sunburn Campus Concert on 15 Feb in Pune. Needs a performer and 12 crew. Budget 8-10 lakh.", date: ago(6), followUpDate: ahead(2) },
  { email: "sayali@example.com", type: "Email", title: "Sent venue and category checklist", notes: "Shared planner, performer and crew requirement form. Awaiting sound system confirmation.", date: ago(4), followUpDate: null },
  { email: "rohan.mehta@example.com", type: "Call", title: "Performance availability call", notes: "Available 15 Feb for a 1-2 hour set. Sound system required. Quote pending.", date: ago(5), followUpDate: ago(1) },
  { email: "priya.nair@example.com", type: "Meeting", title: "Corporate annual day planning", notes: "300 attendees, Mumbai. Discussed stage layout, anchor, DJ and catering timeline.", date: ago(3), followUpDate: ahead(4) },
  { email: "priya.nair@example.com", type: "General Note", title: "Budget capped for phase one", notes: "Budget limited to planner and performer. Crew to be decided later.", date: ago(2), followUpDate: null },
  { email: "arjun.k@example.com", type: "Call", title: "Crew shift and headcount", notes: "Can supply 10 technicians for an 8-hour shift. Needs equipment list in advance.", date: ago(2), followUpDate: ahead(7) },
  { email: "neha.sharma@example.com", type: "Interview", title: "Audition for college fest", notes: "Showcased a 45-minute fusion set. No sound system needed beyond basic speakers.", date: ago(1), followUpDate: ahead(1) },
  { email: "vikram@example.com", type: "General Note", title: "Expo conversation", notes: "Can provide volunteers and backstage crew for wedding events. Follow up with rates.", date: ago(0, 9), followUpDate: ahead(10) },
];
await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
const Contacts = db.collection("contacts");
const Interactions = db.collection("interactions");

const ids = {};
for (const { ageDays, ...c } of contacts) {
  const created = ago(ageDays);
  const r = await Contacts.findOneAndUpdate(
    { email: c.email },
    { $set: { ...c, updatedAt: new Date() }, $setOnInsert: { createdAt: created } },
    { upsert: true, returnDocument: "after" }
  );
  ids[c.email] = r._id;
}

for (const { email, ...i } of interactions) {
  await Interactions.updateOne(
    { contactId: ids[email], title: i.title },
    { $set: { ...i, contactId: ids[email], updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
}

// Remove stale demo interactions: for the seeded contacts only, drop anything not in the current seed list
const keep = interactions.map((i) => ({ contactId: ids[i.email], title: i.title }));
const stale = await Interactions.deleteMany({
  contactId: { $in: Object.values(ids) },
  $nor: keep,
});
console.log(`Removed ${stale.deletedCount} stale interactions.`);

console.log(`Seeded ${contacts.length} contacts and ${interactions.length} interactions.`);
await mongoose.disconnect();

