import { NgModule } from '@angular/core';
import { NewsComponent } from './news.component';
import { NewsInfoComponent } from './news-info/news-info.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NewsRoutingModule } from './news-routing.module';

@NgModule({
  declarations: [NewsComponent, NewsInfoComponent],
  imports: [CommonModule, SharedModule, NewsRoutingModule],
})
export class NewsModule {}
