import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { EmojiSadIcon, PlusIcon } from "@heroicons/react/solid";
import Channel from "./Channel";
import { db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase/compat/app";
import Server from "./Servers";
import { addDoc, collection, getDoc, orderBy, query } from "firebase/firestore";
import {
  selectServerId,
  selectServerName,
  setServerInfo,
} from "../features/ServerSlice";
import { useDispatch, useSelector } from "react-redux";
import Chat from "./Chat";
import {
  selectChannelId,
  selectChannelName,
  setChannelInfo,
} from "../features/ChannelSlice";
import discordHead from "../images/discordHead.svg";

function Home() {
 
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [servers] = useCollection(
    query(collection(db, "servers"), orderBy("timeStamp", "asc"))
  );
  const serverId = useSelector(selectServerId);
  const [channels] = useCollection(
    query(
      collection(db, `servers${serverId} 'channels`),
      orderBy("timeStamp", "asc")
    )
  );

  // on  refresh set server and channel
  // const serverdocs = servers?.docs;
  // const serverLength = serverdocs?.length;

  // if (serverLength) {
  //   const activeServerId = serverdocs[serverLength - 1].id;
  //   const activeServerName = serverdocs[serverLength - 1].data().serverName;
  //   dispatch(
  //     setServerInfo({
  //       serverId: activeServerId,
  //       serverName: activeServerName,
  //     })
  //   );

  //   if (channels?.docs.length) {
  //     const channeldocs = channels?.docs;
  //     const channelLength = channels?.docs.length;

  //     const activeChannelId = channeldocs[channelLength - 1].id;

  //     const activeChannelName =
  //       channeldocs[channelLength - 1].data().channelName;

  //     dispatch(
  //       setChannelInfo({
  //         channelId: activeChannelId,
  //         channelName: activeChannelName,
  //       })
  //     );
  //   }
  // }

  // new server function
  const addServer = async () => {
    const value = prompt("Create a server");

    if (value) {
      // add and get new server id
      const serverref = await addDoc(collection(db, "servers"), {
        serverName: value,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // get server data
      const snapShot = await getDoc(serverref);

      if (snapShot.exists()) {
        dispatch(
          setServerInfo({
            serverId: snapShot.id,
            serverName: snapShot.data().serverName,
          })
        );

        // creating a default channel
        const defaultChannelValue = "general";

        const defaultChannelRef = await addDoc(
          collection(db, "servers", serverref.id, "channels"),
          {
            channelName: defaultChannelValue,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          }
        );

        //  get defaul channel data
        const channelSnapShot = await getDoc(defaultChannelRef);

        if (channelSnapShot.exists()) {
          dispatch(
            setChannelInfo({
              channelId: channelSnapShot.id,
              channelName: channelSnapShot.data().channelName,
            })
          );
          navigate(`/channels/${serverref.id}/${channelSnapShot.id}`);
        }
      }
    }
  };

  const displayChannelsAndChats = () => {
    if (servers?.docs.length > 0 && serverId!== null) {
    return  <>
        <Channel />
        <Chat />
      </>;
    } else {
     return <div className=" text-white w-full h-screen    flex justify-center flex-col p-10">
        <EmojiSadIcon className="h-20" />
        <h1 className="text-2xl font-bold mx-auto my-0">
          Please create or Select a Server to continue...
        </h1>
      </div>;
    }
  };

  return (
    <>
      {user ? (
        <div className="relative flex h-screen bg-[#2f3136] overflow-y-hidden">
          {/* server */}

          <div className="flex   items-center  flex-col bg-[#202225]  min-w-[70px]     py-3  space-y-2  overflow-y-scroll scrollbar-hide     ">
            <div>
              <img
                className="h-10 rounded-full hover:rounded-2xl  "
                src={discordHead}
              />
              <hr className="my-2   " />
            </div>

            <div className=" space-y-4 ">
              {servers?.docs.map((doc) => {
                const { serverPhoto, serverName } = doc.data();
                return (
                  <Server
                    key={doc.id}
                    id={doc.id}
                    serverPhoto={serverPhoto}
                    serverName={serverName}
                  />
                );
              })}
            </div>
            <div>
              <PlusIcon
                className="h-10  cursor-pointer bg-discord_green rounded-full hover:rounded-2xl hover:text-white my-2 transition duration-500 ease-in-out"
                onClick={addServer}
              />
            </div>
            <Server
              serverPhoto={
                "https://i.picsum.photos/id/34/50/50.jpg?hmac=gFrHzGGp-BISOCwy9bJXx7WJM9IVo-Pd1qTXVGTp-WY"
              }
            />
          </div>
          <div className=" flex flex-grow">{displayChannelsAndChats()}</div>
        </div>
      ) : (
        navigate("/")
      )}
    </>
  );
}

export default Home;
