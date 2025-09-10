import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminRegisterListPage } from './admin-register-list.page';

const routes: Routes = [
  {
    path: '',
    component: AdminRegisterListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRegisterListPageRoutingModule {}
