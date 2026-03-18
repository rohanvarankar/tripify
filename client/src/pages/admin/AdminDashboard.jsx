import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserStart, updateUserSuccess, updateUserFailure,
  logOutStart, logOutSuccess, logOutFailure,
  deleteUserAccountStart, deleteUserAccountSuccess, deleteUserAccountFailure,
} from "../../redux/user/userSlice";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase";
import AllBookings from "./AllBookings";
import AdminUpdateProfile from "./AdminUpdateProfile";
import AddPackages from "./AddPackages";
import AllPackages from "./AllPackages";
import AllUsers from "./AllUsers";
import Payments from "./Payments";
import RatingsReviews from "./RatingsReviews";
import History from "./History";
import DashboardOverview from "./DashboardOverview";
import {
  FiGrid, FiHome, FiPackage, FiPlusSquare, FiUsers, FiCreditCard,
  FiStar, FiClock, FiUser, FiLogOut, FiTrash2, FiMenu, FiX, FiCamera,
} from "react-icons/fi";
import { FaPlane } from "react-icons/fa";
import defaultProfileImg from "../../assets/images/profile.png";

const NAV_ITEMS = [
  { id: 0, label: "Overview",       icon: <FiGrid size={18} /> },
  { id: 1, label: "Bookings",       icon: <FiHome size={18} /> },
  { id: 2, label: "Add Package",    icon: <FiPlusSquare size={18} /> },
  { id: 3, label: "All Packages",   icon: <FiPackage size={18} /> },
  { id: 4, label: "Users",          icon: <FiUsers size={18} /> },
  { id: 5, label: "Payments",       icon: <FiCreditCard size={18} /> },
  { id: 6, label: "Ratings",        icon: <FiStar size={18} /> },
  { id: 7, label: "History",        icon: <FiClock size={18} /> },
  { id: 8, label: "Edit Profile",   icon: <FiUser size={18} /> },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading } = useSelector((state) => state.user);

  const [profilePhoto, setProfilePhoto] = useState(undefined);
  const [photoPercentage, setPhotoPercentage] = useState(0);
  const [activePanelId, setActivePanelId] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "", email: "", address: "", phone: "", avatar: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleProfilePhoto = (photo) => {
    try {
      dispatch(updateUserStart());
      const storage = getStorage(app);
      const photoname = new Date().getTime() + photo.name.replace(/\s/g, "");
      const storageRef = ref(storage, `profile-photos/${photoname}`);
      const uploadTask = uploadBytesResumable(storageRef, photo);
      uploadTask.on("state_changed",
        (snapshot) => {
          setPhotoPercentage(Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        },
        (error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            const res = await fetch(`/api/user/update-profile-photo/${currentUser._id}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ avatar: downloadUrl }),
            });
            const data = await res.json();
            if (data?.success) {
              setFormData({ ...formData, avatar: downloadUrl });
              dispatch(updateUserSuccess(data?.user));
              setProfilePhoto(null);
              alert(data?.message);
            } else {
              dispatch(updateUserFailure(data?.message));
              alert(data?.message);
            }
          });
        }
      );
    } catch (error) { console.log(error); }
  };

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      if (!data?.success) { dispatch(logOutFailure(data?.message)); return; }
      dispatch(logOutSuccess());
      navigate("/login");
    } catch (error) { console.log(error); }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!confirm("Are you sure? This account will be permanently deleted!")) return;
    try {
      dispatch(deleteUserAccountStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data?.success) { dispatch(deleteUserAccountFailure(data?.message)); return; }
      dispatch(deleteUserAccountSuccess());
      alert(data?.message);
    } catch (error) { console.log(error); }
  };

  const activeLabel = NAV_ITEMS.find((n) => n.id === activePanelId)?.label || "";

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/60">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          <FaPlane className="text-white -rotate-45" size={16} />
        </div>
        <div>
          <p className="font-extrabold text-base text-white leading-none">Tripify</p>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Admin Panel</p>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center py-6 px-4 border-b border-slate-700/60">
        <div className="relative group cursor-pointer" onClick={() => fileRef.current.click()}>
          <img
            src={(profilePhoto && URL.createObjectURL(profilePhoto)) || formData.avatar || defaultProfileImg}
            alt="Admin"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-600 group-hover:border-indigo-400 transition-all"
          />
          <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FiCamera size={18} className="text-white" />
          </div>
        </div>
        <input type="file" name="photo" id="photo" hidden ref={fileRef} accept="image/*"
          onChange={(e) => setProfilePhoto(e.target.files[0])} />
        {profilePhoto ? (
          <button onClick={() => handleProfilePhoto(profilePhoto)}
            className="mt-2 px-3 py-1 text-xs rounded-lg font-semibold text-white"
            style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }}>
            {loading ? `Uploading ${photoPercentage}%` : "Upload Photo"}
          </button>
        ) : (
          <>
            <p className="mt-2 text-sm font-bold text-white truncate max-w-[140px]">{currentUser?.username}</p>
            <span className="text-[10px] mt-0.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold uppercase tracking-wider">
              Administrator
            </span>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest px-3 mb-3">Navigation</p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <li key={id}>
              <button
                onClick={() => { setActivePanelId(id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activePanelId === id
                    ? "text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
                style={activePanelId === id
                  ? { background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }
                  : {}}
              >
                <span className={activePanelId === id ? "text-white" : "text-slate-500"}>{icon}</span>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-slate-700/60 space-y-2">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
          <FiLogOut size={16} /> Sign Out
        </button>
        <button onClick={handleDeleteAccount}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-800 hover:text-red-400 transition-all">
          <FiTrash2 size={16} /> Delete Account
        </button>
      </div>
    </aside>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-500 font-semibold">Please log in first.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 flex-shrink-0 h-full">
        <div className="w-full h-full overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 z-10 overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            {/* Hamburger (mobile) */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              onClick={() => setSidebarOpen(true)}>
              <FiMenu size={22} />
            </button>
            <div>
              <h1 className="font-extrabold text-slate-800 text-xl leading-none">{activeLabel}</h1>
              <p className="text-slate-400 text-xs mt-0.5">Tripify Admin Panel</p>
            </div>
          </div>

          {/* Admin quick info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-800">{currentUser.username}</p>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
            </div>
            <img
              src={formData.avatar || defaultProfileImg}
              alt="Admin"
              className="w-9 h-9 rounded-xl object-cover border-2 border-indigo-200"
            />
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {activePanelId === 0 && <DashboardOverview />}
            {activePanelId === 1 && <AllBookings />}
            {activePanelId === 2 && <AddPackages />}
            {activePanelId === 3 && <AllPackages />}
            {activePanelId === 4 && <AllUsers />}
            {activePanelId === 5 && <Payments />}
            {activePanelId === 6 && <RatingsReviews />}
            {activePanelId === 7 && <History />}
            {activePanelId === 8 && <AdminUpdateProfile />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
