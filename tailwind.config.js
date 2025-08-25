module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  safelist: [
    "bg-cyan-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-purple-500"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
      },
    },
  },
  plugins: [],
};