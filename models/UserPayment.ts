import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUserPayment extends Document {
  userId: mongoose.Types.ObjectId
  email?: string
  eventFeePaid: boolean
  eventFeeAmount: number // 1 for PSG students, 200 for others
  workshopsPaid: string[] // Array of workshop IDs that are paid
  
  createdAt: Date
  updatedAt: Date
}

const UserPaymentSchema = new Schema<IUserPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // NOT unique - we use findOneAndUpdate with upsert instead
    },
    email: {
      type: String,
    },
    eventFeePaid: {
      type: Boolean,
      default: false,
    },
    eventFeeAmount: {
      type: Number,
      default: 200,
    },
    workshopsPaid: {
      type: [String],
      default: [],
    },
  },
  {
    autoIndex: false, // CRITICAL: Prevent auto index creation issues
    timestamps: true,
  }
)

// Single index on userId for lookups (not unique at schema level)
UserPaymentSchema.index({ userId: 1 })

const UserPayment: Model<IUserPayment> =
  mongoose.models.UserPayment || mongoose.model<IUserPayment>("UserPayment", UserPaymentSchema)

export default UserPayment

