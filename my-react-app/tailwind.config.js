/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login-gradient': 'linear-gradient(180deg, #3f51b5 60%, #214DEA)',
      },
    },
  },
  plugins: [],
}

