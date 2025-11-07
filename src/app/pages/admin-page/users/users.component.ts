import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { RegisterPage } from 'src/app/modals/register/register.page';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: false
})
export class UsersComponent  implements OnInit {
  dataList: any = []
  dataListAux: any = [];
  constructor(private _ModalController: ModalController, private _AuthService: AuthService, private _LoadingController: LoadingController) { }

  ngOnInit() {
    this.getUsers()
  }

    async openRegisterModal() {
      const modal = await this._ModalController.create({
        componentProps: { value: 2 },
        component: RegisterPage,
        handle: true,
        showBackdrop: true,
        backdropDismiss: false,
      });
      modal.onDidDismiss().then((result: any) => {
        if (result.data === 5) {
          this.getUsers();
        }
      });
      modal.present();
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
          const sorted = [...res].sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf());
          this.dataList = sorted;
          this.dataListAux = sorted;
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

}
