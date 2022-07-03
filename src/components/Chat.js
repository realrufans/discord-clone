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
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectChannelId, selectChannelName } from "../features/ChannelSlice";
import { selectServerId, selectServerName } from "../features/ServerSlice";
import { auth, db, storage } from "../firebase";
import firebase from "firebase/compat/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Moment from "react-moment";
import moment from "moment";
import Message from "./Message";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Line } from "rc-progress";

function Chat() {
  let inputRef = useRef();
  let scrollBottom = useRef(null);
  const serverId = useSelector(selectServerId);
  const serverName = useSelector(selectServerName);
  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);
  const [user] = useAuthState(auth);
  const [usersBoard, setShowUsersBoard] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [BoardList, setBoardList] = useState([]);
  const [progress, setProgress] = useState(null);
  const [uploadedImage, setUploadedImage] = useState();
  const [UploadClicked, setUploadClicked] = useState(false);
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

  (function () {
    var win = window,
      doc = win.document;

    // If there's a hash, or addEventListener is undefined, stop here

    //scroll to 1
    window.scrollTo(0, 1);
    var scrollTop = 1,
      //reset to 0 on bodyready, if needed
      bodycheck = setInterval(function () {
        if (doc.body) {
          clearInterval(bodycheck);
          scrollTop = "scrollTop" in doc.body ? doc.body.scrollTop : 1;
          win.scrollTo(0, scrollTop === 1 ? 0 : 1);
        }
      }, 15);

    if (win.addEventListener) {
      win.addEventListener(
        "load",
        function () {
          setTimeout(function () {
            //reset to hide addr bar at onload
            win.scrollTo(0, scrollTop === 1 ? 0 : 1);
          }, 0);
        },
        false
      );
    }
  })();

  useEffect(() => {
    const roughBoardList = [];
    setBoardList([]);
    messages?.docs.map((doc) => {
      const { senderName, senderPhotoUrl } = doc.data();
      const user = {
        senderName,
        senderPhotoUrl,
      };
      roughBoardList.push(user);
      const senders = roughBoardList.map(({ senderName }) => senderName);
      const cleanList = roughBoardList.filter(({ senderName }, index) => {
        return !senders.includes(senderName, index + 1);
      });

      setBoardList(cleanList);
    });
  }, [messages?.docs.length]);

  const sendMessage = async (e) => {
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
        block: "end",
      });
    }
    return;
  };

  const mediaPicker = (e) => {
    e.preventDefault();
    setSelectedImage(e.target.files[0]);
  };
  const handleUpload = (e) => {
    setUploadClicked(true);
    e.preventDefault();
    if (!selectedImage) {
      console.log("Please select an image!");
      return;
    }
    const date = new Date() * 100;
    const storageRef = ref(storage, `/images/${selectedImage.name + date}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);

    // upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (err) => {
        console.log(err.message);
        setProgress(null);
        setUploadClicked(false);
      },
      async () => {
        const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        if (imageUrl) {
          setProgress(null);
          setUploadedImage(imageUrl);
          setTimeout(() => {
            setUploadClicked(false);
          }, 3000);
          setSelectedImage("");

          // send the image to the chat
          db.collection("servers")
            .doc(serverId)
            .collection("channels")
            .doc(channelId)
            .collection("messages")
            .add({
              messageImage: imageUrl,
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
              senderEmail: user?.email,
              senderName: user?.displayName,
              senderPhotoUrl: user?.photoURL,
            });

          scrollBottom.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      }
    );
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
                className="     hidden  bg-[#202225] focus:outline-none p-1 text-white pl-1 placeholder-[#72767d] w-40 focus:w-60"
              />
              <SearchIcon className="     hidden h-4 cursor-pointer text-[#72767d] mr-1" />
            </div>
          </div>
        </header>

        <main
          className={` text-[#2f3136] scrollbar-thin scrollbar-thumb-current  w-screen lg:w-full h-[100vh] p-6 mb-10 ${
            usersBoard && "w-[83%] "
          }`}
        >
          {messages?.docs.map((doc) => {
            const {
              senderPhotoUrl,
              senderName,
              senderEmail,
              message,
              messageImage,
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
                messageImage={messageImage}
              />
            );
          })}

          <div className=" h-2 w-2 mb-28 text-red-700"></div>
          <div className=" h-2 w-2 mb-36 text-red-700" ref={scrollBottom}></div>
        </main>

        {progress && (
          <Line
            className={` bg-white absolute bottom-20 items-center  flex mb-0 ml-5  w-[95%] ${
              usersBoard && "w-[78%] mr-5"
            }`}
            percent={progress}
            strokeWidth={1}
            strokeColor="#295de7"
          />
        )}
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

          <button onClick={selectedImage ? handleUpload : sendMessage}>
            <ArrowCircleRightIcon className=" h-10  rounded-full  text-white bg-discord_blue" />
          </button>
        </form>
      </div>

      {usersBoard && (
        <div className="  absolute  z-10  top-12 right-0  sm:w-[16.5%]  p-3 bg-[#2f3136]  h-[92vh] overflow-y-scroll scrollbar-hide">
          <>
            <h1 className="text-white  text-2xl capitalize bg text-center">
              Users In Channel
            </h1>
            {BoardList?.map((user) => {
              return (
                <div className=" hover:cursor-pointer hover:bg-[#36393f]  my-6  py-2  flex justify-start overflow-y-scroll scrollbar-hide   bg-[#2f3136]  ">
                  <img
                    className="h-9 self-center rounded-full"
                    src={user.senderPhotoUrl}
                  />
                  <h2 className="p-2 text-sm text-discord_blurple ">
                    {user?.senderName}
                  </h2>
                </div>
              );
            })}
          </>
        </div>
      )}
    </div>
  );
}

export default Chat;
