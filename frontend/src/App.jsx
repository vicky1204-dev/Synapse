import React from "react";
import MainLayout from "./components/MainLayout";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuestionsPage from "./pages/QuestionsPage";
import NotesPage from "./pages/NotesPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Admin from "./pages/AdminPage";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DiscussionsPage from "./pages/DiscussionsPage";
import MyQuestionsPage from "./pages/MyQuestionsPage";
import MyNotesPage from "./pages/MyNotesPage";
import ChatsPage from "./pages/ChatsPage";

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

        <Route element={<MainLayout />}>
          <Route path="/study/questions" element={<QuestionsPage />} />
          <Route path="/study/notes" element={<NotesPage />} />
          <Route path="/study/discussions" element={<DiscussionsPage />} />
          <Route path="/personal/my-questions" element={<MyQuestionsPage />} />
          <Route path="/personal/my-notes" element={<MyNotesPage />} />
          <Route path="/personal/chats" element={<ChatsPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
