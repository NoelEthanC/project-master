/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "border-spin": {
          "100%": {
            transform: "rotate(-360deg)",
          },
        },
      },

      animation: {
        "border-spin": "border-spin 10s linear infinite",
      },

      // eslint-disable-next-line no-unused-vars
      backgroundImage: (theme) => ({
        "gradient-rainbow":
          "linear-gradient(90deg, #00B5EE 7.14%, #FF45A4 45.78%, #FFBA00 78.78%)",
        "gradient-rainblue":
          "linear-gradient(90deg, #24CBFF 14.53%, #FC59FF 69.36%, #FFBD0C 117.73%)",
      }),
    },
  },
  plugins: [],
};
