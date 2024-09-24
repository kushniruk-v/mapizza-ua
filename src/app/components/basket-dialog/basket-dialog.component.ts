import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ITovaryResponse } from '../../shared/interfaces/tovary/tovary-interface';
import { OrderService } from '../../shared/order/order.service';
import { AccountService } from '../../shared/services/account/account.service';

@Component({
  selector: 'app-basket-dialog',
  templateUrl: './basket-dialog.component.html',
  styleUrls: ['./basket-dialog.component.scss'],
})
export class BasketDialogComponent {
  public userTovary: Array<ITovaryResponse> = [];
  public isOpen = false;
  public total = 0;
  public bonus = 0;
  public isActive = false;
  private currentUser: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private orderService: OrderService,
    private accountService: AccountService
  ) {}
  ngOnInit(): void {
    this.loadBasket();
    this.updateBasket();
    this.getTotalBonus();
    this.accountService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }
  closeModal(): void {
    this.dialog.closeAll();
  }

  goHomePage(): void {
    this.router.navigate(['/']);
    this.dialog.closeAll();
  }
  loadBasket(): void {
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      this.userTovary = JSON.parse(localStorage.getItem('basket') as string);
    }

    this.getTotalPrice();
    this.getTotalBonus();
  }
  getTotalPrice(): void {
    this.total = this.userTovary.reduce(
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
  getTotalBonus(): void {
    this.bonus = this.userTovary.reduce(
      (bonus: number, tovar: ITovaryResponse) =>
        bonus + tovar.bonus * tovar.count,
      0
    );
  }
  updateBasket(): void {
    this.orderService.changeBasket.subscribe(() => {
      this.loadBasket();
    });
  }
  tovaryCount(tovary: ITovaryResponse, value: boolean): void {
    if (value) {
      ++tovary.count;
      localStorage.setItem('basket', JSON.stringify(this.userTovary));
    } else if (!value && tovary.count > 1) {
      --tovary.count;
      localStorage.setItem('basket', JSON.stringify(this.userTovary));
    }
    this.getTotalPrice();
    this.updateBasket();
    this.orderService.changeBasket.next(true);
  }

  deleteTovar(tovary: ITovaryResponse): void {
    if (this.userTovary.some((tovar) => tovar.id === tovar.id)) {
      const index = this.userTovary.findIndex((tovar) => tovar.id === tovar.id);
      this.userTovary.splice(index, 1);
      localStorage.setItem('basket', JSON.stringify(this.userTovary));
      this.updateBasket();
      this.orderService.changeBasket.next(true);
    }
  }
  removeAdditionalProduct(productIndex: number, additionalIndex: number): void {
    const product = this.userTovary[productIndex];
    if (
      product.additionalProducts &&
      product.additionalProducts.length > additionalIndex
    ) {
      product.additionalProducts.splice(additionalIndex, 1);
      localStorage.setItem('basket', JSON.stringify(this.userTovary));
      this.getTotalPrice();
      this.getTotalBonus();
      this.orderService.changeBasket.next(true);
    }
  }

  toOrder(): void {
    const currentUser = JSON.parse(
      localStorage.getItem('currentUser') as string
    );
    if (!currentUser) {
      alert('Будь ласка, увійдіть в систему, щоб здійснити покупку.');
      return;
    }
    const updatedOrders = this.userTovary.map((order) => ({
      ...order,
      additionalProducts: order.additionalProducts || [],
    }));
    this.accountService
      .updateUserOrders(currentUser.uid, updatedOrders)
      .then(() => {
        this.userTovary = [];
        localStorage.removeItem('basket');
        this.orderService.changeBasket.next(true);
        this.dialog.closeAll();
        this.router.navigate(['/profile']);
      })
      .catch((error) => {
        console.error('Error updating orders: ', error);
      });
  }
}
