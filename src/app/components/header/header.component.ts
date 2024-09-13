import { Component } from '@angular/core';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BasketDialogComponent } from '../basket-dialog/basket-dialog.component';
import { ITovaryResponse } from '../../shared/interfaces/tovary/tovary-interface';
import { AccountService } from '../../shared/services/account/account.service';
import { OrderService } from '../../shared/order/order.service';
import { FavoriteService } from '../../shared/services/favorite/favorite.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public basket: Array<ITovaryResponse> = [];
  public favorite: Array<ITovaryResponse> = [];
  public total = 0;
  public countTovary = 0;
  public countFavoriteTovary = 0;
  public isActive = false;
  public isOpen = false;
  constructor(
    public dialog: MatDialog,
    private accountService: AccountService,
    private orderServise: OrderService,
    private favoriteService: FavoriteService
  ) {}
  ngOnInit(): void {
    this.loadBasket();
    this.updateBasket();
    this.loadFavorite();
    this.updateFavorite();
  }

  openLoginDialog(): void {
    this.dialog
      .open(AuthDialogComponent, {
        backdropClass: 'dialog-back',
        panelClass: 'auth-dialog',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((result) => {
        console.log(result);
      });
  }
  openBasketDialog(): void {
    this.dialog.open(BasketDialogComponent, {
      backdropClass: 'dialog-back-2',
      panelClass: 'basket-dialog',

      position: { right: '20px', top: '15px' },
    });
  }
  loadBasket(): void {
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket') as string);
    }
    this.getTotalPrice();
    this.getTotalCount();
  }

  getTotalPrice(): void {
    this.total = this.basket.reduce(
      (total: number, tovar: ITovaryResponse) =>
        total +
        (tovar.price * tovar.count +
          (tovar.additionalProducts
            ? tovar.additionalProducts.reduce(
                (sum, product) => sum + product.price,
                0
              ) * tovar.count
            : 0)),
      0
    );
  }
  getTotalCount(): void {
    this.countTovary = this.basket.reduce(
      (total: number, count: ITovaryResponse) => total + count.count,
      0
    );
  }

  updateBasket(): void {
    this.orderServise.changeBasket.subscribe(() => {
      this.loadBasket();
    });
  }
  loadFavorite(): void {
    if (localStorage.length > 0 && localStorage.getItem('favorite')) {
      this.favorite = JSON.parse(localStorage.getItem('favorite') as string);
    }
    this.getFavoriteCount();
  }

  getFavoriteCount(): void {
    this.countFavoriteTovary = this.favorite.length;
  }

  updateFavorite(): void {
    this.favoriteService.favoriteTovar.subscribe(() => {
      this.loadFavorite();
    });
  }

  showModel(): void {
    this.isOpen = !this.isOpen;
  }
}
