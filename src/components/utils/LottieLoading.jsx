import Lottie from "lottie-react";
import loadingCar from "../../../public/Loading_car.json";

const LottieLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div style={{ width: 230, height: 230 }}>
      <Lottie
        animationData={loadingCar}
        loop={true}
        style={{ width: 230, height: 230 }}
      />
    </div>
  </div>
);

export default LottieLoading;
