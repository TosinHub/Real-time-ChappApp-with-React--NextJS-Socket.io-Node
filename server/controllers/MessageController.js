/* eslint-disable no-unused-vars */

import getPrismaInstance from "../utils/PrismaClient.js"


export const addMessage = async (req, res) =>{

   try {
       const prisma = getPrismaInstance()
       const {message, from, to} = req.body
       // eslint-disable-next-line no-undef
       const getUser = onlineUsers.get(to);
       if(message && to && from) {
        const newMessage = await prisma.messages.create({
            data :  {
                message,
                sender: {connect:{ id: parseInt(from)} },
                receiver: {connect:{ id: parseInt(to)} },
                messageStatus:getUser? "delivered" : "sent"

            },
            include: {sender: true, receiver: true}
        })

  console.log(newMessage)
        return res.status(201).send({message: newMessage})
       }

       return res.status(400).send("From, to, message is required")
   } catch (error) { 
    console.log(error)
   } 

}