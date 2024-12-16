const winston = require("winston");
const process = require("node:process");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Log to console if not in production
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Define a stream for Morgan
logger.stream = {
  write: (message) => {
    // Use Winston's info level for HTTP logs
    logger.info(message.trim());
  },
};

module.exports = logger;
