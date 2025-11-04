'use client'
import {createContext, useState, ReactNode } from "react"

import axios from "axios"
interface JournalEntry {
  id: string
  content: string
  emotion: string
  aiReview: string
  timestamp: number
  
}

interface JournalContextType{
    entries: JournalEntry[]
    setEntries: (entries: JournalEntry[]) => void
    getEntries: () => void
}


export const JournalEntryContext = createContext<JournalContextType>({
    entries:[],
    setEntries: () => {},
    getEntries: () => {}
})

export const JournalContextProvider =({children}:{children:ReactNode})=>{
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const getEntries = async () => {
      const response = await axios.get('http://localhost:5000/api/journal/getAll');
      console.log("hio")
    setEntries(response.data);
    }
    return (
        <JournalEntryContext.Provider value={{entries, setEntries, getEntries}}>
            {children}
        </JournalEntryContext.Provider>
    )
}