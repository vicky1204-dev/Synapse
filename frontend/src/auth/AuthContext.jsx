import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "./auth.service.js";
import { toast } from "react-toastify";
import eventEmitter from "../utils/eventEmitter.js";
import ErrorToast from "../components/toasts/ErrorToast.jsx";
import SuccessToast from "../components/toasts/SuccessToast.jsx";


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Listening for logout event
  useEffect(() => {
    const handleLogout = (payload) => {
      setUser(null);

      if (payload?.reason === "session_expired") {
        toast(<ErrorToast message={"Session expired. Please login."}/>);
      } else {
        toast(<SuccessToast message={"Logged out successfully."} title="Logout"/>);
      }
    };

    eventEmitter.on("logout", handleLogout);

    return () => {
      eventEmitter.off("logout", handleLogout); 
      // Because if you don’t remove the listener:
      // eventEmitter.on("logout", handleLogout);
      // and the component re-mounts later, you’d register:
      // logout → [handleLogout, handleLogout]
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
