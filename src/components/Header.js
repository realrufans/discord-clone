import { MenuIcon } from "@heroicons/react/solid";
import { auth, db, firebaseApp, provider } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import { selectServerId, setServerInfo } from "../features/ServerSlice";
import { selectChannelId, setChannelInfo } from "../features/ChannelSlice";
import LoadingIcons from "react-loading-icons";
import Hero from "./Hero";
import { collection, orderBy, query } from "firebase/firestore";

function Header() {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const serverId = useSelector(selectServerId);
  const channelId = useSelector(selectChannelId);
  const [servers] = useCollection(query(collection(db, "servers")));
  const [channels] = useCollection(
    query(
      collection(db, `servers/${serverId}`, "channels"),
      orderBy("timeStamp", "asc")
    )
  );

  const serverdocs = servers?.docs;
  const serverLength = serverdocs?.length;

  if (serverLength) {
    const activeServerId = serverdocs[serverLength - 1].id;
    const activeServerName = serverdocs[serverLength - 1].data().serverName;
    dispatch(
      setServerInfo({
        serverId: activeServerId,
        serverName: activeServerName,
      })
    );

    if (channels?.docs.length) {
      const channeldocs = channels?.docs;
      const channelLength = channels?.docs.length;

      const activeChannelId = channeldocs[channelLength - 1].id;

      const activeChannelName =
        channeldocs[channelLength - 1].data().channelName;

      dispatch(
        setChannelInfo({
          channelId: activeChannelId,
          channelName: activeChannelName,
        })
      );
    }
  }

  const login = (e) => {
    e.preventDefault();
    auth.signInWithPopup(provider).then(() => {
      if (channelId && serverId) navigate(`channels/${serverId}/${channelId} `);
      navigate(`channels/ `);
    });
  };

  return (
    <>
      {auth ? (
        <div>
          <header className={`bg-discord_blue md:h-[10vh] `}>
            <div className="p-4 flex justify-between lg:px-15  py-5   gap-8 max-w-7xl mx-auto my-0">
              <a href="/" className="flex cursor-pointer">
                <img
                  src={require("../images/logo.png")}
                  alt="dicord"
                  className=" max-w-30 max-h-10 bg-discord_blue "
                />
              </a>

              <div className=" hidden lg:flex justify-between justify-items-end">
                <a className="link ">Download</a>
                <a className="link">Nitro</a>
                <a className="link">Safety</a>
                <a className="link">Support</a>
                <a className="link">Blog</a>
                <a className="link">Carrers</a>
              </div>
              <div className=" flex">
                <button
                  className={`bg-white text-black text-base  font-semibold  min-w-min lg:py-3 px-6    rounded-md  outline-none hover:shadow-xl hover:text-blue-400"
            }`}
                  onClick={login}
                >
                  <p className="md:min-w-full">
                    {!user ? "Login" : "Open Discord"}
                  </p>
                </button>

                <MenuIcon className="w-10 h-10 text-white   cursor-pointer  ml-5 md:hidden" />
              </div>
            </div>
          </header>
          <Hero />
        </div>
      ) : (
        <div className=" bg-discord_blue w-full h-screen flex items-center">
          <LoadingIcons.Oval className="h-10 mx-auto my-0" />
        </div>
      )}
    </>
  );
}

export default Header;
