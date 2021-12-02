module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      slackMain: "#3f0f3f",
    },
    fontFamily: {
      'ui': ['Noto Sans']
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
