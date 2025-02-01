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
        primaryColor: "#212121",
        currentColor: "#525252",//#525252 ,#2f2f2f
        buttonColor: "#4338ca",
        linkColor: "#3730a3",
        Sidebar: "#171717",
        string: "#b4b4b4",
        placeholder: "#ececec",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
