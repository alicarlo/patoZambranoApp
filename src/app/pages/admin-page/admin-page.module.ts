import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPagePageRoutingModule } from './admin-page-routing.module';

import { AdminPagePage } from './admin-page.page';
import { InsumosModule } from './insumos/insumos.module';
import { UsersModule } from './users/users.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPagePageRoutingModule,
    InsumosModule,
    UsersModule
  ],
  declarations: [AdminPagePage,],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminPagePageModule {}
