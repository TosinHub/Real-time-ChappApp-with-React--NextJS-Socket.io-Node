/* eslint-disable no-unused-vars */
import { useStateProvider } from "@/context/StateContext";
import { ADD_IMAGE, SEND_MESSAGE } from "@/utils/ApiRoutes";
import React, { useEffect, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react"
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import axios from "axios";
import { reducerCases } from "@/context/constants";
import { useRef } from "react";
import PhotoPicker from "../common/PhotoPicker";

function MessageBar() {
  const [{ userInfo, currentChatUser,socket }, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef(null)
  const [grabPhoto, setGrabPhoto] = useState(false)

  const sendMessage = async () => {
    try {
  
      const  {data} = await axios.post(SEND_MESSAGE, {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message,
      })
      socket.current.emit("send-msg",{
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: data.message,
      })
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage:{
          ...data.message
        },
        fromSelf: true
      })
      setMessage("")
    } catch (error) { console.log(error) }
  };
  
    const handleEmojiModal = ()=>{
      setShowEmojiPicker(!showEmojiPicker)
    }

    const handleEmojiClick = (emoji) => {
      setMessage((prevMsg)=>(prevMsg+=emoji.emoji))
    }

    useEffect(()=>{
      const handleOutsideClick = (e)=>{
        if(e.target.id !== "emoji-open"){
          if(emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)){
            setShowEmojiPicker(false)
          }
        }
      }
      document.addEventListener("click", handleOutsideClick)

      return ()=>{
        document.removeEventListener("click", handleOutsideClick)
      }
    },[])


    const photoPickerChange = async (e) => {
        try {
              const file = e.target.files[0]
              const formData = new FormData()
              formData.append("image", file)
              const response = await axios.post(ADD_IMAGE, FormData, {
                headers:{
                  "Content-Type": "multipart/form-data"
                },
                params: {
                  from: userInfo?.id,
                  to: currentChatUser.io
                }
              } )

              if(response.status == 201){
                socket.current.emit("send-msg",{
                  to: currentChatUser?.id,
                  from: userInfo?.id,
                  message: response.data.message,
                })
                dispatch({
                  type: reducerCases.ADD_MESSAGE,
                  newMessage:{
                    ...response.data.message
                  },
                  fromSelf: true
                })
              }

        } catch (error) {
          console.log(error)
        }
    }

    useEffect(()=>{
      if(grabPhoto){
        const data = document.getElementById("photo-picker")
        data.click();
        document.body.onfocus = (e) => {
  
          setTimeout(()=>{
            setGrabPhoto(false)
          }, 1000)
        }
      }
    },[grabPhoto])
  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Emoji"
            id="emoji-open"
            onClick={handleEmojiModal}
          />

{
  showEmojiPicker && <div className="absolute bottom-24 left-15 z-40" ref={emojiPickerRef}>
    <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark"/>
  </div>
}


          <ImAttachment
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Attach File"
            onClick={()=>setGrabPhoto(true)}
          />
        </div>

        <div className="w-full rounded-lg h-10 flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </div>

        <div className="flex w-10 items-center justify-center">
          <button>
            <MdSend
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Send message"
              onClick={sendMessage}
            />
            {/* <FaMicrophone
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Record"
            />  */}
           
          </button>
        </div>
      </>
      {
        grabPhoto && <PhotoPicker onChange={photoPickerChange}  />
      }
    </div>
  );
}

export default MessageBar;
