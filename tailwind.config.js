const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  darkMode: "class",
  theme: {
    minHeight: {
      "1/2": "50%",
    },
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "#e879f9",
          neutral: "black",
          "base-100": "white",
          "neutral-content": "#6b7280",
          accent: "#F5C5A1",
          "accent-focus": "#F4B1C3",
        },
      },
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: "#a21caf",
          neutral: "white",
          "base-100": "black",
          "neutral-content": "#d1d5db",
          accent: "#7B4422",
          "accent-focus": "#813242",
        },
      },
    ],
  },
};
