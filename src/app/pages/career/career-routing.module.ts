import { RouterModule, Routes } from '@angular/router';
import { CareerComponent } from './career.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: CareerComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CareerRoutingModule {}
