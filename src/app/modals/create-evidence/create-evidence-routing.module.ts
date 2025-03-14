import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateEvidencePage } from './create-evidence.page';

const routes: Routes = [
  {
    path: '',
    component: CreateEvidencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateEvidencePageRoutingModule {}
