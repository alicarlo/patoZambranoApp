import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessageDobPage } from './message-dob.page';

const routes: Routes = [
  {
    path: '',
    component: MessageDobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageDobPageRoutingModule {}
