import { XCircleIcon } from "@heroicons/react/solid";
import { auth, db } from "../firebase";
import moment from "moment";
import { useSelector } from "react-redux";
import { selectServerId } from "../features/ServerSlice";
import { selectChannelId } from "../features/ChannelSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, deleteDoc, doc } from "firebase/firestore";

function Message({
  id,
  senderPhotoUrl,
  senderName,
  senderEmail,
  message,
  timeStamp,
}) {
  const [user] = useAuthState(auth);
  const serverId = useSelector(selectServerId);
  const channelId = useSelector(selectChannelId);
 
  return (
    <div className="flex  relative w-[90%]  m-5 justify-between group" key={id}>
      <div className=" flex space-x-3  space-y-3   ">
        <img className="h-9 self-center rounded-full" src={senderPhotoUrl} />
        <div>
          <div className="flex space-x-2  items-center    ">
            {" "}
            <span className=" text-lg  text-white hover:underline cursor-pointer ">
              {senderName}
            </span>
            <span className=" font-light text-sm text-white  ">
              {moment(timeStamp?.toDate().getTime()).format("L")}
            </span>
          </div>

          <p className="text-[#dcddde] mt-2  leading-7  ">{message}</p>
        </div>
      </div>
      {senderEmail === user.email && (
        <div className="absolute top-2 right-0 self-center">
          <XCircleIcon
            className="h-8  self-center   text-red-500 bg-white rounded-full cursor-pointer hidden group-hover:inline"
            onClick={async () => {
              if (window.confirm("Do you want to delete?"))
                await deleteDoc(
                  doc(
                    db,
                    "servers",
                    serverId,
                    "channels",
                    channelId,
                    "messages",
                    id
                  )
                );
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Message;
