import { pixelBasedPreset, type TailwindConfig } from "react-email";

export default {
  presets: [pixelBasedPreset],
  theme: {
    fontFamily: {
      kira: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    },
  },
} satisfies TailwindConfig;
