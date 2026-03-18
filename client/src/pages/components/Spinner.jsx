import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (count === 0) {
      navigate(`/${path}`, {
        state: location.pathname,
      });
      return;
    }

    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-50">

      <div className="bg-white shadow-md rounded-xl p-10 flex flex-col items-center gap-6 border border-gray-200">

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">
          Redirecting you in
          <span className="text-green-600 ml-2">{count}</span>
        </h1>

        <p className="text-gray-500 text-sm text-center">
          Please wait while we take you to the next page...
        </p>

      </div>

    </div>
  );
};

export default Spinner;