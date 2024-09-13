import { Component, ElementRef, ViewChild } from '@angular/core';
import { ITovaryResponse } from '../../shared/interfaces/tovary/tovary-interface';
import { TovaryService } from '../../shared/services/tovary/tovary.service';
import Swiper from 'swiper';
import { FavoriteService } from '../../shared/services/favorite/favorite.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @ViewChild('swiper1') swiper1: ElementRef | undefined;

  public userTovary: Array<ITovaryResponse> = [];
  public isActive = false;
  constructor(
    private TovaryService: TovaryService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.getTovary();
  }
  getTovary(): void {
    this.TovaryService.getAllFirebase().subscribe((data) => {
      this.userTovary = data as ITovaryResponse[];
    });
  }
  onSlidePrev(): void {
    if (this.swiper1 && this.swiper1.nativeElement.swiper) {
      this.swiper1.nativeElement.swiper.slidePrev(500);
    }
  }
  onSlideNext(): void {
    if (this.swiper1 && this.swiper1.nativeElement.swiper) {
      this.swiper1.nativeElement.swiper.slideNext(500);
    }
  }
  addToFavorites(tovar: ITovaryResponse): void {
    let favorite: Array<ITovaryResponse> = [];
    if (localStorage.length > 0 && localStorage.getItem('favorite')) {
      favorite = JSON.parse(localStorage.getItem('favorite') as string);
      const existingIndex = favorite.findIndex((prod) => prod.id === tovar.id);
      if (existingIndex !== -1) {
        favorite[existingIndex].count += tovar.count;
      } else {
        tovar.isActive = true;
        favorite.push(tovar);
      }
    }
    localStorage.setItem('favorite', JSON.stringify(favorite));
    tovar.count = 1;
    this.favoriteService.favoriteTovar.next(true);
  }
  removeFromFavorites(tovar: ITovaryResponse): void {
    let favorite: Array<ITovaryResponse> = [];
    if (localStorage.length > 0 && localStorage.getItem('favorite')) {
      favorite = JSON.parse(localStorage.getItem('favorite') as string);

      const index = favorite.findIndex((prod) => prod.id === tovar.id);
      if (index !== -1) {
        favorite.splice(index, 1);
      }
    }
    localStorage.setItem('favorite', JSON.stringify(favorite));
    tovar.isActive = false;
  }
  toggle(tovar: ITovaryResponse): void {
    if (tovar.isActive) {
      this.removeFromFavorites(tovar);
    } else {
      this.addToFavorites(tovar);
    }
  }
}
