// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Re-imagined Helpora color palette
        'helpora-primary': '#FF6B6B', // Vibrant Red (e.g., for urgent help)
        'helpora-secondary': '#4ECDC4', // Teal/Aqua (e.g., for positive action/NGO)
        'helpora-accent': '#FFD700', // Gold/Yellow (e.g., for highlights, calls to action)
        'helpora-dark': '#2C3E50', // Dark Blue/Grey (e.g., for deep text, backgrounds)
        'helpora-light': '#ECF0F1', // Light Grey (e.g., for subtle backgrounds)
        'helpora-text': '#34495E', // Standard dark text
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        heartBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.7', boxShadow: '0 0 5px rgba(255,107,107,0.4)' },
          '50%': { opacity: '1', boxShadow: '0 0 20px rgba(255,107,107,0.8)' },
        },
        dotPulse: {
            '0%, 100%': { transform: 'scale(0.8)', opacity: '0.7' },
            '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
        // For a background gradient animation
        flowBg: {
            '0%': { backgroundPosition: '0% 50%' },
            '100%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'heartbeat': 'heartBeat 1.5s ease-in-out infinite',
        'pulse-glow-red': 'pulseGlow 2s ease-in-out infinite',
        'dot-pulse': 'dotPulse 1.2s ease-in-out infinite',
        'flow-bg': 'flowBg 20s ease infinite alternate', // Slower background flow
      },
    },
  },
  plugins: [],
};