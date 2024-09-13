import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { INewsResponse } from '../../../shared/interfaces/news/news-interface';

@Component({
  selector: 'app-news-info',
  templateUrl: './news-info.component.html',
  styleUrls: ['./news-info.component.scss'],
})
export class NewsInfoComponent {
  [x: string]: any;
  public currentNews!: INewsResponse;
  newFormNews: any;
  constructor(private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.currentNews = response['newsInfo'];
    });
  }
  loadNews(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }
}
