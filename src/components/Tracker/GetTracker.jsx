import React from "react";

const GetTracker = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f9fc] font-sans">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <img src="/katsana-logo.png" alt="Katsana" className="w-40 mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Get Your Katsana Tracker
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Secure your vehicle and enjoy peace of mind with Katsana's advanced
          tracking solutions. Fill out the form below and our team will contact
          you soon.
        </p>
        <form className="w-full space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring focus:ring-orange-400"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring focus:ring-orange-400"
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring focus:ring-orange-400"
          />
          <textarea
            placeholder="Your Message (optional)"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring focus:ring-orange-400 resize-none"
            rows={3}
          />
          <button
            type="submit"
            className="w-full py-3 cursor-pointer rounded-xl text-white font-semibold bg-linear-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-400 transition"
          >
            Request Tracker
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Need help?{" "}
          <a href="tel:09600000000" className="text-orange-500 font-semibold">
            09600000000
          </a>
        </div>
      </div>
    </div>
  );
};

export default GetTracker;
