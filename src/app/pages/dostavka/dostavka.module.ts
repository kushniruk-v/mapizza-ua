import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DostavkaRoutingModule } from './dostavka-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, DostavkaRoutingModule, SharedModule],
})
export class DostavkaModule {}
