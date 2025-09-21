import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ecosoft.ecosafe',
  appName: 'EcoSafe',
  webDir: 'dist',  // only used if you later bundle assets
  server: {
    url: 'https://ecosoft-olive.vercel.app',
  },
};

export default config;
