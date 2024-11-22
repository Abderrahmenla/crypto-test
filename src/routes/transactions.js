import express from 'express'
import Transaction from '../models/Transaction.js'
import { getTransactions } from '../services/etherscanService.js'
import logger from '../utils/logger.js'
import { validateTransactionRequest } from '../validators/transactionValidator.js'

const router = express.Router()

router.get('/:address', validateTransactionRequest, async (req, res) => {
  try {
    const { address } = req.params
    const { startDate, endDate } = req.query

    let query = { address }
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    let transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .limit(5)
    if (transactions.length === 0) {
      const newTransactions = await getTransactions(address)

      if (newTransactions.length > 0) {
        transactions = await Transaction.insertMany(
          newTransactions.map((tx) => ({
            address,
            hash: tx.hash,
            blockNumber: tx.blockNumber,
            timestamp: new Date(tx.timeStamp * 1000),
            from: tx.from,
            to: tx.to,
            value: tx.value,
            gasUsed: tx.gasUsed,
          }))
        )
      } else {
        logger.warn(`No new transactions found for address: ${address}`)
      }
    }

    res.json(transactions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve transactions' })
  }
})

export default router
