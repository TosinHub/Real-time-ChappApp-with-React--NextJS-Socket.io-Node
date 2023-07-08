/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import getPrismaInstance from "../utils/PrismaClient.js";
    const prisma = getPrismaInstance();


export const addMessage = async (req, res) => {
  try {

    const { message, from, to } = req.body;

    if (!message || !from || !to) {
      return res.status(400).json({ error: "From, to, and message are required fields." });
    }

    // Assuming onlineUsers is defined elsewhere
    // eslint-disable-next-line no-undef
    const getUser = onlineUsers.get(to);
    const messageStatus = getUser ? "delivered" : "sent";

    const newMessage = await prisma.messages.create({
      data: {
        message,
        sender: { connect: { id: parseInt(from) } },
        reciever: { connect: { id: parseInt(to) } },
        messageStatus,
      },
      include: { sender: true, reciever: true },
    });



    return res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) =>{
  try {
     const { to, from } = req.params
     const messages = await prisma.messages.findMany({
        where:{
          OR: [
            {
              senderId: parseInt(from),
              recieverId:parseInt(to)
            },
            {
              senderId: parseInt(to),
              recieverId:parseInt(from)
            }
          ]
        },
        orderBy : {
          id: "asc"
        }
     })

     const unreadMessages = []

     messages.forEach((message, index ) => {
        if(message.messageStatus !== "read" && message.senderId === parseInt(to)){
         messages[index].messageStatus = "read";
          unreadMessages.push(message.id)
     
        }
     });

  
  
       const up = await prisma.messages.updateMany({
      where : {
        id: {in:unreadMessages}
      },
      data: {
        messageStatus: "read"
      }
     })

     res.status(200).json({messages})

  } catch (error) {

    console.log(error.message)
    return res.status(500).json({ error: "Internal server error" });
  }
}
