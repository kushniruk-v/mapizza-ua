import { RouterModule, Routes } from '@angular/router';
import { AdminActionsComponent } from './admin-actions/admin-actions.component';
import { AdminCareerComponent } from './admin-career/admin-career.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminNewsComponent } from './admin-news/admin-news-component';
import { AdminTovaryComponent } from './admin-tovary/admin-tovary.component';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'category', component: AdminCategoryComponent },
      { path: 'actions', component: AdminActionsComponent },
      { path: 'tovary', component: AdminTovaryComponent },

      { path: 'news', component: AdminNewsComponent },
      { path: 'career', component: AdminCareerComponent },
      { path: '', pathMatch: 'full', redirectTo: 'actions' },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
