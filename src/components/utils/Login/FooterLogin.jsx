import React from "react";

const FooterLogin = () => {
  return (
    <footer className="py-4">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-6">
          <img
            src="/katsana-logo.png"
            className="h-7"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            style={{ userSelect: "none" }}
          />
          <div className="flex gap-6">
            <a href="/terms">Terms</a>
            <a href="/company">Company</a>
            <a href="/refund">Refund</a>
          </div>
        </div>
        <div>
          A Concern of{" "}
          <a
            href="http://www.mergergroupbd.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Merger Group
          </a>{" "}
          © {new Date().getFullYear()}
        </div>
        <div>
          Don’t have a tracker yet?{" "}
          <a
            href="https://www.katsana.com.bd"
            target="_blank"
            className="text-orange-500 font-semibold"
          >
            Click here
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterLogin;
