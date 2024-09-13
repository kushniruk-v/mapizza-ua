import { RouterModule, Routes } from '@angular/router';
import { ActionsComponent } from './actions.component';
import { ActionInfoComponent } from './action-info/action-info.component';
import { ActionInfoResolver } from '../../shared/services/action/action-info.resolver';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: ActionsComponent,
  },
  {
    path: ':id',
    component: ActionInfoComponent,
    resolve: {
      actionInfo: ActionInfoResolver,
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionsRoutingModule {}
