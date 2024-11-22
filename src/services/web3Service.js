import Web3 from 'web3'
import dotenv from 'dotenv'
import logger from '../utils/logger.js'
dotenv.config()

const INFURA_URL =
  process.env.INFURA_URL ||
  'https://mainnet.infura.io/v3/cd905501fc884109b7e08172924c4d12'
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL))

const ERC721_METADATA_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
]

export async function getNFTMetadata(contractAddress, tokenId) {
  try {
    const contract = new web3.eth.Contract(ERC721_METADATA_ABI, contractAddress)
    const tokenURI = await contract.methods.tokenURI(tokenId).call()

    const metadataUrl = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')

    const response = await fetch(metadataUrl)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch metadata from URL: ${metadataUrl}, status: ${response.status}`
      )
    }
    const metadata = await response.json()
    const name = metadata.name || 'Unnamed Token'
    const imageUrl = metadata.image
      ? metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
      : null

    return {
      name,
      description: metadata.description || 'No description available',
      imageUrl,
      attributes: metadata.attributes || [],
    }
  } catch (error) {
    logger.error('Error fetching NFT metadata:', error)
    throw error
  }
}
