import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    hash: {
      type: String,
      required: true,
      unique: true,
    },
    blockNumber: Number,
    timestamp: {
      type: Date,
      index: true,
    },
    from: String,
    to: String,
    value: Number,
    gasUsed: Number,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    autoIndex: true,
  }
)

export default mongoose.model('Transaction', TransactionSchema)
