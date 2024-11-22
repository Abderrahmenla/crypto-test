import NFTMetadata from '../models/NFTMetadata.js'
import { getNFTMetadata } from './web3Service.js'
import logger from '../utils/logger.js'

export const fetchAndUpdateMetadata = async (contractAddress, tokenId) => {
  try {
    logger.info(`Fetching metadata for ${contractAddress}, tokenId: ${tokenId}`)
    const oneDayAgo = new Date(Date.now() - 86400000)

    let metadata = await NFTMetadata.findOne({ contractAddress, tokenId })
    if (!metadata || metadata.updatedAt < oneDayAgo) {
      const fetchedMetadata = await getNFTMetadata(contractAddress, tokenId)

      metadata = await NFTMetadata.findOneAndUpdate(
        { contractAddress, tokenId },
        {
          ...fetchedMetadata,
          updatedAt: new Date(),
        },
        {
          upsert: true,
          new: true,
          returnDocument: 'after',
          lean: true,
        }
      )
    }

    return metadata
  } catch (error) {
    logger.error(`Error fetching metadata: ${error.message}`)
    throw error
  }
}
