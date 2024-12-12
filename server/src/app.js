const express = require("express");

const app = express();


// Middleware to parse JSON requests
app.use(express.json());




// routes declarations



// routes implementation



// http://localhost:8000/api/v1/users/register



//exporting app
module.exports = app;