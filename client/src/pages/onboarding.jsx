import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import { useStateProvider } from "@/context/StateContext";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { reducerCases } from "@/context/constants";

function onboarding() {
  const [{ userInfo, newUser }, dispatch] = useStateProvider();
  const router = useRouter()

  const [name, setName] = useState(userInfo?.name || "")
  const [about, setAbout] = useState("")
  const [image, setImage] = useState("/default_avatar.png")

  useEffect(()=>{
    console.log(userInfo,newUser)
    if(!newUser && !userInfo?.email) router.push("/login")
    else if(!newUser && userInfo?.email) router.push("/")

  }, [newUser,userInfo,router])

  const onboardUserHandler = async ()=> {
            if(validateDetails()){
              const email = userInfo.email

              try {
                const {data : {status,id}} = await axios.post(ONBOARD_USER_ROUTE, {
                    email,name,about,image
                }) 
               
                if(status){
                  dispatch({
                    type: reducerCases.SET_NEW_USER, newUser: false
                  })
                  dispatch({
                    type: reducerCases.SET_USER_INFO,
                    userInfo: {
                      id,
                      name,
                      email,
                      profileImage: image,
                      status: about
                    }
                  })

               
                  router.push("/")
                }
              } catch (error) {
                console.log(error.message)
              }
            }
  }

  const validateDetails = () =>{
    if(name.length < 3) return false
    return true
  }

  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col text-white">
      <div className="flex items-center justify-center gap-2">
        <Image src="/whatsapp.gif" alt="WhatsApp" height={300} width={300} />

        <span className="text-7xl">WhatsApp</span>
      </div>
      <h2 className="text-2xl">Create your profile</h2>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input  name="Display name" state={name} setState={setName}  label/>
          <Input  name="About" state={about} setState={setAbout}  label/>

          <div className="flex items-center justify-center">
          <button className="flex items-center justify-center bg-search-input-container-background p-5 rounded-lg" onClick={onboardUserHandler}>Create Profile</button>
          </div>
        </div>

        <div>
        <Avatar  type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
}

export default onboarding;
