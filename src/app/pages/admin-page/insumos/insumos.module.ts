import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InsumosComponent } from './insumos.component';

@NgModule({
  declarations: [InsumosComponent],
  imports: [CommonModule, IonicModule],
  exports: [InsumosComponent],
})
export class InsumosModule {}