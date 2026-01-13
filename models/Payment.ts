import mongoose, { Schema, Document, Model } from "mongoose"

export interface IPayment extends Document {
  authUserId: string
  email: string
  
  type: "EVENT" | "WORKSHOP"
  workshopId?: string
  
  amount: number
  txn_id: string
  reg_id: string
  
  status: "PENDING" | "SUCCESS" | "FAILED"
  provider: string // "2" for Paytm as per API
  
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    authUserId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["EVENT", "WORKSHOP"],
      required: true,
    },
    workshopId: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    txn_id: {
      type: String,
      required: true,
      unique: true,
    },
    reg_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    provider: {
      type: String,
      default: "2",
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster lookups (txn_id already has unique:true which creates an index)
PaymentSchema.index({ authUserId: 1, type: 1 })

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema)

export default Payment
