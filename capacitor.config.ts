import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'MundoManga',
  webDir: 'www',
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;
