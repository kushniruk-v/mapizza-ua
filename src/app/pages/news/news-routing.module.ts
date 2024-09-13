import { RouterModule, Routes } from '@angular/router';
import { NewsComponent } from './news.component';
import { NewsInfoComponent } from './news-info/news-info.component';
import { NgModule } from '@angular/core';
import { NewsInfoResolver } from '../../shared/services/news/news-info.resolver';

const routes: Routes = [
  { path: '', component: NewsComponent },
  {
    path: ':id',
    component: NewsInfoComponent,
    resolve: { newsInfo: NewsInfoResolver },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutingModule {}
