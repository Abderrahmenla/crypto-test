import { param, validationResult } from 'express-validator'

export const validateTransactionRequest = [
  param('address').isEthereumAddress().withMessage('Invalid address'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
]
