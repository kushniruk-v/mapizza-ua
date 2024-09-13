import { CommonModule } from '@angular/common';
import { KontaktyRoutingModule } from './kontakty-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [CommonModule, KontaktyRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class KontaktyModule {}
