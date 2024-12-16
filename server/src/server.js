const app = require("./app");
const process = require("node:process");
const dotenv = require("dotenv");
const connectDB = require("./config/db");




dotenv.config({
    path: `./.env`
});

connectDB();

app.listen(process.env.PORT, ()=>{
    console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
})