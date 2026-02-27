import { api } from "../utils/axios.js";

export const login = (data) => api.post("/auth/login", data)
export const signup = (data) => api.post("/auth/register", data)
export const logout = () => api.post("/auth/logout")
export const getCurrentUser = () => api.get("/users/get-user")