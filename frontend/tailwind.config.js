/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        colora: "#966bff",
        colorb: "#704CC6",
        colorc: "#fdf7ff",
        colord: "#352b48",
      },
    },
  },
  plugins: [],
};

// /** @type {import('tailwindcss').Config} */
// export default {
//     content: ["./index.html", "./src/**/*.{js,jsx}"],
//     theme: {
//       extend: {
//         colors: {
//           colora: "#03bf71",
//           colorb: "#00a985",
//           colorc: "#f0fcf4",
//           colord: "#1d1d35",
//         },
//       },
//     },
//     plugins: [],
//   };
