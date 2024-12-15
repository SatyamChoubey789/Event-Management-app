const app = require("./app");
const process = require("node:process");
const dotenv = require("dotenv");

ConnectDB();

dotenv.config({
    path: `./.env`
});

app.listen(process.env.PORT, ()=>{
    console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
})