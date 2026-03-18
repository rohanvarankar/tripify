import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserStart, updateUserSuccess, updateUserFailure,
  logOutStart, logOutSuccess, logOutFailure,
  deleteUserAccountStart, deleteUserAccountSuccess, deleteUserAccountFailure,
} from "../redux/user/userSlice";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import MyBookings from "./user/MyBookings";
import UpdateProfile from "./user/UpdateProfile";
import MyHistory from "./user/MyHistory";
import { FiArrowLeft, FiCamera, FiLogOut, FiSettings, FiTrash2, FiClock, FiHome } from "react-icons/fi";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading } = useSelector((state) => state.user);

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPercentage, setPhotoPercentage] = useState(0);
  const [activePanelId, setActivePanelId] = useState(1);
  const [formData, setFormData] = useState({
    username: "", email: "", address: "", phone: "", avatar: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username, email: currentUser.email, address: currentUser.address, phone: currentUser.phone, avatar: currentUser.avatar,
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

      uploadTask.on(
        "state_changed",
        (snapshot) => setPhotoPercentage(Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
        (error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            const res = await fetch(`/api/user/update-profile-photo/${currentUser._id}`, {
              method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatar: downloadUrl }),
            });
            const data = await res.json();
            if (data?.success) {
              dispatch(updateUserSuccess(data.user));
              setProfilePhoto(null);
            } else dispatch(updateUserFailure(data?.message));
          });
        }
      );
    } catch (error) { console.log(error); }
  };

  const handleLogout = async () => {
    dispatch(logOutStart());
    const res = await fetch("/api/auth/logout");
    const data = await res.json();
    if (data?.success) { dispatch(logOutSuccess()); navigate("/login"); }
    else dispatch(logOutFailure(data?.message));
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? The account will be permanently deleted!")) return;
    dispatch(deleteUserAccountStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: "DELETE" });
    const data = await res.json();
    if (data?.success) { dispatch(deleteUserAccountSuccess()); navigate("/"); }
    else dispatch(deleteUserAccountFailure(data?.message));
  };

  const navItems = [
    { id: 1, label: "My Bookings", icon: <FiHome/> },
    { id: 2, label: "History Logs", icon: <FiClock/> },
    { id: 3, label: "Settings", icon: <FiSettings/> },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 relative pb-10">
      
      {/* Absolute top return bar */}
      <div className="absolute top-0 left-0 w-full z-10 px-6 py-5 flex self-start pointer-events-none">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/50 text-slate-700 hover:text-indigo-600 font-bold transition-all hover:shadow-lg hover:-translate-y-1 pointer-events-auto">
          <FiArrowLeft size={18} /> Return Home
        </button>
      </div>

      {currentUser ? (
        <div className="max-w-6xl mx-auto pt-24 px-4 flex flex-col lg:flex-row gap-6">
          
          {/* LEFT USER PANEL */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
              <div className="relative group w-32 h-32 mb-5">
                <img src={(profilePhoto && URL.createObjectURL(profilePhoto)) || formData.avatar} alt="Profile" className="w-full h-full object-cover rounded-full shadow-lg border-4 border-white z-10 relative" />
                <div onClick={() => fileRef.current.click()} className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
                  <FiCamera size={28} className="text-white" />
                </div>
                {/* Decorative pulse ring behind avatar */}
                <div className="absolute inset-0 bg-indigo-500 rounded-full scale-110 opacity-10 animate-pulse z-0 hidden md:block" />
              </div>
              <input type="file" hidden ref={fileRef} accept="image/*" onChange={(e) => setProfilePhoto(e.target.files[0])} />

              {profilePhoto && (
                <button onClick={() => handleProfilePhoto(profilePhoto)} disabled={loading} className="mb-6 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95">
                  {loading ? `Uploading ${photoPercentage}%` : "Save Photo"}
                </button>
              )}

              <h2 className="text-xl font-extrabold text-slate-800 mb-1">{currentUser.username}</h2>
              <p className="text-sm font-medium text-slate-500 mb-6 px-4 text-center truncate w-full">{currentUser.email}</p>

              <div className="w-full space-y-2 border-t border-slate-100 pt-6 mb-6">
                {navItems.map(item => (
                  <button key={item.id} onClick={() => setActivePanelId(item.id)} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all ${activePanelId === item.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 translate-x-1' : 'text-slate-600 hover:bg-slate-50 border border-transparent blur-0'}`}>
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>

              <div className="w-full flex justify-between pt-4 border-t border-slate-100">
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                  <FiLogOut /> Logout
                </button>
                <button onClick={handleDeleteAccount} className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT PANEL */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[600px]">
            <div className="p-6 md:p-8">
              {activePanelId === 1 && <MyBookings />}
              {activePanelId === 2 && <MyHistory />}
              {activePanelId === 3 && <UpdateProfile />}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Please login to view profile</h2>
          <button onClick={() => navigate('/login')} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Go to Login</button>
        </div>
      )}
    </div>
  );
};
export default Profile;