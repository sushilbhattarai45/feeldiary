'use client'

import {createContext, useState, ReactNode} from 'react'



interface User{
    userId:string
    name:string,
    email:string,
}
interface UserContextType{
    data: User[]
    setUser : (data:User)=>void
    getUser :()=>void
}

export const UserContext = createContext<UserContextType>({
    data:[],
    setUser:()=>{},
    getUser: () => {}
})


export const AuthContextProvider=({children}:{children:ReactNode})=>
{

    const [data, setData] = useState<User[]>([])
    const setUser=(user:User)=>{
        setData([...data,user])
    }
    const getUser=()=>{
        //fetch user from backend
    }
    return(
        <UserContext.Provider value={{data,setUser,getUser}}>
            {children}
        </UserContext.Provider>
    )

}
