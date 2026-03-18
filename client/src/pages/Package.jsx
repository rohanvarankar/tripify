import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css/bundle";
import { FiArrowLeft, FiMapPin, FiClock, FiActivity, FiCoffee, FiMap, FiCheckCircle } from "react-icons/fi";
import { FaBed, FaStar } from "react-icons/fa";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import RatingCard from "./RatingCard";

const Package = () => {
  SwiperCore.use([Navigation, Pagination, Autoplay, EffectFade]);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();

  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [packageRatings, setPackageRatings] = useState([]);
  const [ratingGiven, setRatingGiven] = useState(false);
  const [ratingsData, setRatingsData] = useState({
    rating: 0,
    review: "",
    packageId: params?.id,
    userRef: currentUser?._id,
    username: currentUser?.username,
    userProfileImg: currentUser?.avatar,
  });

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/package/get-package-data/${params?.id}`);
      const data = await res.json();
      if (data?.success) setPackageData(data?.packageData);
      else setError(true);
    } catch (error) { console.log(error); } finally { setLoading(false); }
  };

  const getRatings = async () => {
    try {
      const res = await fetch(`/api/rating/get-ratings/${params.id}/4`);
      const data = await res.json();
      if (data) setPackageRatings(data);
    } catch (error) { console.log(error); }
  };

  const checkRatingGiven = async () => {
    try {
      const res = await fetch(`/api/rating/rating-given/${currentUser?._id}/${params?.id}`);
      const data = await res.json();
      setRatingGiven(data?.given);
    } catch (error) { console.log(error); }
  };

  const giveRating = async () => {
    if (ratingGiven) return alert("You already submitted your rating!");
    if (!ratingsData.rating && !ratingsData.review) return alert("Fields are required!");

    try {
      setLoading(true);
      const res = await fetch("/api/rating/give-rating", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ratingsData)
      });
      const data = await res.json();
      if (data?.success) {
        alert(data?.message);
        getPackageData(); getRatings(); checkRatingGiven();
      }
    } catch (error) { console.log(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (params.id) { getPackageData(); getRatings(); }
    if (currentUser) { checkRatingGiven(); }
  }, [params.id, currentUser]);

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Absolute Back Button */}
      <div className="fixed top-0 w-full z-50 px-4 py-4 md:px-8 flex justify-between items-center pointer-events-none">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/40 text-white rounded-full shadow-lg shadow-black/10 hover:bg-white/40 hover:scale-105 transition-all pointer-events-auto">
          <FiArrowLeft size={22} />
        </button>
      </div>

      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-slate-50 z-40">
          <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}

      {error ? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <h2 className="text-3xl font-extrabold text-slate-800">Package Not Found</h2>
          <button onClick={() => navigate("/")} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1">Return Home</button>
        </div>
      ) : packageData && (
        <div className="relative w-full">
          
          {/* Panoramic Hero Gallery */}
          <div className="w-full h-[55vh] md:h-[70vh] relative z-0">
            <Swiper 
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              navigation pagination={{ clickable: true, dynamicBullets: true }} 
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              effect="fade"
              className="w-full h-full package-hero-swiper"
            >
              {packageData.packageImages.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="w-full h-full relative">
                    <img src={img} alt="Destination" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Overlapping Content Container */}
          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 -mt-16 md:-mt-32">
            
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Left Column (Main Content) */}
              <div className="w-full lg:w-2/3 bg-white rounded-t-3xl rounded-b-xl shadow-2xl p-6 md:p-10 border border-slate-100">
                
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold tracking-wide border border-indigo-200">
                    <FiMapPin size={16} /> {packageData.packageDestination}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-bold tracking-wide border border-amber-200">
                    <FiClock size={16} /> {packageData.packageDays} Days / {packageData.packageNights} Nights
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 leading-[1.15] capitalize tracking-tight">
                  {packageData.packageName}
                </h1>

                {/* Main Rating */}
                <div className="flex items-center gap-3 mb-8 bg-slate-50 w-fit px-4 py-2 rounded-xl border border-slate-100">
                  <div className="flex gap-0.5 text-amber-500">
                     <Rating value={packageData.packageRating} readOnly precision={0.1} size="medium" />
                  </div>
                  <span className="font-extrabold text-slate-800">{packageData.packageRating.toFixed(1)}</span>
                  <span className="text-sm font-semibold text-slate-500 underline decoration-slate-300">({packageData.packageTotalRatings} verified reviews)</span>
                </div>

                <hr className="border-slate-100 mb-8" />

                {/* Description */}
                <div className="mb-10">
                  <h3 className="text-2xl font-extrabold text-slate-800 mb-4">Overview</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{packageData.packageDescription}</p>
                </div>

                {/* Features Grid */}
                <div className="mb-10">
                  <h3 className="text-2xl font-extrabold text-slate-800 mb-5">What's Included</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <FaBed className="text-indigo-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Accommodation</p>
                        <p className="font-bold text-slate-700 leading-snug">{packageData.packageAccommodation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-pink-50/50 border border-pink-100/50 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                        <FiMap className="text-pink-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-pink-400 uppercase tracking-widest mb-1">Transport</p>
                        <p className="font-bold text-slate-700 leading-snug">{packageData.packageTransportation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-50/50 border border-amber-100/50 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <FiCoffee className="text-amber-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-1">Meals</p>
                        <p className="font-bold text-slate-700 leading-snug">{packageData.packageMeals}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <FiActivity className="text-emerald-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">Activities</p>
                        <p className="font-bold text-slate-700 leading-snug">{packageData.packageActivities}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100 mb-10" />

                {/* Ratings Section */}
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center justify-between">
                     Traveler Reviews
                     {packageRatings.length > 0 && <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{packageRatings.length} displayed</span>}
                  </h3>

                  {!ratingGiven && currentUser && (
                    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 shadow-inner border border-slate-200 mb-10">
                      <h4 className="font-extrabold text-slate-800 text-lg mb-2">Rate your experience</h4>
                      <p className="text-sm text-slate-500 mb-4">How was your trip? Let others know!</p>
                      <Rating value={ratingsData.rating} size="large" onChange={(e, val) => setRatingsData({ ...ratingsData, rating: val })} className="mb-4 text-brand" />
                      <textarea rows={3} className="w-full p-4 border border-slate-300 rounded-xl bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 transition-all resize-none shadow-sm" placeholder="Write your awesome review..." value={ratingsData.review} onChange={(e) => setRatingsData({ ...ratingsData, review: e.target.value })} />
                      <button onClick={giveRating} disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg active:scale-95">Post Review</button>
                    </div>
                  )}

                  {packageRatings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <RatingCard packageRatings={packageRatings} />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                      <FaStar className="text-slate-300 text-4xl mx-auto mb-3" />
                      <p className="font-bold text-lg">No reviews yet.</p>
                      <p className="text-sm">Be the first to share your experience!</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column (Sticky Pricing Card) */}
              <div className="w-full lg:w-1/3 pt-0 lg:pt-0 sticky top-24 z-30">
                <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 md:p-8 border border-slate-100">
                  <div className="mb-6">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Total Price</p>
                    <div className="flex items-end gap-3 flex-wrap">
                      <span className="text-5xl font-black text-slate-800">${packageData.packageOffer ? packageData.packageDiscountPrice : packageData.packagePrice}</span>
                      <span className="text-lg font-bold text-slate-400 mb-1">/ person</span>
                    </div>
                    {packageData.packageOffer && (
                      <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-bold">
                        <span className="line-through text-red-600/60">${packageData.packagePrice}</span>
                        <span>Save ${packageData.packagePrice - packageData.packageDiscountPrice}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                       <FiCheckCircle className="text-emerald-500 shrink-0" size={18} /> Best Price Guarantee
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                       <FiCheckCircle className="text-emerald-500 shrink-0" size={18} /> Instant Booking Confirmation
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                       <FiCheckCircle className="text-emerald-500 shrink-0" size={18} /> Free Cancellation before 24h
                    </div>
                  </div>

                  <button
                    onClick={() => currentUser ? navigate(`/booking/${params.id}`) : navigate("/login")}
                    className="w-full bg-brand-gradient text-white px-8 py-5 rounded-2xl font-black text-lg hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                  >
                    🚀 Book Experience
                  </button>
                  <p className="text-center text-xs text-slate-400 font-semibold mt-4 text-balance">
                    You won't be charged yet. Dates and travelers securely selected in the next step.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Global override for Swiper buttons in Package view */}
      <style>{`
        .package-hero-swiper .swiper-button-next, .package-hero-swiper .swiper-button-prev { 
          color: white; 
          text-shadow: 0 4px 10px rgba(0,0,0,0.5); 
          transform: scale(0.8);
          background: rgba(0,0,0,0.2);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
        }
        .package-hero-swiper .swiper-button-next:hover, .package-hero-swiper .swiper-button-prev:hover {
          background: rgba(255,255,255,0.3);
        }
        .package-hero-swiper .swiper-pagination-bullet { background: white; opacity: 0.5; width: 10px; height: 10px; }
        .package-hero-swiper .swiper-pagination-bullet-active { background: white; opacity: 1; transform: scale(1.2); }
      `}</style>
    </div>
  );
};

export default Package;