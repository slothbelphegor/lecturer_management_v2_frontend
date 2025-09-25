import { Route, Routes, useLocation } from "react-router";
import React from "react";

import "./App.css";
import Home from "./pages/Home.jsx";
import ListLecturers from "./pages/lecturers/List.jsx";
import Navbar from "./components/navbar/Navbar.jsx";

import ListDocument from "./pages/documents/List.jsx";
import CreateDocument from "./pages/documents/Create.jsx";
import DeleteDocument from "./pages/documents/Delete.jsx";
import EditDocument from "./pages/documents/Edit.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import PasswordResetRequest from "./pages/auth/PasswordResetRequest.jsx";
import PasswordReset from "./pages/auth/PasswordReset.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import getUserRole from "./components/GetUserRole.jsx";
import ListCourse from "./pages/courses/List.jsx";
import CreateCourse from "./pages/courses/Create.jsx";
import EditCourse from "./pages/courses/Edit.jsx";
import DeleteCourse from "./pages/courses/Delete.jsx";
import CreateLecturer from "./pages/lecturers/Create.jsx";
import EditLecturer from "./pages/lecturers/Edit.jsx";
import ListUser from "./pages/users/List.jsx";
import EditUser from "./pages/users/Edit.jsx";
import DeleteUser from "./pages/users/Delete.jsx";
import ListSchedule from "./pages/schedules/List.jsx";
import MyInfo from "./pages/lecturers/MyInfo.jsx";
import ListEvaluation from "./pages/evaluations/List.jsx";
import MyEvaluations from "./pages/evaluations/MyEvaluations.jsx";
import EditEvaluation from "./pages/evaluations/Edit.jsx";
import CreateEvaluation from "./pages/evaluations/Create.jsx";
import DeleteEvaluation from "./pages/evaluations/Delete.jsx";
import MySchedules from "./pages/schedules/MySchedules.jsx";
import ListRecommendation from "./pages/recommendations/List.jsx";
import EditRecommendation from "./pages/recommendations/Edit.jsx";
import MyRecommendations from "./pages/recommendations/MyRecommendations.jsx";
import CreateRecommendation from "./pages/recommendations/Create.jsx";
import DeleteRecommendation from "./pages/recommendations/Delete.jsx";
import ListPotentialLecturer from "./pages/lecturers/ListPotentialLecturers.jsx";
import CheckLecturer from "./pages/lecturers/Check.jsx";
import MyAccount from "./pages/auth/MyAccount.jsx";
import CreateUser from "./pages/users/Create.jsx";
import DeleteLecturer from "./pages/lecturers/Delete.jsx";

function App() {
  const location = useLocation();
  const noNavbarRoutes = ["/login", "/register", "/request_password_reset"];
  const noNavbarRoutesWithToken = ["/password_reset/"];
  const showNavbar =
    !noNavbarRoutes.includes(location.pathname) &&
    !noNavbarRoutesWithToken.some((route) =>
      location.pathname.startsWith(route)
    );

  return showNavbar ? (
    <>
      <Navbar
        content={
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/lecturers" element={<ListLecturers />} />
              <Route path="/lecturers/delete/:id" element={<DeleteLecturer />} />
              <Route
                path="/lecturers/:id/schedules"
                element={<ListSchedule />}
              />
              <Route
                path="/lecturers/:id/evaluations"
                element={<ListEvaluation />}
              />
              <Route path="/my_info" element={<MyInfo />} />
              <Route path="/my_evaluations" element={<MyEvaluations />} />
              <Route path="/my_schedules" element={<MySchedules />} />
              <Route path="/my_account" element={<MyAccount />} />
              <Route
                path="/my_recommendations"
                element={<MyRecommendations />}
              />
              <Route
                path="/my_recommendations/create"
                element={<CreateRecommendation />}
              />
              <Route
                path="/my_recommendations/edit/:id"
                element={<EditRecommendation />}
              />
              <Route
                path="/my_recommendations/delete/:id"
                element={<DeleteRecommendation />}
              />

              <Route path="/lecturers/create" element={<CreateLecturer />} />
              <Route path="/lecturers/edit/:id" element={<EditLecturer />} />

              <Route
                path="/lecturers/:id/evaluations/edit/:id"
                element={<EditEvaluation />}
              />
              <Route
                path="/lecturers/:id/evaluations/delete/:id"
                element={<DeleteEvaluation />}
              />
              <Route
                path="/lecturers/:id/evaluations/create"
                element={<CreateEvaluation />}
              />
              <Route path="/documents" element={<ListDocument />} />

              <Route path="/documents/create" element={<CreateDocument />} />
              <Route
                path="/documents/delete/:id"
                element={<DeleteDocument />}
              />
              <Route path="/documents/edit/:id" element={<EditDocument />} />
              <Route path="/courses" element={<ListCourse />} />
              <Route path="/courses/create" element={<CreateCourse />} />
              <Route path="/courses/edit/:id" element={<EditCourse />} />
              <Route path="/courses/delete/:id" element={<DeleteCourse />} />
            </Route>
            <Route path="/users" element={<ListUser />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="/users/edit/:id" element={<EditUser />} />
            <Route path="/users/delete/:id" element={<DeleteUser />} />
            <Route
              path="/lecturers/recommendations"
              element={<ListRecommendation />}
            />
            <Route
              path="/lecturers/recommendations/edit/:id"
              element={<EditRecommendation />}
            />
            <Route
              path="/lecturers/recommendations/delete/:id"
              element={<DeleteRecommendation />}
            />
            <Route
              path="/lecturers/registrations"
              element={<ListPotentialLecturer />}
            />
            <Route path="/lecturers/check/:id" element={<CheckLecturer />} />
          </Routes>
        }
      />
    </>
  ) : (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/request_password_reset"
          element={<PasswordResetRequest />}
        />
        <Route path="/password_reset/:token" element={<PasswordReset />} />
      </Routes>
    </>
  );
}

export default App;
