/*1. Get roomId from URL
2. Fetch room details
3. Fetch messages
4. Join socket */

import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorToast from "../components/toasts/ErrorToast";
import SuccessToast from "../components/toasts/SuccessToast";
import { api } from "../utils/axios.js";
import { motion } from "framer-motion";
import { useAuth } from "../auth/useAuth.js";
import { useRef } from "react";
import { useMainContext } from "../context/MainContext";
import { ChevronLeft, Menu } from "lucide-react";

const DiscussionRoomPage = () => {
  const { setSidebarVisible } = useMainContext();
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);
  const { socket, user } = useAuth();
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    async function init() {
      try {
        const roomRes = await api.get(`/chat/rooms/${roomId}`);
        const msgRes = await api.get("/chat/messages", {
          params: { chatId: roomId, type: "room" },
        });
        setRoom(roomRes?.data?.data);
        setMessages(msgRes?.data?.data);
      } catch (error) {
        console.log(error);
        toast(
          <ErrorToast
            message={error.response?.data?.message || "Something went wrong"}
          />,
        );
      }
    }

    init();
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("chat:join", roomId);

    const handler = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat:receive", handler);

    return () => {
      socket.emit("chat:leave", roomId);
      socket.off("chat:receive", handler);
    };
  }, [socket, roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    socket.emit("chat:send", {
      roomId,
      content: input,
      type: "room",
    });

    setInput("");
    inputRef.current.focus();
  };

  return (
    <>
      <div className="bg-black p-8 pt-0 w-full min-h-screen flex gap-4 flex-col">
        <header className="sticky top-0 md:pt-6 bg-black z-10">
          <div className="flex flex-col gap-4 pt-4">
            <div className="flex justify-between items-center">
            <motion.h1
              className="leading-0 text-3xl origin-left flex items-center gap-2 font-light"
              initial={{ opacity: 0, filter: "blur(12px)" }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                opacity: { duration: 0.6, ease: "easeOut" },
                filter: { duration: 0.6, ease: "easeOut" },
                fontSize: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
              }}
            >
              <ChevronLeft/>
              Discussion Room
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.6 } }}
              className="flex gap-6 items-center justify-center"
            >
              <div
                className="sm:hidden cursor-pointer"
                onClick={() => setSidebarVisible((prev) => !prev)}
              >
                <Menu strokeWidth={1} />
              </div>
            </motion.div>
          </div>
          <div className="flex">
            <div className="border border-white/20 text-xs text-text-secondary py-1 px-2">
              {room?._id}
            </div>
            <div className="flex justify-between text-sm w-full items-center px-4 text-text-secondary">
              <div>{room?.participants?.length} Participants</div>
              <div>
                Moderation{" "}
                <span className="rounded-full bg-red-500 px-2 py-1 text-black">
                  Active
                </span>
              </div>
            </div>
          </div>
          </div>
          <motion.div
            className="w-full h-px bg-white/15 mt-3"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 0.5,
              ease: [0.76, 0, 0.24, 1],
            }}
          ></motion.div>
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto gap-2 items-center justify-center">
          {messages.length === 0 ? (
            <div className="text-text-secondary">No Messages Yet</div>
          ) : (
            messages.map((message, index) => {
              console.log(message);
              return (
                <motion.div
                initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.6 } }}
                  key={message?._id}
                  className={`${message?.sender?._id === user.id ? "self-end" : "self-start"} flex flex-col`}
                >
                  <p
                    className={`text-xs text-text-secondary ${message?.sender?._id === user.id ? "self-end" : "self-start"}`}
                  >
                    {message?.sender?._id === user.id
                      ? "You"
                      : message?.sender?.username}
                  </p>
                  <p
                    className={`p-2 rounded-md w-fit max-w-xs ${
                      message?.sender?._id === user.id
                        ? "bg-[#7AAACE] text-black"
                        : "bg-bg-secondary text-white"
                    }`}
                  >
                    {message?.content}
                  </p>
                </motion.div>
              );
            })
          )}
          <div ref={bottomRef}></div>
        </div>
        <div className="w-full flex gap-3 sticky bottom-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-bg-secondary px-5 py-3 rounded-full outline-none"
            placeholder="Enter your message"
          />
          <button
            onClick={() => sendMessage()}
            className="bg-white text-black px-3 rounded-full text-sm hover: cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default DiscussionRoomPage;
