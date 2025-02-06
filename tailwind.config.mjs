/* eslint-disable import/no-anonymous-default-export */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: "#292a2d", // #292a2d , #212121
        currentColor: "#525252",//#525252 ,#2f2f2f
        sidbarColor: "#001932",
        buttonColor: "#4338ca",
        linkColor: "#3740f0",
        alertColor: "#171717",
        inputColor: "#404045",
        string: "#b4b4b4",
        placeholder: "#ececec",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        customFont: ['"Custom Font"', "sans-serif"],
        // Add more custom font families as needed
      },
    },
  },
  plugins: [],
};
