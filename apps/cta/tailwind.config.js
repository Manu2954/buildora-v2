import { type Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#C69B4B",
          gold600: "#B1873E"
        },
        text: {
          base: "#333132"
        },
        bg: {
          base: "#e8e8e8"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
