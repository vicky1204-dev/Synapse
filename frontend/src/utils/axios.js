import axios from "axios";
import eventEmitter from "./eventEmitter";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-access-token"
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh-access-token");
        return api(originalRequest);
      } catch (error) {
        if(!originalRequest.skipAuthToast){
          eventEmitter.emit("logout", { reason: "session_expired" });
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
