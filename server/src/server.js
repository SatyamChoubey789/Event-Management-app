const app = require("./app");
const process = require("node:process");
const dotenv = require("dotenv");
const ConnectDB = require("./config/db");


ConnectDB();

dotenv.config({
    path: `./.env`
});

ConnectDB();

app.listen(process.env.PORT, ()=>{
    console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
})