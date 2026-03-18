import { Rating } from "@mui/material";
import React, { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const RatingCard = ({ packageRatings }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <>
      {packageRatings &&
        packageRatings.map((rating, i) => {
          const isExpanded = expandedIndex === i;

          const reviewText =
            rating.review && rating.review !== ""
              ? rating.review
              : rating.rating < 3
              ? "Not Bad"
              : "Good";

          const isLong = reviewText.length > 90;

          return (
            <div
              key={i}
              className="w-full bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col gap-3"
            >
              {/* User Info */}
              <div className="flex items-center gap-3">
                <img
                  src={rating.userProfileImg}
                  alt={rating.username}
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
                <p className="font-semibold text-gray-800">
                  {rating.username}
                </p>
              </div>

              {/* Rating */}
              <Rating
                value={rating.rating || 0}
                readOnly
                size="small"
                precision={0.1}
              />

              {/* Review Text */}
              <p className="text-gray-700 text-sm leading-relaxed">
                {isLong && !isExpanded
                  ? reviewText.substring(0, 90) + "..."
                  : reviewText}
              </p>

              {/* Toggle Button */}
              {isLong && (
                <button
                  onClick={() =>
                    setExpandedIndex(isExpanded ? null : i)
                  }
                  className="flex items-center gap-2 text-green-700 font-medium text-sm hover:underline w-max"
                >
                  {isExpanded ? (
                    <>
                      Less <FaArrowUp />
                    </>
                  ) : (
                    <>
                      More <FaArrowDown />
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
    </>
  );
};

export default RatingCard;