import { Rating } from "@mui/material";
import React from "react";
import { FaClock, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const PackageCard = ({ packageData }) => {
  return (
    <Link to={`/package/${packageData._id}`} className="group block h-full">
      <div className="h-full bg-white rounded-3xl shadow-card hover:shadow-2xl hover:shadow-brand/10 transition-all duration-400 overflow-hidden flex flex-col border border-slate-100 group-hover:-translate-y-2">

        {/* Image */}
        <div className="w-full h-[230px] relative overflow-hidden">
          <img
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            src={packageData.packageImages[0]}
            alt={packageData.packageName}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />

          {/* Destination badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-brand shadow-sm border border-white/50">
            <FaMapMarkerAlt size={10} />
            {packageData.packageDestination}
          </div>

          {/* Offer badge */}
          {packageData.offer && (
            <div className="absolute top-3 right-3">
              <div className="relative">
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full bg-orange-400 animate-pulse-ring" />
                <span className="relative z-10 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  🔥 Sale
                </span>
              </div>
            </div>
          )}

          {/* Bottom overlay: days */}
          {(+packageData.packageDays > 0 || +packageData.packageNights > 0) && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-full border border-white/10">
              <FaClock size={10} className="text-brand-300" />
              {+packageData.packageDays > 0 && `${packageData.packageDays}D`}
              {+packageData.packageDays > 0 && +packageData.packageNights > 0 && " / "}
              {+packageData.packageNights > 0 && `${packageData.packageNights}N`}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 gap-2">
          <h3 className="font-extrabold text-lg text-slate-800 capitalize line-clamp-2 leading-snug group-hover:text-brand transition-colors duration-300">
            {packageData.packageName}
          </h3>

          <div className="flex-1" />

          {/* Bottom: rating + price */}
          <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
            <div className="flex flex-col">
              {packageData.packageTotalRatings > 0 ? (
                <>
                  <div className="flex items-center gap-1">
                    <Rating
                      value={packageData.packageRating}
                      size="small"
                      readOnly
                      precision={0.1}
                      sx={{ color: "#f59e0b" }}
                    />
                    <span className="text-xs font-bold text-slate-700">
                      {packageData.packageRating?.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 ml-0.5">
                    ({packageData.packageTotalRatings} reviews)
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-brand bg-brand-50 px-2 py-1 rounded-full font-semibold">
                  <FaStar size={10} /> New
                </span>
              )}
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">From</span>
              {packageData.offer && packageData.packageDiscountPrice ? (
                <div className="flex items-center gap-2">
                  <span className="line-through text-slate-400 text-sm">
                    ${packageData.packagePrice}
                  </span>
                  <span className="font-extrabold text-xl text-transparent bg-clip-text bg-brand-gradient">
                    ${packageData.packageDiscountPrice}
                  </span>
                </div>
              ) : (
                <span className="font-extrabold text-xl text-slate-800 group-hover:text-brand transition-colors">
                  ${packageData.packagePrice}
                </span>
              )}
            </div>
          </div>

          {/* View button — appears on hover */}
          <div className="overflow-hidden max-h-0 group-hover:max-h-12 transition-all duration-300">
            <div className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 bg-brand-gradient text-white text-sm font-semibold rounded-xl shadow-brand">
              View Package <FiArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;