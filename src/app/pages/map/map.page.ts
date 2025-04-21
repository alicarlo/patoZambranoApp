import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMapsModule, MapMarker } from '@angular/google-maps';
import {
  GoogleMap,
  MapInfoWindow,
  MapGeocoder,
  MapGeocoderResponse,
} from '@angular/google-maps';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { CreateEvidencePage } from 'src/app/modals/create-evidence/create-evidence.page';
import { EventsPage } from 'src/app/modals/events/events.page';
import { MenuPage } from 'src/app/modals/menu/menu.page';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Capacitor } from '@capacitor/core';
import { EventsService } from 'src/app/services/events/events.service';
import * as moment from 'moment';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { PromotionsService } from 'src/app/services/promotions/promotions.service';
import { PromotionsPage } from 'src/app/modals/promotions/promotions.page';
import { EvidencePage } from 'src/app/modals/evidence/evidence.page';
import { MessageDobPage } from 'src/app/modals/message-dob/message-dob.page';
import { ProfilePage } from 'src/app/modals/profile/profile.page';

declare  var google: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: false
})
export class MapPage implements OnInit {
  @ViewChild('myGoogleMap', { static: false })
	map!: GoogleMap;
	address: any = '';
	latitude: any = '25.6489848';
	longitude: any = '-100.4738091';
	zoom = 10;
	maxZoom = 20;
	minZoom = 8;
	center!: google.maps.LatLngLiteral;
	options: google.maps.MapOptions = {
		zoomControl: true,
		scrollwheel: false,
		disableDoubleClickZoom: false,
			panControl: false,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			rotateControl: false,
			fullscreenControl: false,
			// mapTypeId: 'hybrid',
			// styles:  map3,
			center: {
				lat: 25.6489848,
				lng: -100.4738091
			}
	}
  coords: any = { latitude: 0, longitude: 0};
  // markers: google.maps.LatLngLiteral[] = [];
  markers: any = [];
  isHidden: boolean = true;
  selectedTab: string = 'home'; 
  user: any

  events: any = null;
  promotions: any = null;
  constructor(
    private _Router: Router,
    private _ToastController: ToastController,
    private _ModalController: ModalController,
    private _AuthService: AuthService,
    private _EventsService: EventsService,
    private _PromotionsService: PromotionsService,
    private launchNavigator: LaunchNavigator,
  ) { }

  async ngOnInit() {
    this.user = await this._AuthService.getDataUser();
    await this.getEvents();
    await this.getPromotions();
    setTimeout(async () => {
      const mapContainer: any = document.querySelector('.map-container');

      // Asegurarte de que el contenedor ocupe todo el ancho
      if (mapContainer) {
        mapContainer.style.width = "100%";
        mapContainer.style.maxWidth = "none"; // Eliminar cualquier restricción de ancho máximo
        mapContainer.style.overflow = "hidden"; // Evitar el desbordamiento
      }
      const aux2: any = document.getElementsByClassName('map-container').item(0);
      aux2.getElementsByTagName('div')[0].style.backgroundColor = "#ffffff";
      aux2.getElementsByTagName('div')[0].style.width= "100%";
      const aux: any = document.getElementsByClassName('gm-style');

      aux[0].style.borderRadius = "32px"// "50px";
      aux[0].style.width = '100%';  // Asegúrate de que ocupe el 100% del ancho
      aux[0].style.maxWidth = 'none';
      // aux[0].style.maxWidth =  '100%' //'99%'
      aux[0].style.overflow = 'hidden';  
      this.isHidden = false;
      await this.getGps();
      const platform = Capacitor.getPlatform();
      if (platform !== 'web') {
          await PushNotifications.requestPermissions();
          await PushNotifications.register();
          this.getToken();
      }

      console.log(this.user)
      if (this.user.dob === '') {
        this.openDob();
      }
      
      },1500)
    
  }

  async getToken() {
    FCM.getToken()
      .then(async (response) => {
        console.log('token:'+response.token)
        this._AuthService.updateToken(response.token, this.user.idDoc);
      })
      .catch((error) => {
        console.log('error:'+error)
        // clearconsole.error(error);
      });
  }

