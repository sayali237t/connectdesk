import mongoose from "mongoose";
import { INTERACTION_TYPES } from "@/lib/utils";

const InteractionSchema = new mongoose.Schema(
  {
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", required: [true, "Contact is required"], index: true },
    type: { type: String, required: [true, "Type is required"], enum: { values: INTERACTION_TYPES, message: "Invalid interaction type" } },
    title: { type: String, required: [true, "Title is required"], trim: true },
    notes: { type: String, trim: true, default: "" },
    date: { type: Date, required: [true, "Date is required"] },
    followUpDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Interaction || mongoose.model("Interaction", InteractionSchema);
