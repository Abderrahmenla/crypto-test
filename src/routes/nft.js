import express from 'express'
import { validateNFTRequest } from '../validators/nftValidator.js'
import { fetchAndUpdateMetadata } from '../services/nftMetadataService.js'
import logger from '../utils/logger.js'
const router = express.Router()

router.get(
  '/:contractAddress/:tokenId',
  validateNFTRequest,
  async (req, res) => {
    try {
      const { contractAddress, tokenId } = req.params

      const metadata = await fetchAndUpdateMetadata(contractAddress, tokenId)

      res.json(metadata)
    } catch (error) {
      logger.error('Error in NFT metadata route:', error)
      res.status(500).json({ error: 'Failed to retrieve NFT metadata' })
    }
  }
)

export default router
