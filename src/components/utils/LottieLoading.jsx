import Lottie from "lottie-react";
import loadingCar from "/public/Loading_car.json";

const LottieLoading = () => (
  <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
    <div className="w-[min(250px,80vw)] h-[min(250px,80vw)]">
      <Lottie
        animationData={loadingCar}
        loop={true}
        className="w-full h-full"
      />
    </div>
  </div>
);

export default LottieLoading;
