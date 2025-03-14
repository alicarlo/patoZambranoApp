import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-verify-modal',
  templateUrl: './verify-modal.page.html',
  styleUrls: ['./verify-modal.page.scss'],
  standalone: false
})
export class VerifyModalPage implements OnInit {

  constructor(
    private _AuthService: AuthService,
    private _ToastController: ToastController,
    private _ModalController: ModalController
  ) { }

  ngOnInit() {
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }

  sendVerificationMail() {
    this._AuthService.sendVerificationMail().then(() => {
      this.presentToast('Se ha enviado nuevamente un mensaje a tu cuenta de correo electrónico para validar tu cuenta.', 'success');
    })
    .catch( err => this.presentToast(err, 'danger'))
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
