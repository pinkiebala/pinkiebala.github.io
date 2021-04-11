module.exports = {
  purge: ["./src/**/*.js", "./src/**/*.jsx", "./src/**/*.ts", "./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      flex: {
        fluid: "0 0 100%",
        "1/2": "0 0 50%",
        "1/3": "0 0 33.33%",
      },
    },
    screens: {
      md: "768px",
      lg: "1024px",
    },
    textColor: {
      primary: "#252121",
      secondary: "#999999",
      black: "#252121",
      white: "#FFFFFF",
    },
  },
  variants: {
    extend: {
      padding: ["first", "last"],
      margin: ["first", "last"],
    },
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          maxWidth: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          "@screen md": {
            maxWidth: "736px",
          },
          "@screen lg": {
            maxWidth: "992px",
          },
        },
      })
    },
    require("@tailwindcss/typography"),
  ],
}
