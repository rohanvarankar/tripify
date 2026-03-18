import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiClock, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";

const Booking = () => {
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [bookingData, setBookingData] = useState({
    totalPrice: 0,
    packageDetails: null,
    buyer: null,
    persons: 1,
    date: "",
  });
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/package/get-package-data/${params?.packageId}`);
      const data = await res.json();
      if (data?.success) setPackageData(data.packageData);
      else setError(data?.message || "Something went wrong!");
    } catch (error) { console.log(error); } finally { setLoading(false); }
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get(`/api/package/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) { console.log(error); }
  };

  useEffect(() => { getToken(); }, [currentUser]);

  const handleBookPackage = async () => {
    if (!bookingData.packageDetails || !bookingData.buyer || bookingData.totalPrice <= 0 || bookingData.persons <= 0 || !bookingData.date) {
      return alert("All fields are required! Please select a valid date.");
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/booking/book-package/${params?.packageId}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (data?.success) {
        alert(data?.message);
        navigate(`/profile/${currentUser?.user_role === 1 ? "admin" : "user"}`);
      } else alert(data?.message);
    } catch (error) { console.log(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (params?.packageId) getPackageData();
    let date = new Date().toISOString().substring(0, 10);
    let d = date.substring(0, 8) + (parseInt(date.substring(8)) + 1);
    setCurrentDate(d);
  }, [params?.packageId]);

  useEffect(() => {
    if (packageData && params?.packageId) {
      setBookingData((prev) => ({
        ...prev,
        packageDetails: params?.packageId,
        buyer: currentUser?._id,
        totalPrice: (packageData?.packageOffer ? packageData?.packageDiscountPrice : packageData?.packagePrice) * prev.persons,
      }));
    }
  }, [packageData, params]);

  const updatePersons = (change) => {
    const newPersons = bookingData.persons + change;
    if (newPersons >= 1 && newPersons <= 10) {
      setBookingData({
        ...bookingData,
        persons: newPersons,
        totalPrice: (packageData?.packageOffer ? packageData?.packageDiscountPrice : packageData?.packagePrice) * newPersons,
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans relative">
      <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3 shadow-sm flex items-center justify-between">
        <button onClick={() => navigate(-1) || navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><FiArrowLeft/></div> Back
        </button>
        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Secure Checkout</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Left Col: User Details & Payment */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-1.5 h-6 rounded-full bg-indigo-500"></span> Passenger Information</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none" value={currentUser.username} disabled />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none" value={currentUser.email} disabled />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Phone</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none" value={currentUser.phone} disabled />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Billing Address</label>
                <textarea rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none resize-none" value={currentUser.address} disabled />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
             <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-1.5 h-6 rounded-full bg-emerald-500"></span> Payment Details</h2>
             {clientToken ? (
                <div className="payment-wrapper">
                  <DropIn 
                    options={{ authorization: clientToken, paypal: { flow: "vault" } }} 
                    onInstance={(instance) => setInstance(instance)} 
                  />
                  <style>{`
                    .braintree-sheet { border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: none; }
                    .braintree-toggle { border-radius: 12px; }
                  `}</style>
                </div>
             ) : (
                <div className="py-10 text-center text-slate-500 font-semibold animate-pulse">Initializing Secure Gateway...</div>
             )}
          </div>
        </div>

        {/* Right Col: Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
            {packageData ? (
              <>
                <div className="h-48 relative">
                  <img src={packageData.packageImages[0]} alt="pkg" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-5">
                    <p className="text-white font-extrabold text-xl leading-tight line-clamp-2">{packageData.packageName}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-4 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-200">
                    <FiMapPin className="text-indigo-500" /> {packageData.packageDestination}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Travel Date</label>
                      <input type="date" min={currentDate} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-700 bg-white" onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Number of Travelers</label>
                      <div className="flex items-center justify-between border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <button onClick={() => updatePersons(-1)} className="px-5 py-2.5 hover:bg-slate-100 text-slate-600 font-bold transition-colors">-</button>
                        <span className="font-extrabold text-slate-800">{bookingData.persons}</span>
                        <button onClick={() => updatePersons(1)} className="px-5 py-2.5 hover:bg-slate-100 text-slate-600 font-bold transition-colors">+</button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-5 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-500">Base Price x {bookingData.persons}</span>
                       <span className="font-semibold text-slate-700">${(packageData.packagePrice * bookingData.persons).toLocaleString()}</span>
                    </div>
                    {packageData.packageOffer && (
                      <div className="flex justify-between items-center text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg">
                        <span>Discount Applied</span>
                        <span>-${((packageData.packagePrice - packageData.packageDiscountPrice) * bookingData.persons).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-end pt-3">
                      <span className="text-sm font-bold text-slate-800">Total Due</span>
                      <span className="text-3xl font-black text-indigo-600">${bookingData.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleBookPackage}
                    disabled={loading || !instance || !bookingData.date || !currentUser.address}
                    className="w-full mt-6 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all hover:shadow-lg active:scale-[0.98]"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><FiCheckCircle size={18}/> Confirm & Pay</>}
                  </button>
                </div>
              </>
            ) : (
               <div className="h-48 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Booking;
