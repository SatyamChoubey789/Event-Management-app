const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const process = require("node:process");
const cors = require("cors");

module.exports = (app) => {
  app.use(helmet());
  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests
    })
  );
}
