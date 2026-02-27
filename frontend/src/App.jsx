import React from "react";
import SideBarLayout from "./components/SideBarLayout";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuestionsPage from "./pages/QuestionsPage";
import NotesPage from "./pages/NotesPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Admin from "./pages/AdminPage";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route element={<AuthLayout />}>
          <Route path="/register" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<SideBarLayout />}>
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/notes" element={<NotesPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
