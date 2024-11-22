import express from 'express'
import { getTokenBalance } from '../services/tokenService.js'
import { validateTokenRequest } from '../validators/tokenValidator.js'
const router = express.Router()

router.get(
  '/:contractAddress/:walletAddress',
  validateTokenRequest,
  async (req, res) => {
    try {
      const { contractAddress, walletAddress } = req.params
      const balance = await getTokenBalance(contractAddress, walletAddress)
      res.json({ balance })
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve token balance' })
    }
  }
)

export default router
