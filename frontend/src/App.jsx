import React from "react";
import MainLayout from "./components/MainLayout";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuestionsPage from "./pages/QuestionsPage";
import QuestionPage from "./pages/QuestionPage";
import NotesPage from "./pages/NotesPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Admin from "./pages/AdminPage";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DiscussionsPage from "./pages/DiscussionsPage";
import DiscussionRoomPage from "./pages/DiscussionRoomPage";
import MyQuestionsPage from "./pages/MyQuestionsPage";
import MyNotesPage from "./pages/MyNotesPage";
import ChatsPage from "./pages/ChatsPage";
import Profile from "./pages/Profile";

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
          <Route path="/study/questions/:questionId" element={<QuestionPage />} />
          <Route path="/study/notes" element={<NotesPage />} />
          <Route path="/study/discussions" element={<DiscussionsPage />} />
          <Route
            path="/study/discussions/:roomId"
            element={
              <ProtectedRoute>
                <DiscussionRoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personal/my-questions"
            element={
              <ProtectedRoute>
                <MyQuestionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personal/my-notes"
            element={
              <ProtectedRoute>
                <MyNotesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personal/chats"
            element={
              <ProtectedRoute>
                <ChatsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/profile"
            element={
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
