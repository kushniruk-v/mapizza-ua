import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { NewsService } from './news.service';
import { Injectable } from '@angular/core';
import { INewsResponse } from '../../interfaces/news/news-interface';
@Injectable({
  providedIn: 'root'
})
export class NewsInfoResolver implements Resolve<INewsResponse>   {
 
  constructor(private NewsService:NewsService ) {}

 
  resolve(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):any{
    return this.NewsService.getOneFirebase(route.paramMap.get('id') as string );
  }
}
