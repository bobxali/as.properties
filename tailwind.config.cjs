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
          navy: "#1a237e",
          gold: "#c9a45c",
          ink: "#0d0f1a",
          sand: "#f7f4ef",
          charcoal: "#111315",
          silver: "#9aa0a6",
          slate: "#2c2f33"
        }
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(26, 35, 126, 0.45)"
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
