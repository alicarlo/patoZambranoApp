import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { DeleAccountPage } from '../dele-account/dele-account.page';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {

  constructor(
    private _ModalController: ModalController,
    private _ToastController: ToastController,
  
  ) { }

  ngOnInit() {
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }

  async openDeleteModal() {
    const modal = await this._ModalController.create({
      component: DeleAccountPage,
      handle: true,
      showBackdrop: true,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((result: any) => {
      if (result.data === 1) {
       this.close2()
      }
    });
    modal.present();
  }

  close2() {
    return this._ModalController.dismiss(1);
  }

}
