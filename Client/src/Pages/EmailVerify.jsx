import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router";
import axios from 'axios'
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
export default function EmailVerify() {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const {backendUrl,user} = useContext(AppContext)
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e)=>{
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char,index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    });
  };
  const onSubmitHandler = async(e)=>{
    e.preventDefault()
    try {
      const otpArray = inputRefs.current.map(e=> e.value);
      const otp = otpArray.join('')
      const {data} = await axios.post(`${backendUrl}/api/auth/verify-account`,{otp},{withCredentials:true})
      if(data.success){
        toast.success(data.message)
        navigate('/')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  useEffect(()=>{
    user && user.isVerified && navigate('/')
  },[user,navigate])
  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="w-28 sm:w-32 cursor-pointer absolute left-4 top-4 sm:top-6 sm:left-24"
      />
      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter 6 digit code sent to your email.
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill("")
            .map((_, index) => (
              <input
                type="text"
                key={index}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                required
                className="w-12 h-12 text-white text-center bg-[#333a5c] rounded-md"
              />
            ))}
        </div>
        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-800  text-white rounded-full ">Verify Email</button>
      </form>
    </div>
  );
}
