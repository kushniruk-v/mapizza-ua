import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  public favoriteTovar = new Subject<boolean>();
  constructor() {}
}
