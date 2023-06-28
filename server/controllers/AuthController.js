import getPrismaInstance from "../utils/PrismaClient.js"
const prisma = getPrismaInstance()

export const checkUser = async(req, res, next) =>{
    try {
        const {email} = req.body
        if(!email){
            return res.json({msg: "Email is required", status: false})
        } 

 

        const user = await prisma.user.findUnique({
            where : {email}
        })

        if(!user){
            return res.json({msg: "user not found", status: false})
        }else{
            return res.json({msg: "user found", status: true, data: user})
        }

       } catch (error) {
        
    }

}

export const onBoardUser = async(req, res, next) =>{
    try {
        const {email, name, about, image:profilePicture} = req.body
        if(!email || !name || !profilePicture ) {
            res.send("Email,name and Image are required")
        }

        const user = await prisma.user.create({
            data: {email, name, about, profilePicture}
        })

        return res.json({msg: "Success", status: true, data: user})

      } catch (error) {
        
    }
}