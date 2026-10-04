import React,{createContext,useContext,useEffect,useState} from "react";import {authApi} from "../api/client";
const AuthContext=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(null),[loading,setLoading]=useState(true);useEffect(()=>{authApi.me().then(setUser).catch(()=>setUser(null)).finally(()=>setLoading(false))},[]);const login=async(email,password)=>{await authApi.login(email,password);setUser(await authApi.me())};const logout=async()=>{await authApi.logout();setUser(null)};return <AuthContext.Provider value={{user,loading,login,logout}}>{children}</AuthContext.Provider>}
export const useAuth=()=>useContext(AuthContext);
