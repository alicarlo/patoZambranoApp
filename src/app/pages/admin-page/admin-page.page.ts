import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EventsService } from 'src/app/services/events/events.service';
import { BarcodeScanner, CameraDirection } from '@capacitor-community/barcode-scanner';
import { AdminRegisterListPage } from '../../modals/admin-register-list/admin-register-list.page';
import { Router } from '@angular/router';
import { InsumosComponent } from '../admin-page/insumos/insumos.component';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.page.html',
  styleUrls: ['./admin-page.page.scss'],
  standalone: false
})
export class AdminPagePage  {
  show: number = 2;
  scanActive: boolean = false;
  constructor(
    private _EventsService: EventsService,
    private _AlertController: AlertController,
    private _AuthService: AuthService,
    private _LoadingController: LoadingController,
    private _ToastController: ToastController,
    private _ModalController: ModalController,
    private _Router: Router,
  ) { }

  async close() {
    const alert = await this._AlertController.create({
      header: 'Cerrar sesion',
      message: 'Desea salir ?',
      cssClass: 'custom-alert-horizontal',
      buttons: [ {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Alert canceled');
        },
      },
      {
        text: 'Ok',
        role: 'confirm',
        handler: () => {
          this._AuthService.signout();
          this._Router.navigate(['/login']);
        },
      },]
    });

    await alert.present();
  }

  onSegmentChange(event: CustomEvent) {
    console.log('ali')
    const value = event.detail.value;
    if (value === 'default') {
      this.show = 2
      // this._Router.navigate(['/admin-page/insumos']);
    } else if (value === 'segment') {
      this.show = 1
      // this._Router.navigate(['/admin-page/users']);
    }
  }

  navigate() {
    console.log('ali2')
  }

  test() {
    console.log('bb');
  }

   qrActivate(event: any) {
    console.log(event);
    this.scanActive = event
  }


}
