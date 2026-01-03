import React from 'react';

const FooterLogin = () => {
    return (
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
            A Product of Katsana Technologies Ltd. © {new Date().getFullYear()}
          </div>
          <div>
            Don’t have a tracker yet?{" "}
            <a href="/get-tracker" className="text-orange-500 font-semibold">
              Click here
            </a>
          </div>
        </div>
      </footer>
    );
};

export default FooterLogin;