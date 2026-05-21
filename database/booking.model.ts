import { Document, Model, Schema, Types, model, models } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true,
  },
);

BookingSchema.pre("save", async function (next) {
  const booking = this as IBooking;

  if (booking.isNew || booking.isModified("eventId")) {
    // Guard referential integrity by ensuring the linked Event exists.
    const eventExists = await Event.exists({ _id: booking.eventId });

    if (!eventExists) {
      return next(new Error("Referenced event does not exist"));
    }
  }

  next();
});

type BookingModel = Model<IBooking>;

const Booking =
  (models.Booking as BookingModel | undefined) ||
  model<IBooking, BookingModel>("Booking", BookingSchema);

export default Booking;
