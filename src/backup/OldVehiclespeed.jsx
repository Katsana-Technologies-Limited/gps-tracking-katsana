// import React from "react";

// const Speedometer = ({ speed = 0 }) => {
//   const MAX_SPEED = 180;
//   // ইমেজ অনুযায়ী 0 kmh এ কাঁটাটি একদম বামে (180 degree তে) থাকে।
//   const needleRotation = (speed / MAX_SPEED) * 180;

//   // ড্যাশ বা টিক্স তৈরি করার লজিক (ইমেজ অনুযায়ী মোটা এবং রাউন্ডেড)
//   const ticks = [];
//   const totalTicks = 25; // ড্যাশের ঘনত্ব ইমেজের মতো রাখতে ২৫টি ব্যবহার করা হয়েছে

//   for (let i = 0; i < totalTicks; i++) {
//     const rotation = (i / (totalTicks - 1)) * 180 - 180;

//     // ইমেজ অনুযায়ী কালার ম্যাচিং
//     let color = "#FF7272"; // Default Red (ডান পাশে)
//     if (i < 4) color = "#88F0B5"; // Green (শুরুতে ৩-৪টি)
//     else if (i < 10) color = "#DDE2E5"; // Silver/Grey
//     else if (i < 13) color = "#FFD93D"; // Yellow (মাঝখানে ২-৩টি)

//     ticks.push(
//       <rect
//         key={i}
//         x="25"
//         y="108"
//         width="12"
//         height="4"
//         rx="2"
//         fill={color}
//         transform={`rotate(${rotation + 180}, 110, 110)`}
//       />
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center p-6 bg-[#FFF9E7] rounded-xl w-fit">
//       <div className="relative">
//         <svg viewBox="0 0 220 160" className="w-64 h-48">
//           {/* Background Ticks */}
//           {ticks}

//           {/* Numbers (ইমেজ অনুযায়ী পজিশন করা) */}
//           {[0, 30, 60, 90, 120, 150, 180].map((val) => {
//             const angle = (val / MAX_SPEED) * 180 - 180;
//             const r = 60; // নাম্বারগুলো ড্যাশের একটু ভেতরে
//             const x = 110 + r * Math.cos((angle * Math.PI) / 180);
//             const y = 110 + r * Math.sin((angle * Math.PI) / 180);

//             return (
//               <text
//                 key={val}
//                 x={x}
//                 y={y}
//                 fill="#9EA7B2"
//                 fontSize="13"
//                 fontWeight="600"
//                 textAnchor="middle"
//                 alignmentBaseline="middle"
//                 style={{ fontFamily: "sans-serif" }}
//               >
//                 {val}
//               </text>
//             );
//           })}

//           {/* Speed Text (একদম মাঝখানে) */}
//           <text
//             x="110"
//             y="85"
//             textAnchor="middle"
//             style={{ fontFamily: "sans-serif" }}
//           >
//             <tspan x="110" dy="0" fontSize="12" fontWeight="800" fill="#1A1A1A">
//               {speed}
//             </tspan>
//             <tspan
//               x="110"
//               dy="22"
//               fontSize="12"
//               fontWeight="700"
//               fill="#1A1A1A"
//             >
//               {" "}
//               kmh
//             </tspan>
//           </text>

//           {/* Needle Base Gray Circle */}
//           <circle cx="110" cy="110" r="16" fill="#E8ECF2" />

//           {/* Needle (কাঁটা) */}
//           <g
//             style={{
//               transform: `rotate(${needleRotation}deg)`,
//               transformOrigin: "110px 110px",
//               transition: "transform 1s cubic-bezier(0.17, 0.67, 0.83, 0.67)", // একদম স্মুথ এনিমেশন
//             }}
//           >
//             {/* Orange Needle Bar */}
//             <rect
//               x="30"
//               y="107.5"
//               width="80"
//               height="5"
//               rx="2.5"
//               fill="#FF9248"
//             />
//             {/* Orange Center Cap */}
//             <circle cx="110" cy="110" r="7" fill="#FF9248" />
//           </g>
//         </svg>
//       </div>
//     </div>
//   );
// };

// export default Speedometer;
