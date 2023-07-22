import {Router} from "express"
import { addMessage, getMessages, addImageMessage } from "../controllers/MessageController.js"
import multer from "multer"



const router = Router()

const uploadImage = multer({dest: "/uploads/images"})

router.post("/send-message", addMessage)
router.get("/get-messages/:from/:to", getMessages)
router.get("/add-image-message", uploadImage.single("image"), addImageMessage)


export default router