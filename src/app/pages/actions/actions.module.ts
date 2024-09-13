import { NgModule } from '@angular/core';
import { ActionsComponent } from './actions.component';
import { ActionInfoComponent } from './action-info/action-info.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ActionsRoutingModule } from './actions-routing.module';

@NgModule({
  declarations: [ActionsComponent, ActionInfoComponent],
  imports: [CommonModule, SharedModule, ActionsRoutingModule],
})
export class ActionModule {}
