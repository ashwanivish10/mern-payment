// client/postcss.config.js

// export default {
//   plugins: {
//     '@tailwindcss/postcss': {},
//     autoprefixer: {},
//   },
// }

export default {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- This is the correct key
    autoprefixer: {},
  },
}