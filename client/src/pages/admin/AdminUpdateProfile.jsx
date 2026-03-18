import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserStart, updateUserSuccess, updateUserFailure, updatePassStart, updatePassSuccess, updatePassFailure } from "../../redux/user/userSlice";
import { FiUser, FiLock, FiSave, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AdminUpdateProfile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ username: "", address: "", phone: "", avatar: "" });
  const [updatePassword, setUpdatePassword] = useState({ oldpassword: "", newpassword: "" });

  useEffect(() => {
    if (currentUser) {
      setFormData({ username: currentUser.username, address: currentUser.address, phone: currentUser.phone, avatar: currentUser.avatar });
    }
  }, [currentUser]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handlePass = (e) => setUpdatePassword({ ...updatePassword, [e.target.id]: e.target.value });

  const updateUserDetails = async (e) => {
    e.preventDefault();
    if (currentUser.username === formData.username && currentUser.address === formData.address && currentUser.phone === formData.phone) {
      return alert("Change at least 1 field to update details");
    }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success && res.status !== 201 && res.status !== 200) {
        dispatch(updateUserSuccess()); dispatch(updateUserFailure(data?.message));
        alert("Session Ended! Please login again"); navigate("/login"); return;
      }
      alert(data?.message);
      dispatch(updateUserSuccess(data?.user));
    } catch (error) { console.log(error); }
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();
    if (!updatePassword.oldpassword || !updatePassword.newpassword) return alert("Enter valid passwords");
    if (updatePassword.oldpassword === updatePassword.newpassword) return alert("New password can't be the same!");
    try {
      dispatch(updatePassStart());
      const res = await fetch(`/api/user/update-password/${currentUser._id}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePassword),
      });
      const data = await res.json();
      if (!data.success && res.status !== 201 && res.status !== 200) {
        dispatch(updateUserSuccess()); dispatch(updatePassFailure(data?.message));
        alert("Session Ended! Please login again"); navigate("/login"); return;
      }
      dispatch(updatePassSuccess());
      alert(data?.message);
      setUpdatePassword({ oldpassword: "", newpassword: "" });
    } catch (error) { console.log(error); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 w-fit">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          <FiUser size={22} />
        </div>
        <div>
          <p className="text-2xl font-extrabold text-slate-800">Admin Settings</p>
          <p className="text-slate-400 text-sm">Manage profile and security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <FiUser className="text-indigo-500" size={20} />
            <h3 className="font-bold text-slate-800 text-lg">Profile Details</h3>
          </div>
          <form className="space-y-4" onSubmit={updateUserDetails}>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Username</label>
              <input type="text" id="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Phone</label>
              <input type="text" id="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Address</label>
              <textarea id="address" value={formData.address} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-70 mt-2">
              <FiSave size={18} /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Password Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-fit">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <FiLock className="text-indigo-500" size={20} />
            <h3 className="font-bold text-slate-800 text-lg">Change Password</h3>
          </div>
          <div className="bg-orange-50 border border-orange-100 text-orange-700 p-3 rounded-xl flex gap-3 text-sm mb-5">
            <FiAlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p>Ensure your account is using a long, random password to stay secure.</p>
          </div>
          <form className="space-y-4" onSubmit={updateUserPassword}>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Current Password</label>
              <input type="password" id="oldpassword" value={updatePassword.oldpassword} onChange={handlePass} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">New Password</label>
              <input type="password" id="newpassword" value={updatePassword.newpassword} onChange={handlePass} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors disabled:opacity-70 mt-2">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateProfile;
