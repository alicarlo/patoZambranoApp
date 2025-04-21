import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-qr-user',
  templateUrl: './qr-user.page.html',
  styleUrls: ['./qr-user.page.scss'],
  standalone: false
})
export class QrUserPage implements OnInit {
  user: any = null;
  constructor(
    private _ModalController: ModalController,
    private _AuthService: AuthService
  ) { }

  async ngOnInit() {
    this.user = await this._AuthService.getDataUser();
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }

}
