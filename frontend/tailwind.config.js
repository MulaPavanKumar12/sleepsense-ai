/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: "#0B0F2B",
          900: "#101538",
          800: "#161C48",
          700: "#212a5c",
        },
        dusk: {
          400: "#8B8FCF",
          300: "#ABA9E8",
        },
        moon: {
          400: "#F4C978",
          300: "#F9DFA6",
        },
        aurora: {
          500: "#6DE1C6",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        stars: "radial-gradient(circle at 20% 20%, rgba(244,201,120,0.08), transparent 40%), radial-gradient(circle at 80% 60%, rgba(109,225,198,0.08), transparent 45%)",
      },
    },
  },
  plugins: [],
};
