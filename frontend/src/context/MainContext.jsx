import { createContext, useContext } from "react";


export const MainContext = createContext(null)

export const useMainContext = () => useContext(MainContext)

