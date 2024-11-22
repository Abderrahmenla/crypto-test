import { param, validationResult } from 'express-validator'

export const validateTokenRequest = [
  param('contractAddress')
    .isEthereumAddress()
    .withMessage('Invalid token contract address'),
  param('walletAddress')
    .isEthereumAddress()
    .withMessage('Invalid wallet address'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
]
