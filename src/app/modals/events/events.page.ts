import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { EventsService } from 'src/app/services/events/events.service';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { Share } from '@capacitor/share';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { BarcodeScanner, CameraDirection } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: false
})
export class EventsPage implements OnInit {
  events: any = [];
  coords: any = { latitude: 0, longitude: 0};
  user: any = null;
  scanActive: boolean = false;
  constructor(
    private _ModalController: ModalController,
    private _EventsService: EventsService,
    // private _NavParams: NavParams,
    private launchNavigator: LaunchNavigator, 
    private _ToastController: ToastController,
    private _AuthService: AuthService,
    private _Router: Router,
    private _AlertController: AlertController,
    private _LoadingController: LoadingController,
  ) {

   }


  async ngOnInit() {
    this.getGps();
    this.user = await this._AuthService.getDataUser();
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
      this.coords.longitude = coordinates.coords.longitude;
    } catch (error) {
      return;
    }
  }

  closeMenu() {
    // return this._ModalController.dismiss();
    this._Router.navigate(['/map', { onSameUrlNavigation: 'reload' }]);
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

      async addClick(event: any) {
        return new Promise((resolve, reject) => {
          this._EventsService.addEventUserLocationClick(this.user, event).then(() => {
            resolve(true)
          }).catch((error) => {
            reject(error)
          })
        })
      }

      async launch(events: any) {
        
        if (this.coords.latitude === 0 && this.coords.longitude === 0) {
          this.presentToast('Ubicacion requerida','danger')
          return;
        }

        if (!events.lat || !events.lng) {
          this.presentToast('Ubicación requerida', 'danger');
          return;
        }
        delete events.imageURL;
        await this.addClick(events);
        const coordinatesCurrent = this.coords.latitude+','+this.coords.longitude;
        console.log(coordinatesCurrent)
        console.log(events)
        const options: LaunchNavigatorOptions = {
          start: coordinatesCurrent,
          app: this.launchNavigator.APP.APPLE_MAPS,
          launchModeGoogleMaps:  'turn-by-turn',
          extras: {navigate: 'yes' },
        };
        
        console.log(events)
        console.log(events.lat, events.lng)
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

      async scanQr2(ev: any) {
        console.log(ev)
        try {
          const idSub = await this.eventValidate(ev);
          console.log(idSub)
          await this.eventValidateGlobal(ev, idSub)
        } catch (error) {
          console.error(error)
        }
      }

      async eventValidate(event: any) {
        return new Promise((resolve, reject) => {
          this._EventsService.eventRegistrationInEvent( event.uid,this.user, event).then((response) => {
            resolve(response)
          }).catch((error) => {
            reject(error)
          })
        })
      }

      async eventValidateGlobal(event: any, idSub: any) {
        return new Promise((resolve, reject) => {
          this._EventsService.eventRegistrationInEventGlobal( event.uid,this.user, event, idSub).then((response) => {
            resolve(response)
          }).catch((error) => {
            reject(error)
          })
        })
      }

      async scanQr(ev: any) {
        const allowed =  await this.checkPermission();
        if (allowed) {  
          this.scanActive = true;
          let camera =  CameraDirection.BACK;
          const result: any = await BarcodeScanner.startScan({cameraDirection: camera}); 
          if (result.hasContent) {
            console.log('ali')
            console.log(result)
            console.log(result.hasContent)
            if (ev.uid === result.content) {
              const loading = await this._LoadingController.create({
                message: 'Validando',
                spinner: 'dots',
              });
              loading.present();
              try {
                const idSub = await this.eventValidate(ev);
                await this.eventValidateGlobal(ev, idSub);
                this.presentToast('Accion exitosa', 'success');
                loading.dismiss();
                this.stopScanner();
              } catch (error) {
                console.error(error)
                this.presentToast('Vuelva a intentar', 'danger');
                loading.dismiss();
              }
              
            }else{
              this.presentToast('Evento no valido', 'danger');
              setTimeout(() => {
                this.scanQr(ev);
              },1000);
            }
            /*
            const idSub = await this.eventValidate(ev);
            console.log(idSub)
            await this.eventValidateGlobal(ev, idSub)
            */
          }
        }
      }

      async checkPermission() {
        return new Promise(async (resolve, reject) => {
          const status = await BarcodeScanner.checkPermission({ force: true})
          if (status.granted) {
            resolve(true);
          }else if (status.denied) {
            const alert = await this._AlertController.create({
              header: 'Permiso para la camara',
              message: 'Habilite el permiso para la camara en configuracion',
              buttons: [{
                text: 'Continuar',
                role: 'Cancelar'
              },{
                text: 'Abrir configuracion para habilitar permiso de la camara',
                handler: () => {
                
                  BarcodeScanner.openAppSettings();
                  resolve(false);
                }
              }]
            });
            await alert.present();
          }else {
            resolve(false)
          }
        })
      }

      stopScanner() {
        BarcodeScanner.stopScan();
        this.scanActive = false;
      }

      
}
