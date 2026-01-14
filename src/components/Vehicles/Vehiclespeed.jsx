import React, { useEffect, useState } from "react";
// { speed = 0 }
const Speedometer = ({ speed = 0 }) => {
  // const [speed, setSpeed] = useState(0);

  // প্রতি ১ সেকেন্ড পরপর র‍্যান্ডম স্পিড জেনারেট করার জন্য useEffect
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const randomSpeed = Math.floor(Math.random() * 181); // 0 থেকে 180
  //     setSpeed(randomSpeed);
  //   }, 1000); // 1000ms = 1 second

  //   return () => clearInterval(interval);
  // }, []);

  const MAX_SPEED = 180;
  // কাঁটার রোটেশন ক্যালকুলেশন
  const needleRotation = (speed / MAX_SPEED) * 180;

  // বর্তমান স্পিড অনুযায়ী কালার ঠিক করার ফাংশন
  const getActiveColor = (s) => {
    if (s <= 30) return "#88F0B5"; // Green
    if (s <= 80) return "#9EA7B2"; // Grey
    if (s <= 110) return "#FFD93D"; // Yellow
    return "#FF7272"; // Red
  };

  const currentColor = getActiveColor(speed);

  // ড্যাশ বা টিক্স তৈরি করার লজিক
  const ticks = [];
  const totalTicks = 25;

  for (let i = 0; i < totalTicks; i++) {
    const rotation = (i / (totalTicks - 1)) * 180 - 180;

    // টিক্সের কালার রেঞ্জ অনুযায়ী সেট করা
    let tickColor = "#FF7272";
    if (i < 4) tickColor = "#88F0B5";
    else if (i < 10) tickColor = "#DDE2E5";
    else if (i < 13) tickColor = "#FFD93D";

    ticks.push(
      <rect
        key={i}
        x="25"
        y="108"
        width="10"
        height="3.5"
        rx="2"
        fill={tickColor}
        transform={`rotate(${rotation + 180}, 110, 110)`}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-[#FFF9F4] rounded-sm w-full shadow-sm">
      <div className="relative">
        <svg viewBox="0 0 220 160" className="w-56 h-44">
          {/* Background Ticks */}
          {ticks}

          {/* Numbers (আকার ছোট করা হয়েছে) */}
          {[0, 30, 60, 90, 120, 150, 180].map((val) => {
            const angle = (val / MAX_SPEED) * 180 - 180;
            const r = 58;
            const x = 110 + r * Math.cos((angle * Math.PI) / 180);
            const y = 110 + r * Math.sin((angle * Math.PI) / 180);

            return (
              <text
                key={val}
                x={x}
                y={y}
                fill="#B0B8C1"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {val}
              </text>
            );
          })}

          {/* Speed Text (ইমেজ অনুযায়ী ছোট এবং ডাইনামিক কালার) */}
          <text
            x="100"
            y="75"
            textAnchor="middle"
            style={{ transition: "fill 0.5s" }}
          >
            <tspan x="93" dy="10" fontSize="14" fontWeight="800" fill="#1A1A1A">
              {speed}
            </tspan>
            <tspan x="117" dy="0" fontSize="12" fontWeight="700" fill="#1A1A1A">
              {" "}
              kmh
            </tspan>
          </text>

          {/* Needle Base Gray Circle */}
          <circle cx="110" cy="110" r="14" fill="#EDF1F5" />

          {/* Needle (কাঁটা) */}
          <g
            style={{
              transform: `rotate(${needleRotation}deg)`,
              transformOrigin: "110px 110px",
              transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <rect
              x="30"
              y="108.5"
              width="75"
              height="4"
              rx="2"
              fill="#FF9248" // অরেঞ্জ কাঁটা
            />
            <circle cx="110" cy="110" r="6" fill="#FF9248" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Speedometer;
