import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddUserInsumoPage } from './add-user-insumo.page';

const routes: Routes = [
  {
    path: '',
    component: AddUserInsumoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddUserInsumoPageRoutingModule {}
