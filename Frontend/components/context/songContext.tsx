"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
type SongContextType = {
  song: {
    title: string;
    artist: string;
    youtube_url: string;
  }[];
  setSong: (
    song: {
      title: string;
      artist: string;
      youtube_url: string;
    }[]
  ) => void;
};

export const SongContext = createContext<SongContextType>({
  setSong: () => {},
  song: [
    {
      title: "",
      artist: "",
      youtube_url: "",
    },
  ],
});
import { UserContext } from "./authContext";
import instance from "@/config/axiosConfig";
export const SongContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data } = useContext(UserContext);
  const [song, setSong] = useState<SongContextType["song"]>([]);
  const [ispreload, setIsPreload] = useState<boolean>(true);
  let getPreload = async () => {
    // const response = await axios.get("http://localhost:5000/api/preloadMusic");
    if (!data) return;
    const response = await instance.post("preloadMusic", {
      favoriteArtists: data?.favoriteArtists || ["Calm music"],
      languages: data?.languages || ["English"],
    });
    setSong(response.data);
    setIsPreload(false);
  };
  useEffect(() => {
    getPreload();
  }, [ispreload, data]);

  return (
    <SongContext.Provider value={{ song, setSong }}>
      {children}
    </SongContext.Provider>
  );
};
