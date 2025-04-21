import { Component, OnInit } from '@angular/core';
import { PromotionsService } from 'src/app/services/promotions/promotions.service';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { Share } from '@capacitor/share';
import { ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.page.html',
  styleUrls: ['./promotions.page.scss'],
  standalone: false
})
export class PromotionsPage implements OnInit {
  promotions: any = [];
  coords: any = { latitude: 0, longitude: 0};
  constructor(
    private _PromotionsService: PromotionsService,
     private _ModalController: ModalController,
      private launchNavigator: LaunchNavigator, 
      private _ToastController: ToastController
  ) { }

  async ngOnInit() {
    await this.getGps();
    this.getPromotions();
  }

  async getGps() {
    try {
      const options = {
        enableHighAccuracy: true,
        timeout: 200,
        maximumAge: 0
      };
      const coordinates = await Geolocation.getCurrentPosition(options)
      this.coords.latitude = coordinates.coords.latitude;
      this.coords.longitude = coordinates.coords.longitude;
    } catch (error) {
      return;
    }
  }

  async getPromotions() {
    const promotions: any = await this._PromotionsService.getPromotions();
    if (promotions) {
      this.promotions = promotions;
      console.log(this.promotions)
    }
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }


  launch(events: any) {
    if (this.coords.latitude === 0 && this.coords.longitude === 0) {
      this.presentToast('Ubicacion requerida','danger')
      return;
    }

    if (!events.lat || !events.lng) {
      this.presentToast('Ubicación requerida', 'danger');
      return;
    }
    
    const coordinatesCurrent = this.coords.latitude+','+this.coords.longitude;
    const options: LaunchNavigatorOptions = {
      start: coordinatesCurrent,
      app: this.launchNavigator.APP.APPLE_MAPS,
      launchModeGoogleMaps:  'turn-by-turn',
      extras: {navigate: 'yes' },
    };

    this.launchNavigator.navigate([parseFloat(events.lat), parseFloat(events.lng)], options).then(
      // success => // console.log('Launched navigator'),
      // error => // console.log('Error launching navigator', error)
    );
  }

  async socialSharing(events: any) {
    // https://www.google.com/maps?q=LATITUDE,LONGITUDE
    if (!events.lat || !events.lng) {
      this.presentToast('Ubicación requerida', 'danger');
      return;
    }
    await Share.share({
      title: 'Pato Zambrano - Reporte Directo',
      text: 'Presiona para ver la ubicación del evento',
      url: `https://www.google.com/maps?q=${events.lat},${events.lng}`,
    });

  }

  async presentToast(msg: string, color: string) {
    const toast = await this._ToastController.create({
      message: msg,
      duration: 3500,
      position: 'top',
      color: color,
      cssClass: 'tabs-bottom',
    });
    await toast.present();
  }

    startFormat(date: any) {
      if (!date || !date.seconds) return 'Invalid date';
      
      const timestamp = date.seconds * 1000; // Convertir a milisegundos
      return moment(timestamp).format('hh:mm A');
        }

    endFormat(date: any) {
      if (!date || !date.seconds) return 'Invalid date';
      
      const timestamp = date.seconds * 1000; // Convertir a milisegundos
      return moment(timestamp).format('hh:mm A');
    }

    numberDateFormat(date: any) {
      if (!date || !date.seconds) return 'Invalid date';
      
      const timestamp = date.seconds * 1000; // Convertir a milisegundos
      return moment(timestamp).format('D'); // Obtiene solo el número del día
    }

    numberMonthFormat(date: any) {
      if (!date || !date.seconds) return 'Fecha inválida';
      
      const timestamp = date.seconds * 1000; // Convertir a milisegundos
      moment.locale('es'); // Configurar moment.js en español
      return moment(timestamp).format('MMMM'); // Nombre completo del mes en español
    }
}
