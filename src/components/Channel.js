import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/solid";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import { useDispatch, useSelector } from "react-redux";
import { selectServerId, selectServerName } from "../features/ServerSlice";
import { useCollection } from "react-firebase-hooks/firestore";
import ChannelDetails from "./ChannelDetails";
import { setChannelInfo } from "../features/ChannelSlice";
import { addDoc, collection, getDoc, orderBy, query } from "firebase/firestore";

function Channel() {
  const [showChannelChild, setShowChannel] = useState(true);
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const userId = `#${user?.uid.substring(0, 4)}`;
  const serverName = useSelector(selectServerName);
  const serverId = useSelector(selectServerId);
  console.log('this is servername from redux ', serverName)

  const [channels] = useCollection(
    query(
      collection(db, `servers/${serverId}`, "channels"),
      orderBy("timeStamp", "asc")
    )
  );

  const navigate = useNavigate();

  const logout = () => {
    auth.signOut();
    navigate("/");
  };

  // creating a new channel
  const handChannelName = async () => {
    const value = prompt("Enter a new channel name", "");
    if (value) {
      const channelRef = await addDoc(
        collection(db, "servers", serverId, "channels"),
        {
          channelName: value,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
      );

      const channelSnapShot = await getDoc(channelRef);

      // get channel info if the newly created channel exist
      if (channelSnapShot.exists()) {
        dispatch(
          setChannelInfo({
            channelId: channelSnapShot.id,
            channelName: channelSnapShot.data().channelName,
          })
        );
        navigate(`/channels/${serverId}/${channelSnapShot.id}`);
      }
    }
  };
  return (
    //  className="relative flex   items-center  flex-col bg-[#202225] space-y-2  overflow-y-scroll scrollbar-hide  ">
    <div className=" relative  min-w-[260px] max-w-[260px]    text-[#829297] h-screen     ">
      <div className=" p-3 border-b w-[100%] border-gray-800 text-white flex hover:bg-[#34373c] cursor-pointer justify-between items-center">
        <h2 className="  truncate ...  font-bold static ">{serverName}</h2>
        <ChevronDownIcon className="h-5" />
      </div>

      <div className=" flex  justify-between p-3 mb-0 cursor-pointer     ">
        <h3
          className="flex uppercase font-black text-sm hover:text-white   "
          onClick={() => setShowChannel(!showChannelChild)}
        >
          {/* check for the button to show */}
          {showChannelChild ? (
            <ChevronDownIcon className="h-4 self-center" />
          ) : (
            <ChevronRightIcon className="h-4  self-center" />
          )}
          Text channels
        </h3>

        <PlusIcon
          className="h-5  hover:text-white  "
          onClick={() => handChannelName()}
        />
      </div>

      <div className="  overflow-y-scroll mb-16 scrollbar-hide">
        {showChannelChild && (
          <div className=" ">
            {channels?.docs.map((doc) => (
            <>
              {console.log(doc.data().channelName)}
              <ChannelDetails
                key={doc.id}
                id={doc.id}
                channelName={doc.data().channelName}
              />
            </>
            ))}
          </div>
        )}
      </div>

      {/* user profile details */}

      <div className=" p-2 w-full max-h-fit  flex justify-between flex-wrap  absolute bottom-0 fixed ">
        <div className=" flex justify-between space-x-1  items-center">
          <img className="   rounded-full h-7" src={user?.photoURL} />

          <div className="flex flex-col">
            <h4 className=" text-sm  truncate ...   text-white">
              {user?.displayName.substring(0, 10)}
            </h4>
            <p
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(userId);
                alert("Your id copied");
              }}
            >
              {userId}
            </p>
          </div>
        </div>
        <div
          className=" text-white font-bold text-base cursor-pointer mx-auto my-0    p-2 items-end w-fit "
          onClick={() => logout()}
        >
          <h4>Logout</h4>
        </div>
      </div>
    </div>
  );
}

export default Channel;
