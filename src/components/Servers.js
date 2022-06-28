import { collection, doc, getDoc, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setChannelInfo } from "../features/ChannelSlice";
import { selectServerId, setServerInfo } from "../features/ServerSlice";
import { db } from "../firebase";

function Server({ id, serverPhoto, serverName }) {
  const sName = serverName && serverName.substring(0, 1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
const serverId = useSelector(selectServerId)

console.log(serverId)
  // get a server's channels
  const [channels] = useCollection(
    query(
      collection(db, `servers/${id}`, "channels"),
      orderBy("timeStamp", "asc")
    )
  );

  // console.log(channels?.docs.map(e => e.id));

  const handleServerClick = () => {
    dispatch(
      setServerInfo({
        serverName: serverName,
        serverId: id,
      })
    );

    // get the last channel for a server & dispatch it to the current channel
    const lastChannel = channels?.docs.length - 1;
    const lastChannelID = channels?.docs[lastChannel].id;
    dispatch(
      setChannelInfo({
        channelId: lastChannelID,
        channelName: channels?.docs[lastChannel].data().channelName,
      })
    );

    navigate(`/channels/${id}/${lastChannelID}`);
  };
  return (
    <div
      className={`h-12 bg-[#2f3136]  w-12 cursor-pointer hover:bg-discord_purple  text-white rounded-full hover:rounded-2xl ${id===serverId && 'bg-discord_purple '}`}
      onClick={handleServerClick}
    >
      {serverPhoto ? (
        <img className=" rounded-full  hover:rounded-2xl" src={serverPhoto} />
      ) : (
        <h1 className=" font-bold uppercase text-center p-3">{sName}</h1>
      )}
    </div>
  );
}

export default Server;
