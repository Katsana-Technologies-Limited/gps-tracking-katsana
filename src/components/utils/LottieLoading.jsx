import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

const LottieLoading = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch("/Loading_car.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (mounted) setAnimationData(json);
      })
      .catch(() => {
        /* ignore */
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="w-[min(250px,80vw)] h-[min(250px,80vw)]">
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-full h-full"
          />
        ) : (
          <div className="text-center text-sm text-gray-600">Loading...</div>
        )}
      </div>
    </div>
  );
};

export default LottieLoading;
