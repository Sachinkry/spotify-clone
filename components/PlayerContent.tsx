"use client";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import { Progress } from "@/components/ui/progress"

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  song, 
  songUrl
}) => {
  const player  = usePlayer();
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying]= useState(false);
  const [duration, setDuration] = useState(0); 
  const [progress, setProgress] = useState(0); 

  const Icon = isPlaying ? BsPauseFill: BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark: HiSpeakerWave;

  const onPlayNext = () => {
    if(player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  }

  const onPlayPrevious = () => {
    if(player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  }

  const [play, { pause, sound }] = useSound(
    songUrl,
    {
      volume: volume,
      onplay: () => setIsPlaying(true),
      onend: () => {
        setIsPlaying(false);
        onPlayNext();
      },
      onpause: () => setIsPlaying(false),
      format: ['mp3'],
      onload: () => {
        if (sound) {
          setDuration(sound.duration() / 1000);  
        }
      }
    }
  );

  // Update the progress as the song plays
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (sound && isPlaying) {
  //       setProgress((sound.seek() / duration) * 100);  // Update progress percentage
  //       console.log("song prgress...................",(sound.seek() / duration) * 100);
  //       if(duration) console.log("song duration...................",duration);
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [sound, duration]);

  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    }
  }, [sound])

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  }

  // Format seconds to mm:ss
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full ">
      <div className="flex w-full justify-start items-center">
        <div className="flex flex-row items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>
      {/* <div className="flex  md:hidden col-auto w-full justify-center items-center">
        <div 
          onClick={handlePlay}
          className="h-10 w-10  flex items-center justify-center rounded-full bg-white p-1 cursor-pointer">
            <Icon size={30} className="text-black" />
          </div>
      </div> */}

      {/* <div className=" h-full md:flex md:flex-col  w-full max-w-[722px] gap-x-6 "> */}
        <div className=" flex h-full flex-row w-full gap-x-6 justify-center items-center mb-6 ">
          <AiFillStepBackward 
            size={24}
            onClick={onPlayPrevious}
            className="text-neutral-400 cursor-pointer hover:text-white transition" 
          />
          <div 
            onClick={handlePlay}
            className="flex items-center h-8 w-8 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={24} className="text-black" />
          </div>
          <AiFillStepForward 
            onClick={onPlayNext}
            size={24}
            className="text-neutral-400 cursor-pointer hover:text-white transition "
          />
        </div>
        {/* progress bar */}
        {/* <div className="flex flex-row  w-full items-center justify-center mt-3 mb-2 gap-x-2">
          <div className="text-xs font-thin text-neutral-600">{formatTime(progress)}</div>
          <Progress value={progress/duration * 100} className="w-full h-[3px] bg-neutral-500 rounded-lg" />
          <div className="text-xs font-thin text-neutral-600">{formatTime(duration)}</div>
        </div> */}
      {/* </div> */}
      

      <div className="hidden md:flex w-full justify-end pr-2 ">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon 
            size={30} 
            className="cursor-pointer"
            onClick={toggleMute} 
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  )
}

export default PlayerContent;