/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import audit from 'express-requests-logger'
import AuthRoutes from "./routes/AuthRoutes.js"
import MessageRoutes from "./routes/MessageRoutes.js"
import { Server } from "socket.io"



dotenv.config();


const app =  express()
app.use(cors())
//app.use(audit())
app.use(express.json())
app.use("/uploads/images", express.static("uploads/images"))
app.use("/api/auth", AuthRoutes)
app.use("/api/messages", MessageRoutes)

// eslint-disable-next-line no-unused-vars
const server = app.listen(process.env.PORT, ()=>{
 
    console.log(`Server started on port ${process.env.PORT}`)

})

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

global.onlineUsers = new Map()

io.on("connection", (socket) =>{
    global.chatSocket = socket
    socket.on("add-user", (userId)=>{
      console.log(userId)
        onlineUsers.set(userId,socket.id)
        console.log(onlineUsers)
    })
    socket.on("send-msg", async (data) =>{
  

   
        const sendUserSocket = onlineUsers.get(data.to);
   
        if(sendUserSocket){
            console.log("connecting")
            socket.to(sendUserSocket).emit("msg-receive", {
                from: data.from,
                message: data.message
            })

      
        }
    })
})
