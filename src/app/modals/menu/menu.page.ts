import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventsPage } from '../events/events.page';
import { EvidencePage } from '../evidence/evidence.page';
import { TermsPage } from '../terms/terms.page';
import { ProfilePage } from '../profile/profile.page';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PromotionsPage } from '../promotions/promotions.page';
import { MessagesPage } from '../messages/messages.page';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false
})
export class MenuPage implements OnInit {

  constructor(
    private _ModalController: ModalController,
    private _Router: Router,
    private _AuthService: AuthService
  ) { }

  ngOnInit() {
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }

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

    async openMessageModal() {
      const modal = await this._ModalController.create({
        component: MessagesPage,
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

    async openPromotionsModal() {
      const modal = await this._ModalController.create({
        component:  PromotionsPage,
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
       

    signOut() {
      this._AuthService.signout();
      this._Router.navigate(['/login']);
      this.closeMenu();
    }

}
