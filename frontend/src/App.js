import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from "react"

import { useBackendMutation } from "main/utils/useBackend";
import HomePage from "main/pages/HomePage";

import LoadingPage from "main/pages/LoadingPage";
import LoginPage from "main/pages/LoginPage";
import ProfilePage from "main/pages/ProfilePage";
import CoursesEditPage from "main/pages/CoursesEditPage";

import AdminUsersPage from "main/pages/AdminUsersPage";
import AdminJobsPage from "main/pages/AdminJobsPage";

import CoursesCreatePage from "main/pages/CoursesCreatePage";
import CoursesIndexPage from "main/pages/CoursesIndexPage";
import CoursesStaffPage from "main/pages/CoursesStaffPage";

import SchoolCreatePage from "main/pages/SchoolCreatePage";
import SchoolIndexPage from "main/pages/SchoolIndexPage";
import SchoolEditPage from "main/pages/SchoolEditPage";


import { hasRole, useCurrentUser } from "main/utils/currentUser";
import NotFoundPage from "main/pages/NotFoundPage";
import StaffCreatePage from "main/pages/StaffCreatePage";
import CoursesShowPage from "./main/pages/CoursesShowPage";

function App() {
  const { data: currentUser } = useCurrentUser();

  const adminRoutes = hasRole(currentUser, "ROLE_ADMIN") ? (
    <>
      <Route path="/admin/schools" element={<SchoolIndexPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/jobs" element={<AdminJobsPage />} />
    </>
  ) : null;

  const userRoutes = hasRole(currentUser, "ROLE_USER") ? (
    <>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/courses" element={<CoursesIndexPage />} />
    </>
  ) : null;

  const courseRoutes = (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) ? (
    <>
      <Route path="/courses/create" element={<CoursesCreatePage />} />
      <Route path="/courses" element={<CoursesIndexPage />} />
      <Route path="/courses/edit/:id" element={<CoursesEditPage />} />
      <Route path="/courses/:id/staff" element={<CoursesStaffPage />} />
      <Route path="/courses/:id/addStaff" element={<StaffCreatePage />} />
      
      <Route path="/courses/:id" element={<CoursesShowPage />} />
    </>
  ) : null;

  const schoolRoutes = (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) ? (
    <>
      <Route path="/schools/create" element={<SchoolCreatePage />} />
      <Route path="/schools/edit/:abbrev" element={<SchoolEditPage />} />
      <Route path="/schools" element={<SchoolIndexPage />} />
    </>
  ) : null;

  const homeRoute = (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_USER")) 
    ? <Route path="/" element={<HomePage />} /> 
    : <Route path="/" element={<LoginPage />} />;

  /*  Display the LoadingPage while awaiting currentUser 
      response to prevent the NotFoundPage from displaying */
      
  const updateLastOnlineMutation = useBackendMutation(
    () => ({ method: 'POST', url: '/api/currentUser/last-online' }),
    {}
  );

  const updatedOnlineOnMount = useRef(false);

  useEffect(() => {
    if (currentUser && currentUser.loggedIn) {
      if (!updatedOnlineOnMount.current) {
        updatedOnlineOnMount.current = true;
        updateLastOnlineMutation.mutate();
      }
      
      const interval = setInterval(() => {
        updateLastOnlineMutation.mutate();
      }, 60000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentUser, updateLastOnlineMutation]);

  return (
    <BrowserRouter>
      {currentUser?.initialData ? ( <LoadingPage /> ) : ( 
        <Routes>
          {homeRoute}
          {adminRoutes}
          {userRoutes}
          {courseRoutes}
          {schoolRoutes}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
