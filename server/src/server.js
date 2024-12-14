const app = require("./app");
const process = require("node:process");
const dotenv = require("dotenv");

dotenv.config({
    path: `./.env`
});

app.listen(process.env.PORT, ()=>{
    console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
})