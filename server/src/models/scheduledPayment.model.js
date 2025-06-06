import mongoose from "mongoose";

const scheduledPaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ScheduledPayment = mongoose.model(
  "ScheduledPayment",
  scheduledPaymentSchema
);

export default ScheduledPayment;
