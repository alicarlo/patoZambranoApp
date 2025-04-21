import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrUserPage } from './qr-user.page';

const routes: Routes = [
  {
    path: '',
    component: QrUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrUserPageRoutingModule {}
