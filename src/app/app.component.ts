import { Component } from '@angular/core';
import { Device } from '@capacitor/device';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';

import { TextZoom } from '@capacitor/text-zoom';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private _Platform: Platform
  ) {
    this.lockTextZoom();
    this.init();

    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) this.lockTextZoom();
    });
  }

  

  async lockTextZoom() {
   await TextZoom.set({ value: 1.0 }); // 1.0 = 100%
  }

  private async init() {
    await this._Platform.ready();

 
    if (Capacitor.getPlatform() !== 'android') return;

      // const info = await Device.getInfo();
      const { androidSDKVersion: sdk = 0 } = await Device.getInfo();

    if (sdk >= 35) { // ✅ Android 15 (35) y 16 (36)
      document.body.classList.add('android-15-16');

      // (opcional) si quieres edge-to-edge:
      // await StatusBar.setOverlaysWebView({ overlay: true });

      try {
        const { insets } = await SafeArea.getSafeAreaInsets(); // px reales
        // Usa un rango sano para toolbar: 8px–24px
        const top = Math.max(8, Math.min(40, (insets.top ?? 0)));
        document.documentElement.style.setProperty('--sb-top', `${top}px`);
      } catch {
        // Fallback para Pixel/otros si falla la lectura: ~24dp en px
        const approx = Math.round((window.devicePixelRatio || 1) * 24);
        const top = Math.max(8, Math.min(40, approx));
        document.documentElement.style.setProperty('--sb-top', `${top}px`);
      }
    } else {
      // Android 14−: sin ajuste
      document.body.classList.remove('android-15-16');
      document.documentElement.style.setProperty('--sb-top', '0px');
    }

  }

  
}


