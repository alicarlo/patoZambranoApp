import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-dele-account',
  templateUrl: './dele-account.page.html',
  styleUrls: ['./dele-account.page.scss'],
  standalone: false
})
export class DeleAccountPage implements OnInit {
  email: string = '';
  isValidEmail: boolean = true;
  constructor(
    private _ModalController: ModalController,
    private _ToastController: ToastController
  ) { }

  ngOnInit() {
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.isValidEmail = emailPattern.test(this.email);
  }

  async confirmDelete() {
    if (this.isValidEmail) {
      await this.deleteUser();
      this.presentToast('Cuenta eliminada', 'success');
    }
  }
  async deleteUser() {
    return this._ModalController.dismiss(1);
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
