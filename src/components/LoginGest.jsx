import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const LoginGest = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: guest submit logic here
    console.log({ userId, email });
  };

  return (
    <div className="relative min-h-screen lg:h-screen bg-[#f6f9fc] overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans">
      {/* ===== Background Shapes ===== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute right-[-24px] top-[-268px] translate-x-10 w-[876px] h-[580px] rounded-full bg-orange-400/90 blur-xl" />
        <div className="absolute right-[20px] top-[-310px] w-[806px] h-[584px] rounded-full bg-white blur-xl" />
      </div>

      {/* ===== Main Layout ===== */}
      <div className="relative z-10 h-full max-w-[92%] mx-auto flex flex-col">
        {/* ===== Top Section ===== */}
        <div className="flex flex-1 items-center">
          <div className="flex w-full flex-col lg:flex-row items-center gap-16">
            {/* Part 1: Image */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src="/login-hero.png"
                alt="Tracking visual"
                className="max-w-lg w-full object-contain"
              />
            </div>

            {/* Part 2: Guest Login */}
            <div className="w-full lg:w-1/2 max-w-md">
              <img
                src="/katsana-logo.png"
                alt="Katsana"
                className="w-64 mb-4 mx-auto"
              />

              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="mb-4 px-1 py-[0.5px] inline-flex items-center gap-2 bg-orange-400 rounded-[5px] text-white font-medium hover:underline"
              >
                <span className="bg-white text-orange-400 rounded-[5px] ">
                  <IoIosArrowBack size={16} />
                </span>{" "}
                Back
              </button>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* User ID */}
                  <input
                    type="text"
                    placeholder="USERID123"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />

                  {/* Email */}
                  <input
                    type="email"
                    placeholder="username@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-white font-semibold bg-linear-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-400 transition"
                  >
                    Submit
                  </button>
                </div>
              </form>

              {/* Stores */}
              <div className="mt-4 flex justify-center gap-4">
                <div className="bg-white p-2 rounded-md">
                  <img src="/icons/google-play.svg" className="h-9" />
                </div>
                <div className="bg-white p-2 rounded-md">
                  <img src="/icons/app-store.svg" className="h-9" />
                </div>
              </div>

              {/* Support */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 font-semibold">
                  Call for any assistance
                </p>
                <div className="flex justify-center items-center gap-2">
                  <img src="/icons/loginSupport.svg" className="h-7" />
                  <span className="text-gray-800 font-bold">09600000000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Footer ===== */}
        <footer className="py-4 bg-[#eef6fb]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-6">
              <img src="/katsana-logo.png" className="h-7" />
              <div className="flex gap-6">
                <a href="/terms">Terms</a>
                <a href="/company">Company</a>
                <a href="/refund">Refund</a>
              </div>
            </div>

            <div>
              A Product of Katsana Technologies Ltd. ©{" "}
              {new Date().getFullYear()}
            </div>

            <div>
              Don’t have a tracker yet?{" "}
              <a href="/get-tracker" className="text-orange-500 font-semibold">
                Click here
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoginGest;
