import {Router} from "express"
import { addMessage } from "../controllers/MessageController.js"



const router = Router()

router.post("/send-message", addMessage)


export default router