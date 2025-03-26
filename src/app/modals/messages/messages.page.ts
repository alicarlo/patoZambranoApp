import { Component, OnInit } from '@angular/core';
import { LoadingController,ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  standalone: false
})
export class MessagesPage implements OnInit {
  loading: number = 0;
  user: any;
  messages: any = [];
  constructor(
    private _ModalController: ModalController,
    private _ToastController: ToastController,
    private _AuthService: AuthService,
    private _LoadingController: LoadingController
  ) { }

  async ngOnInit() {
    this.user = await this._AuthService.getDataUser();
    await this.getMessages();
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }

  async getMessages() {
    const msg: any = await this._AuthService.getMessagesByUser(this.user.uid);
    if (msg === false) {
      this.loading = 1;
    }else{
      this.messages = msg;
      this.loading = 2;
    }
  }

   startFormat(date: any) {
        if (!date || !date.seconds) return 'Invalid date';
        
        const timestamp = date.seconds * 1000; // Convertir a milisegundos
        return moment(timestamp).format('DD/MM/YYYY hh:mm A');
      }
  

}
