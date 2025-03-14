import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RegisterPage } from './register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegisterPageRoutingModule
  ],
  schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