  async getGps() {
    try {
      const options = {
        enableHighAccuracy: true,
        timeout: 200,
        maximumAge: 0
      };

      console.log('gps1');
      const coordinates = await Geolocation.getCurrentPosition(options)
      console.log('gps2:'+ coordinates);
      this.coords.latitude = coordinates.coords.latitude;
      this.coords.longitude = coordinates.coords.longitude;
 
      if (this.coords.latitude !== 0 && this.coords.longitude !== 0) {
        // this.presentToast('Ubicacion obtenida','success');
        if (this.markers.length === 0) {
          this.markers.push({
            data: null,
            location: {
              lat: coordinates.coords.latitude,
              lng: coordinates.coords.longitude,
            },
            options: {
							animation: google.maps.Animation.DROP,
							draggable: false,
							icon: {
								url: '../assets/images/location.gif',
								scaledSize: {
									height: 40,
									width: 40
								},
								anchor : {x:19, y:19}
							},
						},
          });
        } else {
          this.markers[0].location = {
            lat: coordinates.coords.latitude,
            lng: coordinates.coords.longitude,
          };
        }
        this.center = {
					lat: coordinates.coords.latitude,
					lng: coordinates.coords.longitude,
				}

        this.zoom = 16
      }
      return;
    } catch (error) {
      console.log('error', error);
      // this.coords = { latitude: 0, longitude: 0};
      // this.presentToast('No se puede obtener su ubicacion','danger');
      // this.gpsOffModal();
      return;
    }
  }

  changeTab(event: any) {
    this.selectedTab = event.detail.tab;
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      this.markers.push({ location: { lat, lng } });
      this.presentToast();
    }
  }

  onMarkerClick(index: number) {

    if (index === 0) return;
    const marker = this.markers[index];
    this.openCreateEvidenceModal(marker);
  }

  clearDelete() {
    let aux = this.markers[0];
    this.markers = [];
    this.markers.push(aux);
  }

  close() {
    this.markers = [];
    this._Router.navigate(['/home', { onSameUrlNavigation: 'reload' }]);
  }

  async presentToast(message?: string, color?: string) {
    const toast = await this._ToastController.create({
      header: 'Marcador creado',
      message: message || 'Seleccione el marcador en el mapa, para crear una incidencia',
      color: color || 'success',
      position: 'top',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  async openDob() {
    const modal = await this._ModalController.create({
      component: MessageDobPage,
      handle: true,
      showBackdrop: true,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((result: any) => {
      console.log(result.data)
      if (result.data === 1) {
        this.openProfile();
      }
    });
    modal.present();
  }

  async openProfile() {
    // ProfilePage
    const modal = await this._ModalController.create({
      component: ProfilePage,
      handle: true,
      showBackdrop: true,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((result: any) => {

    });
    modal.present();
  }
  

  async openCreateEvidenceModal(data: any) {
    const modal = await this._ModalController.create({
      component: CreateEvidencePage,
      handle: true,
      showBackdrop: true,
      backdropDismiss: false,
      componentProps: { value: data },
    });
    modal.onDidDismiss().then((result: any) => {
      console.log(result.data)
      if (result.data === 1) {
        this.clearDelete();
      }
    });
    modal.present();
  }

    async openMenuModal() {
        const modal = await this._ModalController.create({
          component: MenuPage,
          handle: true,
          showBackdrop: true,
          backdropDismiss: false,
        });
        modal.onDidDismiss().then((result: any) => {
          if (result.data === 1) {
            //
          }
        });
        modal.present();
      }

    async openEventsModal() {
      this._Router.navigate(['/events', { onSameUrlNavigation: 'reload' }])
      return
      const modal = await this._ModalController.create({
        component: EventsPage,
        handle: true,
        showBackdrop: true,
        backdropDismiss: false,
      });
      modal.onDidDismiss().then((result: any) => {
        if (result.data === 1) {
          //
        }
      });
      modal.present();
    }

    async openPromotionsModal() {
      const modal = await this._ModalController.create({
        component:  PromotionsPage,
        handle: true,
        showBackdrop: true,
        backdropDismiss: false,
      });
      modal.onDidDismiss().then((result: any) => {
        if (result.data === 1) {
          //
        }
      });
      modal.present();
    }
   

    async getPromotions() {
      const promotions: any = await this._PromotionsService.getPromotions();
      if (promotions) {
        this.promotions = promotions[0];
      }
    }

    async getEvents() {
      const events: any = await this._EventsService.getEvents();
      if (events) {
        this.events = events[0];
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
    


    launch(data: any) {
      if (this.coords.latitude === 0 && this.coords.longitude === 0) {
        this.presentToast('Tu Ubicacion es requerida', 'warning');
        return;
      }
      const coordinatesCurrent = this.coords.latitude+','+this.coords.longitude;
      const options: LaunchNavigatorOptions = {
        start: coordinatesCurrent,
        app: this.launchNavigator.APP.APPLE_MAPS,
        launchModeGoogleMaps:  'turn-by-turn',
        extras: {navigate: 'yes' },
      };
      
      this.launchNavigator.navigate([parseFloat(data.lat), parseFloat(data.lng)], options).then(
        // success => // console.log('Launched navigator'),
        // error => // console.log('Error launching navigator', error)
      );
    }

    async openEvidenceModal() {
          const modal = await this._ModalController.create({
            component: EvidencePage,
            handle: true,
            showBackdrop: true,
            backdropDismiss: false,
          });
          modal.onDidDismiss().then((result: any) => {
            if (result.data === 1) {
              //
            }
          });
          modal.present();
        }
}
