import {
  ArrowCircleRightIcon,
  BellIcon,
  HashtagIcon,
  PhotographIcon,
  SearchIcon,
  ServerIcon,
  TrashIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/solid";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectChannelId, selectChannelName } from "../features/ChannelSlice";
import { selectServerId, selectServerName } from "../features/ServerSlice";
import { auth, db } from "../firebase";
import firebase from "firebase/compat/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Moment from "react-moment";
import moment from "moment";
import { doc, deleteDoc, Timestamp } from "firebase/firestore";
import Message from "./Message";

function Chat() {
  let inputRef = useRef();
  let scrollBottom = useRef(null);
  const serverId = useSelector(selectServerId);
  const serverName = useSelector(selectServerName);
  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);
  const [user] = useAuthState(auth);
  const [usersBoard, setShowUsersBoard] = useState(true);
  const [selectedImage, setSelectedImage] = useState([]);
  const [cleanedBoardList, setCleanedBoardList] = useState([]);
  const [messages] = useCollection(
    channelId &&
      db
        .collection("servers")
        .doc(serverId)
        .collection("channels")
        .doc(channelId)
        .collection("messages")
        .orderBy("timeStamp", "asc")
  );

  messages?.docs.map((e) => {
    // const { senderName, senderPhotoUrl } = e.data();
    // const bordList = [];
    // bordList.push(senderName, senderPhotoUrl );
   
    // bordList.filter((e, i) => {
    //   if (bordList.indexOf(e) === i) {
    //     setCleanedBoardList(e);
    //   }
    // });
  });

   

  const sendMessage = (e) => {
    e.preventDefault();

    if (inputRef.current.value.trim().length > 0) {
      e.preventDefault();
      db.collection("servers")
        .doc(serverId)
        .collection("channels")
        .doc(channelId)
        .collection("messages")
        .add({
          message: inputRef.current.value,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          senderEmail: user?.email,
          senderName: user?.displayName,
          senderPhotoUrl: user?.photoURL,
        });

      inputRef.current.value = "";
      scrollBottom.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    return;
  };

  const mediaPicker = (event) => {
    const { files } = event.target;
    setSelectedImage(files[0]);
    console.log(selectedImage);
  };

  const showUsers = () => {
    setShowUsersBoard(!usersBoard);
  };
  return (
    <div className=" relative bg-[#36393f]    flex  h-screen   flex-grow text-[#72767d]         ">
      <div className="flex flex-grow flex-col ">
        <header className="flex justify-between border-b  border-gray-800  p-3 items-center  ">
          <div className=" flex  space-x-1">
            <HashtagIcon className=" font-bold h-6" />
            <h3 className="text-white text-md">{channelName}</h3>
          </div>
          <div className="flex space-x-3 items-center text-white">
            <UsersIcon
              className="h-6 text-[#b9bbbe] cursor-pointer hover:text-[#dcddde] "
              onClick={showUsers}
            />
            <div className="flex bg-[#202225] text-xs  rounded-md items-center">
              <input
                type="text"
                placeholder="Search"
                className="bg-[#202225] focus:outline-none p-1 text-white pl-1 placeholder-[#72767d] w-40 focus:w-60"
              />
              <SearchIcon className="h-4 cursor-pointer text-[#72767d] mr-1" />
            </div>
          </div>
        </header>

        <main
          className={` text-[#2f3136] scrollbar-thin scrollbar-thumb-current  h-[100vh] p-6 mb-10 ${
            usersBoard && "w-[83%] "
          }`}
        >
          {messages?.docs.map((doc) => {
            const {
              senderPhotoUrl,
              senderName,
              senderEmail,
              message,
              timeStamp,
            } = doc.data();
            return (
              <Message
                id={doc.id}
                senderPhotoUrl={senderPhotoUrl}
                senderName={senderName}
                senderEmail={senderEmail}
                message={message}
                timeStamp={timeStamp}
              />
            );
          })}

          <div className=" m-10 h-2 w-2" ref={scrollBottom}></div>
        </main>

        <form
          className={` absolute bg-[#40444b] bottom-0 items-center  flex mb-5 ml-5  w-[95%] ${
            usersBoard && "w-[78%] mr-5"
          }  `}
        >
          <label>
            <PhotographIcon className="h-10  ml-3 cursor-pointer   text-white rounded-full" />
            <input
              className="hidden"
              type="file"
              accept="image/*"
              capture="camera"
              onChange={mediaPicker}
            />
          </label>

          <input
            disabled={!channelId}
            ref={inputRef}
            type="text"
            placeholder={`Send a message in #${serverName}`}
            className=" z-10 text-[#dcddde] bg-transparent w-[100%] placeholder-[#72767d] focus:outline-none   p-4  "
          />

          <button onClick={sendMessage}>
            <ArrowCircleRightIcon className=" h-10  rounded-full  text-white bg-discord_blue" />
          </button>
        </form>
      </div>

      {usersBoard && (
        <div className="  absolute right-0 top-12  w-[16.5%]  p-3 bg-[#2f3136]  h-[92vh] overflow-y-scroll scrollbar-hide">
          <>
            <div className=" hover:cursor-pointer my-3  flex justify-between overflow-y-scroll scrollbar-hide   bg-[#2f3136]  ">
              <img
                className="h-9 self-center rounded-full"
                src={user?.photoURL}
              />
              <h2 className="p-2 hover:bg-[#36393f] text-discord_blurple ">
                {user?.displayName}
              </h2>
            </div>
          </>
        </div>
      )}
    </div>
  );
}

export default Chat;
