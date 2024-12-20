const express = require("express");
const process = require("node:process");
const security = require("./config/security");
const morgan = require("morgan");
const logger = require("./utils/logger");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_URL,
    credentials: true,
  })
);
security(app);
app.use(morgan("combined", { stream: logger.stream }));

// routes declarations
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const eventRoles = require("./routes/event.routes");
const organizerRoutes = require("./routes/organizer.routes");;

// routes implementation
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events",eventRoles);
app.use("/api/v1/organizers",organizerRoutes);

// http://localhost:8000/api/v1/users/register

//exporting app
module.exports = app;
