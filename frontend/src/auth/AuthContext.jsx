import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "./auth.service.js";
import { toast } from "react-toastify";
import eventEmitter from "../utils/eventEmitter.js";
import ErrorToast from "../components/toasts/ErrorToast.jsx";
import SuccessToast from "../components/toasts/SuccessToast.jsx";
import InfoToast from "../components/toasts/InfoToast.jsx";
import { createSocket } from "../socket/socket.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  //this is the initial hydration of user
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await getCurrentUser();
        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  //socket instance, depends on user state(logged in or not), works even when user logs in and page isnt refreshed or logs out
  useEffect(() => {
    if (!user?.id) {
      setSocket(null);
      return;
    }

    const newSocket = createSocket(user.id);
    setSocket(newSocket);

    newSocket.on("notification:new", (data) => {
      switch (data.type) {
        case "question:ai:started":
          toast(<InfoToast message={data.message} />);
          break;
        case "question:ai:completed":
          toast(<SuccessToast message={data.message} />);
          break;
        default:
          toast(<InfoToast message={data.message || "New Notification"} />);
      }
    });

    return () => {
      newSocket.off("notification:new");
      newSocket.off("question:ai:completed");
      newSocket.disconnect();
    };
  }, [user]);

  // Listening for logout event
  useEffect(() => {
    const handleLogout = (payload) => {
      setUser(null);
      setSocket(null);

      if (payload?.reason === "session_expired") {
        toast(<ErrorToast message={"Session expired. Please login."} />);
      } else {
        toast(
          <SuccessToast message={"Logged out successfully."} title="Logout" />,
        );
      }
    };

    eventEmitter.on("logout", handleLogout);

    // this is cleanup, runs on unmount
    return () => {
      eventEmitter.off("logout", handleLogout);
      // Because if you don’t remove the listener:
      // eventEmitter.on("logout", handleLogout);
      // and the component re-mounts later, you’d register:
      // logout → [handleLogout, handleLogout]
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, socket, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
