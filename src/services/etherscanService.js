import axios from 'axios'
import dotenv from 'dotenv'
import { isAddress } from 'web3-validator'
import logger from '../utils/logger.js'

dotenv.config()

const ETHERSCAN_API_URL = 'https://api.etherscan.io/api'
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

export async function getTransactions(address) {
  try {
    if (!isAddress(address)) {
      throw new Error('Invalid Ethereum address')
    }
    const response = await axios.get(ETHERSCAN_API_URL, {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 5,
        sort: 'desc',
        apikey: ETHERSCAN_API_KEY,
      },
    })

    if (response.data.status !== '1') {
      if (response.data.message === 'No transactions found') {
        logger.warn('No transactions found for the provided address')
        return []
      }
      throw new Error(response.data.message)
    }

    return response.data.result
  } catch (error) {
    logger.error('Etherscan API error:', error)
    throw error
  }
}
