import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyModalPageRoutingModule } from './verify-modal-routing.module';

import { VerifyModalPage } from './verify-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyModalPageRoutingModule
  ],
  declarations: [VerifyModalPage]
})
export class VerifyModalPageModule {}
