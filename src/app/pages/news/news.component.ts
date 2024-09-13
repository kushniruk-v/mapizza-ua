import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { INewsResponse } from '../../shared/interfaces/news/news-interface';
import { NewsService } from '../../shared/services/news/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent {
  userNews: Array<INewsResponse> = [];
  private eventSubscription!: Subscription;
  constructor(
    private newsService: NewsService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getNews();
  }
  getNews(): void {
    this.newsService.getAllFirebase().subscribe((data) => {
      this.userNews = data as INewsResponse[];
    });
  }
}
