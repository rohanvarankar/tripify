import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import RatingCard from "./RatingCard";

const RatingsPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [packageRatings, setPackageRatings] = useState([]);
  const [showRatingStars, setShowRatingStars] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);

  const getRatings = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/rating/get-ratings/${params.id}/999999999999`
      );
      const res2 = await fetch(
        `/api/rating/average-rating/${params.id}`
      );

      const data = await res.json();
      const data2 = await res2.json();

      if (data && data2) {
        setPackageRatings(data);
        setShowRatingStars(data2.rating);
        setTotalRatings(data2.totalRatings);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) getRatings();
  }, [params.id]);

  return (
    <div className="w-full min-h-screen bg-gray-100 px-4 py-8">

      <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl shadow-md p-6">

        {loading && (
          <h1 className="text-center text-xl font-semibold text-gray-700">
            Loading...
          </h1>
        )}

        {!loading && packageRatings.length === 0 && (
          <h1 className="text-center text-xl font-semibold text-gray-700">
            No Ratings Found!
          </h1>
        )}

        {!loading && packageRatings.length > 0 && (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-green-700">
                  Overall Rating
                </h1>
                <Rating
                  size="large"
                  value={showRatingStars || 0}
                  readOnly
                  precision={0.1}
                />
                <span className="text-gray-600 font-medium">
                  ({totalRatings})
                </span>
              </div>

              <button
                onClick={() => navigate(`/package/${params?.id}`)}
                className="bg-slate-700 hover:bg-slate-800 text-white px-5 py-2 rounded-lg transition"
              >
                Back to Package
              </button>

            </div>

            <hr className="mb-6 border-gray-200" />

            {/* Ratings Grid */}
            <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
              <RatingCard packageRatings={packageRatings} />
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default RatingsPage;