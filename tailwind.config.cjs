module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Manrope", "sans-serif"]
      },
      colors: {
        brand: {
          navy: "#1b2233",
          gold: "#b89153",
          ink: "#0b0e12",
          sand: "#f6f4f0",
          charcoal: "#101215",
          silver: "#b3b7bd",
          slate: "#3b3f45"
        }
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(27, 34, 51, 0.45)"
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(18px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        floatSlow: "floatSlow 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.6s ease forwards",
        shimmer: "shimmer 1.5s linear infinite"
      }
    }
  },
  plugins: []
}
