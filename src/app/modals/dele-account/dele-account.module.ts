import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleAccountPageRoutingModule } from './dele-account-routing.module';

import { DeleAccountPage } from './dele-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeleAccountPageRoutingModule
  ],
  declarations: [DeleAccountPage]
})
export class DeleAccountPageModule {}
