import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'itnt.store',
  appName: 'itnt-frontend',
  webDir: 'public',
  ios: {
    scheme: 'App'
  },
  android: {
    buildOptions: {
      keystorePath: 'release-key.keystore',
      keystoreAlias: 'key0',
      keystorePassword: 'your-keystore-password',
      releaseType: 'APK'
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;