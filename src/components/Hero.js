import { DownloadIcon } from "@heroicons/react/solid";

function Hero() {
  return (
    <div className="   relative  bg-discord_blue py-10 sm:h-[7%] md:h-[90vh]  ">
      <div className="     h-[100%]   flex  max-w-7xl mx-auto my-0    flex-col md:flex-row px-4 md:px-10 lg:gap-5 lg:py-14 lg:px-0 lg:text-9xl">
        <div className=" lg:text-4xl  lg:self-start  lg:w-[60%] lg:mx-auto lg:my-0 lg:text-center">
          <h1 className=" text-white text-3xl font-extrabold   uppercase  mb-6 md:text-5xl">
            Imagine A Place...
          </h1>
          <p className=" text-white font-light mb-6 mx-auto my-0 md:max-w-lg lg:max-w-5xl lg:text-lg  lg:mt-8 ">
            ...where you can belong to a school club, a gaming group, or a
            worldwide art community. Where just you and a handful of friends can
            spend time together. A place that makes it easy to talk every day
            and hang out more often.
          </p>
          <div className=" lg:flex gap-2 lg:justify-center">
            <button className=" hidden  sm:flex  focus:outline-none transition duration-200  ease-in-out hover:shadow-xl  hover:text-discord_blurple text-black bg-white  mb-6 flex justify-between   rounded-3xl p-4 items-center ">
              <DownloadIcon className="w-6 mr-2" />
              <h2 className="ml-2 lg:text-lg">Download for Windows</h2>
            </button>
            <button className="  focus:outline-none   hover:shadow-xl  hover:text-white hover:bg-gray-700 bg-gray-900 text-white  mb-6 flex justify-between   rounded-3xl p-4 items-center ">
              <h2 className="ml-2 lg:text-lg">Open Discord in your browser</h2>
            </button>
          </div>
        </div>
        <img
          src={require("../images/hero1.png")}
          alt="hero1"
          className=" mx-auto my-0  w-65   md:w-80        md:order-first md:hidden  lg:w-[25%]   lg:absolute      lg:left-0 lg:bottom-0       lg:inline lg:left-0 "
        />
        <img
          src={require("../images/hero2.png")}
          alt="hero2"
          className="hidden md:inline      md:w-[40%]  md:bottom-0  md:absolute  md:left-[55%]        lg:w-[25%] lg:left-[75%] lg:bottom-0  "
        />
      </div>
    </div>
  );
}

export default Hero;
