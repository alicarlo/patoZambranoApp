import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'io.trayectosIntelugentes.patoZambranoApp',
  appName: 'patoZambranoApp',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Body, // O prueba con KeyboardResize.Ionic
      style: KeyboardStyle.Light,  // Cambia a Dark si quieres modo oscuro
      resizeOnFullScreen: true
    }
  }
};

export default config;
