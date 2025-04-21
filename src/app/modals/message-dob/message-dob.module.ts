import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessageDobPageRoutingModule } from './message-dob-routing.module';

import { MessageDobPage } from './message-dob.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageDobPageRoutingModule
  ],
  declarations: [MessageDobPage]
})
export class MessageDobPageModule {}
