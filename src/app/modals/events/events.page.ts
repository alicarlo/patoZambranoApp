import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { EventsService } from 'src/app/services/events/events.service';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: false
})
export class EventsPage implements OnInit {
  events: any = [];
  coords: any = { latitude: 0, longitude: 0};
  constructor(
    private _ModalController: ModalController,
    private _EventsService: EventsService,
    private _NavParams: NavParams,
    private launchNavigator: LaunchNavigator, 
    private _ToastController: ToastController
  ) {

   }


  ngOnInit() {
    this.getGps();
    this.getEvents();
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
      this.coords.longitude = coordinates.coords.latitude;
    } catch (error) {
      return;
    }
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }


   async getEvents() {
    const events: any = await this._EventsService.getEvents();
    if (events) {
      this.events = events;
    }
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
          app: this.launchNavigator.APP.GOOGLE_MAPS,
          launchModeGoogleMaps:  'turn-by-turn',
          extras: {navigate: 'yes' },
        };
        
        this.launchNavigator.navigate([parseInt(events.lat), parseInt(events.lng)], options).then(
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
}
