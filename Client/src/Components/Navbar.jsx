import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import {toast} from 'react-toastify'
export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser, loading, backendUrl } = useContext(AppContext);
  const logout = async()=>{
    try {
      const {data} = await axios.post(`${backendUrl}/api/auth/logout`,{},{withCredentials: true})
    if(data.success){
      toast.success(data.message)
      setUser(null)
      navigate('/')
    }else{
      toast.error(data.message || 'Logout Failed')
    }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  };
  const sendVerifyOtp = async()=>{
    try {
      const {data} = await axios.post(backendUrl+'/api/auth/send-verify-otp',{},{withCredentials: true})
      if(data.success){
        navigate('/email-verify');
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }
  return (
    <div
      
      className="flex justify-between p-4 sm:p-6 sm:px-24 "
    >
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />
      {loading ? (
        <p>Loading</p>
      ) : user ? (
        <div className="rounded-full w-8 h-8 flex justify-center items-center bg-black text-white relative group">
          {user.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 pt-10 text-black">
            <ul className="p-2 list-none bg-gray-100">
              {!user.isVerified && <li onClick={sendVerifyOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify Email</li> }
              
              <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-18">Logout</li>
            </ul>
          </div>
        </div>
      ) : (
        <button onClick={() => navigate("/register")} className="rounded-full flex gap-2 items-center px-6 py-2 border border-gray-500 hover:bg-gray-100 transition-all hover:scale-110">
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
}
