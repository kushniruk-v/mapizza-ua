import { Component, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { ITovaryResponse } from '../../shared/interfaces/tovary/tovary-interface';
import { FavoriteService } from '../../shared/services/favorite/favorite.service';
import { TovaryService } from '../../shared/services/tovary/tovary.service';
import { OrderService } from '../../shared/order/order.service';

@Component({
  selector: 'app-tovary',
  templateUrl: './tovary.component.html',
  styleUrls: ['./tovary.component.scss'],
})
export class TovaryComponent {
  public selected!: boolean;
  public userTovary: Array<ITovaryResponse> = [];
  public isOpen = false;
  public isModal = false;
  public isActive = false;
  public activeFilter: string = '*';
  private eventSubscription!: Subscription;

  constructor(
    private TovaryService: TovaryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private favoriteService: FavoriteService,
    private el: ElementRef
  ) {
    this.eventSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadTovary();
      }
    });
  }
  ngOnInit(): void {}

  loadTovary(): void {
    const categoryName = this.activatedRoute.snapshot.paramMap.get(
      'category'
    ) as string;
    this.TovaryService.getAllByCategoryFirebase().subscribe((data) => {
      this.userTovary = data as ITovaryResponse[];
      let categoryProducts = data.filter(
        (item) => item['category']['path'] == categoryName
      );
      this.userTovary = categoryProducts as ITovaryResponse[];
    });
  }
  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }

  openReadMore(): void {
    this.isOpen = !this.isOpen;
  }

  tovaryCount(tovary: ITovaryResponse, value: boolean): void {
    if (value) {
      ++tovary.count;
    } else if (!value && tovary.count > 1) {
      --tovary.count;
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
  applyFilter(filter: string): void {
    this.activeFilter = filter;
  }
}
