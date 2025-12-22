"use client";

import { createContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  username: string;
  favoriteArtists: string[];
  languages: string[];
}
interface UserContextType {
  data: User | null;
  setUser: (data: User) => void;
  getUser: () => void;
  isloggedIn: boolean;
  favoriteArtists?: string[];
  languages?: string[];
  setIsloggedIn: (isloggedIn: boolean) => void;
}

export const UserContext = createContext<UserContextType>({
  data: null,
  setUser: () => {},
  getUser: () => {},
  favoriteArtists: [],
  languages: [],
  isloggedIn: false,
  setIsloggedIn: () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isloggedIn, setIsloggedIn] = useState(false);
  const [data, setData] = useState<User | null>(null);
  const setUser = (user: User) => {
    setData(user);
  };

  useEffect(() => {
    let userData = localStorage.getItem("userData");
    if (userData) {
      setData(JSON.parse(userData));
      setIsloggedIn(true);
    } else {
      setData(null);
      setIsloggedIn(false);
    }
  }, [isloggedIn]);
  const getUser = () => {};
  return (
    <UserContext.Provider
      value={{ data, setUser, getUser, isloggedIn, setIsloggedIn }}
    >
      {children}
    </UserContext.Provider>
  );
};
