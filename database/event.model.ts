import { Document, Model, Schema, model, models } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const requiredTrimmedString = {
  type: String,
  required: [true, "This field is required"],
  trim: true,
  minlength: [1, "This field cannot be empty"],
};

const EventSchema = new Schema<IEvent>(
  {
    title: { ...requiredTrimmedString, maxlength: 120 },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    description: { ...requiredTrimmedString },
    overview: { ...requiredTrimmedString },
    image: { ...requiredTrimmedString },
    venue: { ...requiredTrimmedString },
    location: { ...requiredTrimmedString },
    date: { ...requiredTrimmedString },
    time: { ...requiredTrimmedString },
    mode: {
      ...requiredTrimmedString,
      enum: ["online", "offline", "hybrid"],
    },
    audience: { ...requiredTrimmedString },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every((item) => item.trim().length > 0),
        message: "Agenda must contain at least one non-empty item",
      },
    },
    organizer: { ...requiredTrimmedString },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every((item) => item.trim().length > 0),
        message: "Tags must contain at least one non-empty item",
      },
    },
  },
  {
    timestamps: true,
  },
);

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeDateToISO(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format");
  }

  // Store date as ISO 8601 date-only string (YYYY-MM-DD).
  return parsedDate.toISOString().split("T")[0];
}

function normalizeTime(value: string): string {
  const input = value.trim();
  const match = input.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);

  if (!match) {
    throw new Error("Invalid time format. Use HH:MM or HH:MM AM/PM");
  }

  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const period = match[3]?.toUpperCase();

  if (period) {
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error("Invalid time value");
  }

  // Persist time in consistent 24-hour HH:MM format.
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

EventSchema.pre("save", function (next) {
  const event = this as IEvent;

  // Regenerate slug only for new documents or title updates.
  if (event.isNew || event.isModified("title")) {
    event.slug = createSlug(event.title);
  }

  // Normalize date and time into stable formats before persisting.
  if (event.isNew || event.isModified("date")) {
    event.date = normalizeDateToISO(event.date);
  }

  if (event.isNew || event.isModified("time")) {
    event.time = normalizeTime(event.time);
  }

  next();
});

EventSchema.index({ slug: 1 }, { unique: true });

type EventModel = Model<IEvent>;

const Event =
  (models.Event as EventModel | undefined) ||
  model<IEvent, EventModel>("Event", EventSchema);

export default Event;
