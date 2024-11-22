import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import nftRoutes from './routes/nft.js'
import transactionRoutes from './routes/transactions.js'
import tokenRoutes from './routes/tokens.js'
import logger from './utils/logger.js' // Import the logger

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/nft', nftRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/tokens', tokenRoutes)

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/blockchain-api'
  )
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((err) => {
    logger.error(`MongoDB connection error: ${err.message}`)
  })

// Start Server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message}`)
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal Server Error' })
})
