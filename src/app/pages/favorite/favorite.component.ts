import { Component, OnInit } from '@angular/core';
import { ITovaryResponse } from '../../shared/interfaces/tovary/tovary-interface';
import { FavoriteService } from '../../shared/services/favorite/favorite.service';
import { OrderService } from '../../shared/order/order.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  public userTovary: Array<ITovaryResponse> = [];
  constructor(private favoriteService: FavoriteService,
    private orderService: OrderService,) {}

  ngOnInit(): void {
    this.loadFavoriteTovary();
    this.updateFavoriteTovar();
  }
  loadFavoriteTovary(): void {
    if (localStorage.length > 0 && localStorage.getItem('favorite')) {
      this.userTovary = JSON.parse(localStorage.getItem('favorite') as string);
    }
  }
  updateFavoriteTovar(): void {
    this.favoriteService.favoriteTovar.subscribe(() => {
      this.loadFavoriteTovary();
    });
  }
  deleteFavoriteTovar(tovary: ITovaryResponse): void {
    if (this.userTovary.some((tovar) => tovar.id === tovar.id)) {
      const index = this.userTovary.findIndex((tovar) => tovar.id === tovar.id);
      this.userTovary.splice(index,1);
      localStorage.setItem('favorite', JSON.stringify(this.userTovary));
      this.updateFavoriteTovar();
      this.favoriteService.favoriteTovar.next(true);
    }
  }
  tovaryCount(tovary: ITovaryResponse, value: boolean): void {
    if (value) {
      ++tovary.count;
    } else if (!value && tovary.count > 1) {
      --tovary.count;
    }
  }
  addToBasket(tovar: ITovaryResponse): void {
    let basket: Array<ITovaryResponse> = [];
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      basket = JSON.parse(localStorage.getItem('basket') as string);
      if (basket.some((prod) => prod.id === tovar.id)) {
        const index = basket.findIndex((prod) => prod.id === tovar.id);
        basket[index].count += tovar.count;
      } else {
        basket.push(tovar);
      }
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    tovar.count = 1;
    this.orderService.changeBasket.next(true);
  }
}
