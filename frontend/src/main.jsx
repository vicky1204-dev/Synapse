import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        toastStyle={{
          background: "black",
          padding: 0,
          boxShadow: "none",
          width: "fit-content",
          top: "96px"
        }}
        bodyStyle={{
          padding: 0,
          margin: 0,
        }}
      />
    </AuthProvider>
  </BrowserRouter>,
);
