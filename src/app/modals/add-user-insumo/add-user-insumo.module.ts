import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddUserInsumoPageRoutingModule } from './add-user-insumo-routing.module';

import { AddUserInsumoPage } from './add-user-insumo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddUserInsumoPageRoutingModule
  ],
  declarations: [AddUserInsumoPage]
})
export class AddUserInsumoPageModule {}
