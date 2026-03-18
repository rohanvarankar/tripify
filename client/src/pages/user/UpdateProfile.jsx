import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserStart, updateUserSuccess, updateUserFailure, updatePassStart, updatePassSuccess, updatePassFailure } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { FiSave, FiLock } from "react-icons/fi";

const UpdateProfile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("details"); // 'details' | 'password'
  const [formData, setFormData] = useState({ username: "", email: "", address: "", phone: "", avatar: "" });
  const [updatePassword, setUpdatePassword] = useState({ oldpassword: "", newpassword: "" });

  useEffect(() => {
    if (currentUser) {
      setFormData({ username: currentUser.username, email: currentUser.email, address: currentUser.address, phone: currentUser.phone, avatar: currentUser.avatar });
    }
  }, [currentUser]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handlePass = (e) => setUpdatePassword({ ...updatePassword, [e.target.id]: e.target.value });

  const updateUserDetails = async (e) => {
    e.preventDefault();
    if (currentUser.username === formData.username && currentUser.email === formData.email && currentUser.address === formData.address && currentUser.phone === formData.phone) {
      return alert("No changes were made to update.");
    }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!data.success && res.status !== 201 && res.status !== 200) {
        dispatch(updateUserFailure(data?.message));
        alert("Session Ended! Please login again");
        navigate("/login"); return;
      }
      dispatch(updateUserSuccess(data?.user));
      alert(data?.message || "Profile updated successfully!");
    } catch (error) { console.log(error); }
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();
    if (!updatePassword.oldpassword || !updatePassword.newpassword) return alert("Please enter valid credentials.");
    if (updatePassword.oldpassword === updatePassword.newpassword) return alert("New password cannot be the same as the old one!");

    try {
      dispatch(updatePassStart());
      const res = await fetch(`/api/user/update-password/${currentUser._id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatePassword) });
      const data = await res.json();
      if (!data.success && res.status !== 201 && res.status !== 200) {
        dispatch(updatePassFailure(data?.message));
        alert("Session Ended! Please login again");
        navigate("/login"); return;
      }
      dispatch(updatePassSuccess());
      alert(data?.message || "Password updated successfully!");
      setUpdatePassword({ oldpassword: "", newpassword: "" });
    } catch (error) { console.log(error); }
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Sub-Tabs for settings */}
      <div className="flex items-center gap-6 border-b border-slate-100 mb-8 overflow-x-auto pb-1">
        <button onClick={() => setActiveTab('details')} className={`text-sm font-extrabold tracking-wide uppercase px-2 py-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'details' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          Personal Details
        </button>
        <button onClick={() => setActiveTab('password')} className={`text-sm font-extrabold tracking-wide uppercase px-2 py-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'password' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          Security & Password
        </button>
      </div>

      {activeTab === 'details' && (
        <form onSubmit={updateUserDetails} className="space-y-6 max-w-2xl">
           <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-1.5 flex flex-col">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Username</label>
               <input id="username" type="text" value={formData.username} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" />
             </div>
             <div className="space-y-1.5 flex flex-col">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
               <input id="email" type="email" value={formData.email} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" />
             </div>
             <div className="space-y-1.5 flex flex-col">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Phone Number</label>
               <input id="phone" type="text" value={formData.phone} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" />
             </div>
           </div>

           <div className="space-y-1.5 flex flex-col">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Billing Address</label>
             <textarea id="address" rows={3} maxLength={200} value={formData.address} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none" />
           </div>

           <div className="pt-4 border-t border-slate-100 flex justify-end">
             <button type="submit" disabled={loading} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:bg-slate-300">
               <FiSave /> {loading ? "Saving..." : "Save Changes"}
             </button>
           </div>
        </form>
      )}

      {activeTab === 'password' && (
        <form onSubmit={updateUserPassword} className="space-y-6 max-w-lg">
           <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">
             <h4 className="flex items-center gap-2 font-bold text-orange-800 mb-1"><FiLock/> Password Standards</h4>
             <p className="text-sm text-orange-700/80">Please choose a strong password using at least 8 characters. Do not reuse old passwords.</p>
           </div>

           <div className="space-y-1.5 flex flex-col">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Current Password</label>
             <input id="oldpassword" type="password" value={updatePassword.oldpassword} onChange={handlePass} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors placeholder:text-slate-400" placeholder="••••••••" />
           </div>
           <div className="space-y-1.5 flex flex-col">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">New Password</label>
             <input id="newpassword" type="password" value={updatePassword.newpassword} onChange={handlePass} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors placeholder:text-slate-400" placeholder="••••••••" />
           </div>

           <div className="pt-4 border-t border-slate-100 flex justify-end">
             <button type="submit" disabled={loading} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:bg-slate-300">
               <FiLock /> {loading ? "Updating..." : "Update Password"}
             </button>
           </div>
        </form>
      )}
    </div>
  );
};
export default UpdateProfile;