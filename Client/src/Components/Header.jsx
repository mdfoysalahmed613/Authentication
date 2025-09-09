import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContext";

export default function Header() {
  const {user,loading} = useContext(AppContext)
  
  
  return (
    <div className="flex gap-4 mt-20 flex-col items-center">
      <img src={assets.header_img} alt="" className="w-36 h-36 rounded-full " />

      <h1 className="flex items-center gap-2 text-xl sm:text-3xl  mb-2">
        Hey {loading ? <p>Loading..</p>: (user ? user.name : "developer")}
        <img src={assets.hand_wave} alt="" className="w-8 aspect-square" />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-semibold">Welcome to Our App</h2>

      <p className="mb-4 max-w-md text-center">Lets start a quick product tour and we will have you up and running on no time</p>
      <button className="border border-gray-500 px-8 py-2.5 rounded-full hover:bg-gray-100 transition-all ">Get Started</button>
    </div>
  );
}
