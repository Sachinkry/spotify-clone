"use client";

import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import PlayButton from "./PlayButton";
import { FaPlay } from "react-icons/fa";

interface LibraryProps {
  songs: Song[]
}

const Library: React.FC<LibraryProps> = ({
  songs
}) => {
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();

  const { user } = useUser();

  const onPlay = useOnPlay(songs);

  const onClick = () => {
    if(!user) {
      return authModal.onOpen();
    }
    //TODO: check for subscription
    return uploadModal.onOpen();
  };

  return (
    <div className="flex flex-col ">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist size={26} className="text-neutral-400" />
          <p className="text-neutral-400 font-medium text-md">
            Your Library
          </p>
        </div>
        <AiOutlinePlus 
          onClick={onClick} 
          size={20} 
          className="text-neutral-400 cursor-pointer hover:text-white transition" 
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3 ">
        {songs.map((item) => (
          <div className=" flex group relative overflow-hidden transition">
            <MediaItem
              onClick={(id: string) => onPlay(id)}
              key={item.id}
              data={item}
            />
            <div className="absolute transition opacity-0 rounded-full flex items-center cursor-pointer justify-center bg-green-500 p-3 drop-shadow-md bottom-3  right-5 group-hover:opacity-100 hover:scale-110" onClick={() => onPlay(item.id)}>
                <FaPlay size={12} className="text-black" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Library;