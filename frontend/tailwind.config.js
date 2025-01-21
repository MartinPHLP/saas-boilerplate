/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6B4E71", // Violet pastel profond
          hover: "#8A6F8F", // Version plus claire pour le hover
        },
        secondary: {
          DEFAULT: "#F8F7FA", // Blanc légèrement violacé
          hover: "#EFE9F4", // Version plus accentuée du blanc violacé
        },
        neutral: {
          DEFAULT: "#F4F1F7", // Gris très léger avec nuance violette
          dark: "#9A8F9F", // Gris-violet pour les éléments secondaires
        },
      },
    },
  },
  plugins: [],
};

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           DEFAULT: "#1A1A1A", // Noir profond
//           hover: "#333333", // Noir plus léger pour le hover
//         },
//         secondary: {
//           DEFAULT: "#FFFFFF", // Blanc pur
//           hover: "#F5F5F5", // Blanc légèrement grisé pour le hover
//         },
//         neutral: {
//           DEFAULT: "#F0F0F0", // Gris très clair
//           dark: "#808080", // Gris moyen pour les éléments secondaires
//         },
//       },
//     },
//   },
//   plugins: [],
// };
