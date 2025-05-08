import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminRegisterListPageRoutingModule } from './admin-register-list-routing.module';

import { AdminRegisterListPage } from './admin-register-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRegisterListPageRoutingModule
  ],
  declarations: [AdminRegisterListPage]
})
export class AdminRegisterListPageModule {}
