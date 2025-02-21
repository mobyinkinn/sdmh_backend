// models/Metadata.js
import mongoose, {Schema} from "mongoose";

const MetadataSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: { type: String, required: true },
  pagename: { type: String, required: true },
  h1: { type: String, required: true },
  h2: { type: String, required: true },
});

export const Metadata = mongoose.model("Metadata", MetadataSchema);
