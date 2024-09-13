import { CommonModule } from '@angular/common';

import { CareerRoutingModule } from './career-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
@NgModule({
  declarations: [],
  imports: [CommonModule, CareerRoutingModule, SharedModule],
})
export class CareerModule {}
