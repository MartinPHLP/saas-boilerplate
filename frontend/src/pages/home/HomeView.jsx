// export function HomeView({ onNavigate }) {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
//       <div className="flex items-center gap-3 mb-8">
//         <svg
//           className="w-8 h-8 text-black"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M13 10V3L4 14h7v7l9-11h-7z"
//           />
//         </svg>
//         <h1 className="text-4xl font-bold text-black">
//           Welcome to the Boilerplate
//         </h1>
//       </div>
//       <div className="space-x-4">
//         <button
//           onClick={() => onNavigate("login")}
//           className="bg-neutral text-black px-6 py-2 rounded border border-primary hover:bg-neutral"
//         >
//           Login
//         </button>
//         <button
//           onClick={() => onNavigate("register")}
//           className="bg-primary text-black px-6 py-2 rounded hover:bg-primary"
//         >
//           Register
//         </button>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { LandingPage } from "./landing/LandingPage";

export function HomeView({ onNavigate }) {
  return (
    <div className="min-h-screen landing-page">
      <LandingPage onNavigate={onNavigate} />
    </div>
  );
}
