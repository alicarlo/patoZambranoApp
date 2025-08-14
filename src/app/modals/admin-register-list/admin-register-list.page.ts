import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-admin-register-list',
  templateUrl: './admin-register-list.page.html',
  styleUrls: ['./admin-register-list.page.scss'],
  standalone: false
})
export class AdminRegisterListPage implements OnInit {
  date: any =  new Date().toISOString();
  dataItem: any = [];
  data: any
  constructor(
    private _ModalController: ModalController,
    private _EventsService: EventsService,
    private _NavParams: NavParams,
    private _LoadingController: LoadingController,
    private _ToastController: ToastController
  ) {
    this.data = this._NavParams.get('value');
   }

  ngOnInit() {
    this.search();
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }

  async search() {
    const loading = await this._LoadingController.create({
      message: 'Validando',
      spinner: 'dots',
    });
    loading.present();
    const startDate = new Date(this.date); // Fecha de inicio (en zona horaria PST)
    const endDate = new Date(this.date);
    startDate.setHours(0, 0, 0, 0); 
    endDate.setHours(23, 59, 59, 999);
    const data =  await this.getData(startDate, endDate); 
    if (!data) {
      this.dataItem = [];
      loading.dismiss();
      this.presentToast('No hay registros', 'warning');
      return
    }

    this.dataItem = data;
    loading.dismiss();

  }

  validDate(ev: any) {
    this.date =  ev.detail.value;
    this.search();
  }

  async getData(startDate: any, endDate: any) {
    return new Promise((resolve) => {

      this._EventsService.getSuppliesRegisters(this.data.uid, startDate, endDate).then((response) => {
        resolve(response)
      })
    })
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
