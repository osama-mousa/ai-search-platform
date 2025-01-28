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
        background: "#212121",
        Sidebar: "#171717",
        input: "#2f2f2f",
        string:"#b4b4b4",
        placeholder:"#ececec",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
