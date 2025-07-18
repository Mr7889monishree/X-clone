/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  //wahtever file under the app folder and components folder we can apply this tailwind css thats what is written in the content inside the exports object of tailwind.config.js created by nativewind by the command:npx tailwindcss init
  content:["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
} 