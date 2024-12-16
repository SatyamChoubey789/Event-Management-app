const express = require("express");
const security = require("./config/security");
const logger = require("./utils/logger");

const app = express();


// Middleware
app.use(express.json());
security(app);
app.use(require("morgan")("combined", { stream: logger.stream }));




// routes declarations



// routes implementation



// http://localhost:8000/api/v1/users/register



//exporting app
module.exports = app;