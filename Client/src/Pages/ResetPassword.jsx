import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [newPassword,setNewPassword] = useState('')
  const [isEmailSent,setIsEmailSent] = useState('');
  const [otp,setOtp] = useState(0);
  const [isOtpSubmitted,setIsOtpSubmitted] = useState(false)

  const inputRefs = useRef([]);
  const { backendUrl } = useContext(AppContext);
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
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };
  const onSubmitEmail = async(e)=>{
    e.preventDefault()
    try {
      const {data} = await axios.post(`${backendUrl}/api/auth/send-rest-otp`,{email},{withCredentials: true})
      if(data.success){
        toast.success(data.message)
        setIsEmailSent(true)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    
  }
  const onSubmitOtp = async(e)=>{
    e.preventDefault()
    const otpArray = inputRefs.current.map(e=> e.value);
    setOtp(otpArray.join(''))
    
    try {
      const {data} = await axios.post(`${backendUrl}/api/auth/verify-reset-otp`,{email,otp},{withCredentials: true})
      if(data.success){
        setIsOtpSubmitted(true)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
    
  }

  const onSubmitNewPassword = async(e)=>{
    e.preventDefault()
    try {
      const {data } = await axios.post(`${backendUrl}/api/auth/reset-password`,{email,otp,newPassword},{withCredentials:true})
      if(data.success){
        toast.success(data.message)
        navigate('/login')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }
  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="w-28 sm:w-32 cursor-pointer absolute left-4 top-4 sm:top-6 sm:left-24"
      />
      {/* Email Form  */}
      {!isEmailSent && 
      <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset Email
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter your registered email address.
        </p>
        <div className="flex mb-6 gap-3 items-center py-2.5  px-6 bg-[#333A5C] rounded-full ">
          <img src={assets.mail_icon} alt="" className="" />
          <input
            className="outline-none w-full text-white"
            type="Email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-800  text-white rounded-full ">
          Submit
        </button>
      </form>
}
      {/* OTP Form */}
      {!isOtpSubmitted && isEmailSent &&
      <form onSubmit={onSubmitOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset Password OTP
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
        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-800  text-white rounded-full ">
          Submit
        </button>
      </form>
}
      {/* Enter New Password */}
      {isOtpSubmitted && isEmailSent &&
      <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          New Password
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter new password below
        </p>
        <div className="flex mb-6 gap-3 items-center py-2.5 px-6 bg-[#333A5C] rounded-full ">
          <img src={assets.lock_icon} alt="" className="" />
          <input
            className="outline-none w-full text-white"
            type="password"
            placeholder="Password"
            name="password"
            minLength={4}
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
            required
          />
        </div>
        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-800  text-white rounded-full ">
          Submit
        </button>
      </form>
      }
    </div>
  );
}
