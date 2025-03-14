import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyModalPage } from './verify-modal.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifyModalPageRoutingModule {}
