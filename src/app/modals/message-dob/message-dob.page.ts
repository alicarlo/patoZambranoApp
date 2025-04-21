import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-message-dob',
  templateUrl: './message-dob.page.html',
  styleUrls: ['./message-dob.page.scss'],
  standalone: false
})
export class MessageDobPage implements OnInit {
  dateFormat: any;
  age: any;
  dateSelect: any;
  user: any = null;
  constructor(
    private _ModalController: ModalController,
    private _AuthService: AuthService,
    private _ToastController: ToastController,
    private _LoadingController: LoadingController,
  ) { }

  async ngOnInit() {
    this.user = await this._AuthService.getDataUser();
  }

  closeMenu(flag: any) {
    return this._ModalController.dismiss(flag);
  }

  public validDate(): void {
    console.log(this.dateSelect)
      this.dateFormat = moment(this.dateSelect).format('DD/MM/YYYY');
      const millis = Date.now() - Date.parse(this.dateSelect);
      this.age = new Date(millis).getFullYear() - 1970;
  }

  async updateDate() {
    const loading = await this._LoadingController.create({
      message: 'Actualizando...',
      spinner: 'dots',
    });
    loading.present();
    try {
      this._AuthService.updateDob(this.user.uid, this.age, this.dateSelect).then(async () => {
        this.presentToast('Datos actualizados con exito', 'success');
        const userData: any = await this._AuthService.loginGetDataFire(this.user.uid);
        await this._AuthService.setDataUser(userData);
        loading.dismiss();
        this.closeMenu('');
      })
    } catch (error: any) {
      this.presentToast(error, 'danger');
      loading.dismiss();
    }
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
