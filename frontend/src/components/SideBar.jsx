import {
  CircleQuestionMark,
  Notebook,
  MessagesSquare,
  MessageCircle,
  NotepadText,
  TvMinimalPlay,
  AudioLines,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useMainContext } from "../context/MainContext";

const sideBarData = [
  {
    category: "Study",
    links: [
      {
        icon: CircleQuestionMark,
        title: "Questions",
        meta: "Ask your doubts",
        to: "/study/questions",
      },
      {
        icon: Notebook,
        title: "Notes",
        meta: "Get materials",
        to: "/study/notes",
      },
      {
        icon: MessagesSquare,
        title: "Discussions",
        meta: "Discuss in groups",
        to: "/study/discussions",
      },
    ],
  },
  {
    category: "Personal",
    links: [
      {
        icon: MessageCircle,
        title: "Chats",
        meta: "Your Chats",
        to: "/personal/chats",
      },
      {
        icon: CircleQuestionMark,
        title: "Questions",
        meta: "Your Questions",
        to: "/personal/my-questions",
      },
      {
        icon: NotepadText,
        title: "Notes",
        meta: "Your Notes",
        to: "/personal/my-notes",
      },
    ],
  },
  {
    category: "Hangout",
    links: [
      {
        icon: TvMinimalPlay,
        title: "Watch2gether",
        meta: "Watch YT videos",
        to: "/coming-soon",
      },
      {
        icon: AudioLines,
        title: "Listen2gether",
        meta: "Listen songs",
        to: "/coming-soon",
      },
    ],
  },
];

const SideBar = () => {
  const { setSidebarVisible } = useMainContext();
  return (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
        className="h-full flex flex-col justify-between py-8 px-4 border border-white/20 rounded-lg bg-black"
      >
        <Link to="/" className="flex items-center justify-center">
          <motion.img
            initial={{ opacity: 0, filter: "blur(12px)" }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              transition: { duration: 0.6 },
            }}
            src="/assets/synapse_logo.svg"
            alt=""
          />
        </Link>

        {sideBarData.map((data, index) => {
          return (
            <div key={data.category} className="flex flex-col gap-2">
              <motion.h1
                initial={{ y: 20, opcaity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
                className="text-xs text-text-secondary ml-3"
              >
                {data.category}
              </motion.h1>
              <div className={`flex flex-col gap-0 `}>
                {data.links.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      to={item.to}
                      key={item.to}
                      className={`relative`}
                      onClick={() => setSidebarVisible(false)}
                    >
                      {({ isActive }) => {
                        return (
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 10,
                              filter: "blur(12px)",
                            }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{
                              duration: 0.6,
                              delay: index * 0.1,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className={`relative flex items-center justify-start gap-2 rounded-lg py-2 px-3 ${
                              isActive ? "" : "hover:bg-bg-secondary hover:z-0"
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId={data.category}
                                transition={{
                                  duration: 0.2,
                                  ease: "easeInOut",
                                }}
                                className="bg-white rounded-lg inset-0 z-4 absolute pointer-events-none"
                              ></motion.div>
                            )}
                            <div
                              className={`p-2 rounded-sm border w-fit h-fit z-10 mix-blend-difference border-white/20 text-text-secondary`}
                            >
                              <IconComponent strokeWidth={1} size={18} />
                            </div>

                            <div className="flex flex-col items-start justify-center z-10">
                              <h1
                                className={
                                  isActive ? "text-black" : "text-white"
                                }
                              >
                                {item.title}
                              </h1>

                              <span className="text-xs text-text-secondary mix-blend-difference">
                                {item.meta}
                              </span>
                            </div>
                          </motion.div>
                        );
                      }}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="flex items-center justify-center flex-col">
          <button>Logout</button>
          <Link>Profile</Link>
        </div>
      </motion.div>
    </>
  );
};

export default SideBar;
