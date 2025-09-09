import axios from "axios";
import { createContext, useEffect, useState } from "react";


const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState(null)
  const fetchUser = async()=>{
    try {
      setLoading(true)
      const result = await axios.get(`${backendUrl}/api/auth/me`,{withCredentials:true});
      if(result.data.success){
        setUser(result.data.data)
      }else{
        setUser(null)
      }
    } catch (error) {
      setError(error)
      setUser(null)
    }finally{
      setLoading(false)
    }
  };
  useEffect(()=>{
    fetchUser()
  },[]);

  const value = {
    backendUrl,
    user,
    loading,
    setUser
  };
  return <AppContext value={value}>{children}</AppContext>;
};

export {AppContextProvider,AppContext};
