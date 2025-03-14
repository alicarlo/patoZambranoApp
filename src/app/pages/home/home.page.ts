import { Component } from '@angular/core';
import { ProfilePage } from 'src/app/modals/profile/profile.page';
import { TermsPage } from 'src/app/modals/terms/terms.page';
import { MenuPage } from 'src/app/modals/menu/menu.page';
import { EvidencePage } from 'src/app/modals/evidence/evidence.page';
import { EventsPage } from 'src/app/modals/events/events.page';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(
    private _ModalController: ModalController,
    private _Router: Router,
  ) {}

  async openProfileModal() {
      const modal = await this._ModalController.create({
        component: ProfilePage,
        handle: true,
        showBackdrop: true,
        backdropDismiss: false,
      });
      modal.onDidDismiss().then((result: any) => {
        if (result.data === 1) {
          //
        }
      });
      modal.present();
  }

  async openTermsModal() {
    const modal = await this._ModalController.create({
      component: TermsPage,
      handle: true,
      showBackdrop: true,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((result: any) => {
      if (result.data === 1) {
        //
      }
    });
    modal.present();
  }

  async openEvidenceModal() {
    const modal = await this._ModalController.create({
      component: EvidencePage,
      handle: true,
      showBackdrop: true,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((result: any) => {
      if (result.data === 1) {
        //
      }
    });
    modal.present();
  }

  async openMenuModal() {
    const modal = await this._ModalController.create({
      component: MenuPage,
      handle: true,
      showBackdrop: true,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((result: any) => {
      if (result.data === 1) {
        //
      }
    });
    modal.present();
  }

  async openEventsModal() {
    const modal = await this._ModalController.create({
      component: EventsPage,
      handle: true,
      showBackdrop: true,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((result: any) => {
      if (result.data === 1) {
        //
      }
    });
    modal.present();
  }

  goMap() {
    this._Router.navigate(['/map', { onSameUrlNavigation: 'reload' }]);
  }
}
