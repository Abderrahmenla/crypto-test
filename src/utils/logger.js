import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(), // Add colors for log levels
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`
    })
  ),
  transports: [
    new winston.transports.Console(), // Logs to console in human-readable format
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs errors to file
    new winston.transports.File({ filename: 'logs/combined.log' }), // Logs all levels to file
  ],
})

export default logger
