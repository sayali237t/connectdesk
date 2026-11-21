import mongoose from "mongoose";
import { CONTACT_TYPES } from "@/lib/utils";

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      trim: true,
      default: "",
      validate: { validator: (v) => !v || /^\S+@\S+\.\S+$/.test(v), message: "Invalid email" },
    },
    phone: { type: String, trim: true, default: "" },
    vertical: { type: String, trim: true, default: "" },
    contactType: {
      type: String,
      default: "",
      validate: { validator: (v) => !v || CONTACT_TYPES.includes(v), message: "Invalid contact type" },
    },
    description: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
