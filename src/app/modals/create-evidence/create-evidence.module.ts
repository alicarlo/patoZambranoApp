import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateEvidencePageRoutingModule } from './create-evidence-routing.module';

import { CreateEvidencePage } from './create-evidence.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateEvidencePageRoutingModule
  ],
  declarations: [CreateEvidencePage]
})
export class CreateEvidencePageModule {}
