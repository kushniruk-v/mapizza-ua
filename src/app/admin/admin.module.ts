import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AdminActionsComponent } from './admin-actions/admin-actions.component';
import { AdminCareerComponent } from './admin-career/admin-career.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminNewsComponent } from './admin-news/admin-news-component';
import { AdminTovaryComponent } from './admin-tovary/admin-tovary.component';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AdminComponent,
    AdminActionsComponent,
    AdminCareerComponent,
    AdminCategoryComponent,
    AdminNewsComponent,
    AdminTovaryComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, SharedModule],
})
export class AdminModule {}
