import Web3 from 'web3'
import dotenv from 'dotenv'
import logger from '../utils/logger.js'
dotenv.config()

const web3 = new Web3(process.env.INFURA_URL)

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
]

export async function getTokenBalance(contractAddress, walletAddress) {
  try {
    const contract = new web3.eth.Contract(ERC20_ABI, contractAddress)

    const rawBalance = BigInt(
      await contract.methods.balanceOf(walletAddress).call()
    )

    const decimals = BigInt(await contract.methods.decimals().call())

    const readableBalance = rawBalance / BigInt(10) ** decimals

    return readableBalance.toString()
  } catch (error) {
    logger.error('Token balance error:', error.message)
    throw error
  }
}
