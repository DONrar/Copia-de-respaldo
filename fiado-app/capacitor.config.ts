import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'fiado-app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  // Configuración para manejar safe areas correctamente
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#132440'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  },
  // Habilitar viewport fit para safe areas
  ios: {
    contentInset: 'automatic'
  },
  android: {
    backgroundColor: '#132440'
  }
};

export default config;
