import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  standalone: false
})
export class MessagesPage implements OnInit {

  constructor(
    private _ModalController: ModalController
  ) { }

  ngOnInit() {
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }

}
