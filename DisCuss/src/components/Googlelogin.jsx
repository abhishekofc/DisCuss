import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import Cookies from "js-cookie"
import {FcGoogle} from "react-icons/fc"
import { auth, provider } from '../helper/firebase'
import { showToast } from '../helper/showToast'
import {  useNavigate } from 'react-router-dom'
import {useDispatch} from "react-redux"
import { setuser } from '../redux/user/user.slice'

const Googlelogin = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate()
    const handlelogin=async()=>{
        const googleResponse =await signInWithPopup(auth,provider)
        const user=googleResponse.user
        const bodydata={
            name:user.displayName,
            email:user.email,
            avatar:user.photoURL
        }
        try{
            const response=await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/googlelogin`,{
                method:"post",
                headers:{"Content-type":"application/json"},
                credentials:"include",
                body:JSON.stringify(bodydata)
            })
            const data=await response.json()
            if(!response.ok)
            {
                showToast("error",data.message)
                return
            }
            dispatch(setuser(data.user))
            sessionStorage.setItem("token",data.token);
            navigate("/")
            showToast("success",data.message)
        }
        catch(error){
            showToast("error",error.message)
        }
    }
  return (
    <button   className='flex items-center h-10 justify-center gap-3 w-full border-1.5 border-gray-300 text-black py-2 rounded-md  font-bold
    bg-gray-100 mb-4 transition shadow-md'
    onClick={handlelogin} >
        <FcGoogle size={24}/>
        Continue With Google
    </button>
  )
}

export default Googlelogin