import { HashtagIcon } from "@heroicons/react/solid";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectChannelId, setChannelInfo } from "../features/ChannelSlice";
import { selectServerId } from "../features/ServerSlice";
import { db } from "../firebase";

function ChannelDetails({ id, channelName }) {
  const disPatch = useDispatch();
  const navigate = useNavigate();
  const serverId = useSelector(selectServerId);
  const channelId = useSelector(selectChannelId)
  

  const setChannel = () => {
    disPatch(setChannelInfo({ channelId: id, channelName: channelName }));
    navigate(`/channels/${serverId}/${id}`);
  };

  return (
    <div
      className={`flex justify-start  hover:text-white p-2  ${id=== channelId && 'text-white'}   space-x-1   cursor-pointer`}
      onClick={() => setChannel()}
    >
      <HashtagIcon className="h-6  " />{" "}
      <h4 className={`lowercase truncate ... text-sm  font-black`}>
        {channelName}
      </h4>
    </div>
  );
}

export default ChannelDetails;
