import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import FooterLogin from "./FooterLogin";

const LoginGuest = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ userId, email });
  };

  return (
    <div className="relative min-h-screen lg:h-screen bg-[#f6f9fc] overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -right-6 -top-67 translate-x-10 w-219 h-145 rounded-full bg-orange-400/90 blur-xl" />
        <div className="absolute right-5 -top-77.5 w-201.5 h-146 rounded-full bg-white blur-xl" />
      </div>
      <div className="relative z-10 h-full max-w-[92%] mx-auto flex flex-col">
        <div className="flex flex-1 items-center 2xl:mt-10">
          <div className="flex w-full flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src="/login/login-hero.png"
                alt="Tracking visual"
                className="max-w-lg w-full object-contain"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                style={{ userSelect: "none" }}
              />
            </div>
            <div className="w-full lg:w-1/2 max-w-md">
              <img
                src="/logo.png"
                alt="Katsana"
                className="w-64 mb-4 mx-auto"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                style={{ userSelect: "none" }}
              />
              <button
                onClick={() => navigate(-1)}
                className="mb-4 px-2 py-1.5 cursor-pointer text-xs inline-flex items-center gap-2 bg-orange-400 rounded-[5px] text-white font-medium"
              >
                <span className="bg-white text-orange-400 rounded-[5px]">
                  <IoIosArrowBack size={16} />
                </span>{" "}
                Back
              </button>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="USERID123"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    type="email"
                    placeholder="username@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 cursor-pointer rounded-xl text-white font-semibold bg-linear-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-400 transition"
                  >
                    Submit
                  </button>
                </div>
              </form>
              <div className="mt-4 flex justify-center gap-4">
                <div className="bg-white p-2 rounded-md">
                  <img src="/icons/google-play.svg" className="h-9" />
                </div>
                <div className="bg-white p-2 rounded-md">
                  <img src="/icons/app-store.svg" className="h-9" />
                </div>
              </div>
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
        <FooterLogin />
      </div>
    </div>
  );
};

export default LoginGuest;
