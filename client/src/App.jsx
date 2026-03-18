import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Header from "./pages/components/Header";
import Footer from "./pages/components/Footer";
import Profile from "./pages/Profile";
import About from "./pages/About";
import PrivateRoute from "./pages/Routes/PrivateRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./pages/Routes/AdminRoute";
import UpdatePackage from "./pages/admin/UpdatePackage";
import Package from "./pages/Package";
import RatingsPage from "./pages/RatingsPage";
import Booking from "./pages/user/Booking";
import Search from "./pages/Search";

// Routes where Header & Footer should NOT appear
const HIDDEN_LAYOUT_ROUTES = ["/login", "/signup"];

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  // Hide on login/signup, admin pages, user profile, package details, and booking
  const hideLayout =
    HIDDEN_LAYOUT_ROUTES.includes(pathname) ||
    pathname.startsWith("/profile/admin") ||
    pathname.startsWith("/profile/user") ||
    pathname.startsWith("/package/") ||
    pathname.startsWith("/booking/");

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};

const App = () => {
  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({
        duration: 700,
        easing: "ease-out-cubic",
        once: true,
        offset: 60,
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<Search />} />
          {/* user */}
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="user" element={<Profile />} />
          </Route>
          {/* admin */}
          <Route path="/profile" element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/update-package/:id" element={<UpdatePackage />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="/package/:id" element={<Package />} />
          <Route path="/package/ratings/:id" element={<RatingsPage />} />
          {/* checking user auth before booking */}
          <Route path="/booking" element={<PrivateRoute />}>
            <Route path=":packageId" element={<Booking />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
