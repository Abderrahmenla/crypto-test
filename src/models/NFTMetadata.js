import mongoose from 'mongoose'

const NFTMetadataSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  tokenId: {
    type: String,
    required: true,
    index: true,
  },
  name: String,
  description: String,
  imageUrl: String,
  attributes: [
    {
      trait_type: String,
      value: mongoose.Schema.Types.Mixed,
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

NFTMetadataSchema.index({ contractAddress: 1, tokenId: 1 }, { unique: true })

export default mongoose.model('NFTMetadata', NFTMetadataSchema)
