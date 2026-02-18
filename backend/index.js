import express from "express";
import cors from "cors";
import cookieParser  from "cookie-parser";
import { urlencoded } from "express";
import dotenv from "dotenv";
import connectDB from "./Utils/db.js";
import userRoute from "./Routes/user.route.js"
import postRoute from "./Routes/post.route.js"
import messageRoute from "./Routes/message.route.js"
import { app,server } from "./Socket/socket.js";
import path from "path";
dotenv.config({});


const PORT=3000;
const __dirname=path.resolve();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions={
    origin:'https://dilltalks.onrender.com',
    credentials:true
}
app.use(cors(corsOptions));
//yahan api ayenge
app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);
app.use(express.static(path.join(__dirname,"fronted/dist")))
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"fronted","dist","index.html"))
})
server.listen(PORT,()=>{
    connectDB();
    console.log(`Server listen to ${PORT}`)
})