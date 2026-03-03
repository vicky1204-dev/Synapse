import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { login } from "../auth/auth.service.js";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import synapse_logo from "../assets/synapse_logo.svg";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await login(form);
      setUser(res.data.data.user);
      toast.success("Login Successful!");
      console.log("Login response: ", res.data.data.user)
      navigate("/study/questions");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
  return (
      <div
        className="text-text-primary flex flex-col gap-8 border border-white/20 rounded-lg py-6 px-8 min-w-md"
      >
        <div>
          <div className="w-fit m-auto py-1 px-3 rounded-full border border-white/30 mb-3">
            <img className="w-18" src={synapse_logo} alt="" />
          </div>
          <h1 className="text-[40px] text-text-primary font-medium text-center">
            Login
          </h1>
          <h1 className="text-sm text-text-secondary text-center">
            Enter your email and password
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex justify-center flex-col gap-8"
        >
          <div className="gap-1 flex flex-col">
            <span className="flex gap-2 items-center ml-2">
              {" "}
              <Mail size={18} /> Email
            </span>
            <input
              className="text-text-secondary focus:outline-none focus:border-white/30 border-b border-white/15 py-1 px-2 w-full"
              placeholder="Enter your email"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              value={form.email}
            />
          </div>
          <div className="gap-1 flex flex-col">
            <span className="flex gap-2 items-center ml-2">
              {" "}
              <Lock size={18} /> Password
            </span>
            <input
              className="text-text-secondary focus:outline-none focus:border-white/30 border-b border-white/15 py-1 px-2 w-full"
              placeholder="Enter your password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="bg-white text-black rounded-full cursor-pointer px-6 py-2"
          >
            Submit
          </button>
        </form>
      </div>
  );
};

export default LoginPage;
