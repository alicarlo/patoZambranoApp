import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-add-user-insumo',
  templateUrl: './add-user-insumo.page.html',
  styleUrls: ['./add-user-insumo.page.scss'],
  standalone: false
})
export class AddUserInsumoPage implements OnInit {
  dataList: any = []
  dataListAux: any = [];
  nav: any;
  constructor(
    private _ModalController: ModalController, private _AuthService: AuthService, private _LoadingController: LoadingController,
    private _AlertController: AlertController, private _NavParams: NavParams
    
  ) {
    this.nav = this._NavParams.get('value');

  }

  ngOnInit() {
    this.getUsers()
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }

  async getUsers() {
      const loading = await this._LoadingController.create({
        message: 'Cargando...',
        spinner: 'dots',
      });
      loading.present();
      return new Promise((resolve, reject) => {
        this._AuthService.getAllUsers().then((res: any) => {
          console.log(res)
          this.dataList = res;
          this.dataListAux = res;
          loading.dismiss();
        }).catch((err: any) => {
          loading.dismiss();
        })
      })
    }

    search(ev: any) {
    const searchTerm = ev.target.value;
    if (searchTerm && searchTerm.length > 2) {
      this.searchUsers(searchTerm);
    } else {
      this.dataList = this.dataListAux;
    }
  }

  async searchUsers(searchTerm: string) {

    this._AuthService.searchUsersByNameOrLastName(searchTerm)
      .subscribe((results) => {
        console.log(results)
        if (results.length !== 0) {
          this.dataList = results;
       
          // this.loadingUsers = false;
        }
      });
  }
  

   async add(dataUser: any) {
    const alert = await this._AlertController.create({
      header: 'Seleccion de usuario',
      message: 'El usuario es correcto?',
      cssClass: 'custom-alert-horizontal',
      buttons: [ {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Alert canceled');
        },
      },
      {
        text: 'Si',
        role: 'confirm',
        handler: () => {
          let dataSend = {
            insumo: this.nav,
            user: dataUser
          }
          this._ModalController.dismiss(dataSend);
        },
      },]
    });

    await alert.present();
  }

}
