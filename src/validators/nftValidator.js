import { param, validationResult } from 'express-validator'

export const validateNFTRequest = [
  param('contractAddress')
    .isEthereumAddress()
    .withMessage('Invalid Ethereum contract address'),
  param('tokenId').isString().notEmpty().withMessage('Token ID is required'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
]
