import { Song } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";
import useSubscribeModal from "./useSubscribeModal";
import toast from "react-hot-toast";


const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const subscribeModal = useSubscribeModal();
  const authModal = useAuthModal();
  const { user, subscription } = useUser();

  const checkSubscriptionStatus = () => {
    if (!user?.created_at) return 0;

    const accountCreationDate = new Date(user.created_at); // Fixed - No parentheses
    const currentDate = new Date();

    // Calculate the difference in days
    const timeDiff = Math.abs(currentDate.getTime() - accountCreationDate.getTime());
    const daysSinceCreation = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    return daysSinceCreation;
  };


  const onPlay = (id: string) => {

    if (!user) {
      return authModal.onOpen();
    }

    const daysSinceCreation = checkSubscriptionStatus();

    if (!subscription) {
      if (daysSinceCreation >= 7) {
        toast('Your free period has ended. Please subscribe to continue.', {
          icon: '⚠️',
        });
    
        return subscribeModal.onOpen();
      } else {
        toast('You have free access for 7 days. Subscribe to play songs non-stop!', { icon: '⏳' });
      }
    }

    player.setId(id);
    player.setIds(songs.map((song) => song.id))
  }

  return onPlay;
}

export default useOnPlay;