import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
export default function Register() {
  const navigate = useNavigate();
  const { setUser, backendUrl } = useContext(AppContext);
  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const userData = {
      name,
      email,
      password,
    };
    try {
      const {data} = await axios.post(`${backendUrl}/api/auth/register`,userData,{withCredentials: true})
      if(data.success){
        setUser(data.data)
        toast.success(data?.message)
        navigate('/')
        
      }else{
        toast.error(data?.message || 'Registration Failed')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }

  }
  return (
    <div className="flex justify-center min-h-screen items-center bg-linear-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="w-28 sm:w-32 cursor-pointer absolute left-4 top-4 sm:top-6 sm:left-24"
      />
      <div className="bg-slate-900 p-10 sm:p-8 rounded-xl shadow-2xl w-full text-indigo-300 text-md sm:w-96 ">
        <h1 className=" text-white font-semibold text-3xl sm:text-3xl mb-3 text-center mt-2 sm:mt-4">
          Create Account
        </h1>
        <p className="text-white text-center mb-6">Create your account</p>

        <form onSubmit={handleRegister}>
          <div className="flex mb-3 gap-3 items-center py-2.5 px-6 bg-[#333A5C] rounded-full ">
            <img src={assets.person_icon} alt="" className="" />
            <input
              className="outline-none w-full"
              type="text"
              placeholder="Full Name"
              name="name"
              required
            />
          </div>
          <div className="flex mb-3 gap-3 items-center py-2.5 px-6 bg-[#333A5C] rounded-full ">
            <img src={assets.mail_icon} alt="" className="" />
            <input
              className="outline-none w-full"
              type="Email"
              placeholder="Email Address"
              name="email"
              required
            />
          </div>
          <div className="flex mb-3 gap-3 items-center py-2.5 px-6 bg-[#333A5C] rounded-full ">
            <img src={assets.lock_icon} alt="" className="" />
            <input
              className="outline-none w-full"
              type="password"
              placeholder="Password"
              name="password"
              minLength={4}
              required
            />
          </div>
          <p
            onClick={() => navigate("/reset-password")}
            className="mb-3 text-indigo-500 cursor-pointer"
          >
            Forgot Password?
          </p>
          <button className="font-medium text-white w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-800">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400 text-xs">
          Already Have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
