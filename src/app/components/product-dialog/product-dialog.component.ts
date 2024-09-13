import { Component, Inject } from '@angular/core';
import { ITovaryResponse } from '../../shared/interfaces/tovary/tovary-interface';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { IAdditionalComponensResponse } from '../../shared/interfaces/additional-components/additional-components-interface';
import { AdditionalComponentsService } from '../../shared/services/additional components/additional-components.service';
import { OrderService } from '../../shared/order/order.service';
@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss',
})
export class ProductDialogComponent {
  public additionalComponents: Array<IAdditionalComponensResponse> = [];
  totalPrice: number = 0;

  selectedProducts: { name: string; index: number; price: number }[] = [];
  constructor(
    public dialog: MatDialog,
    private orderService: OrderService,
    private additinalServise: AdditionalComponentsService,
    @Inject(MAT_DIALOG_DATA) public data: { currentTovary: ITovaryResponse }
  ) {}

  ngOnInit(): void {
    this.getProduct();
  }
  closeModal(): void {
    this.dialog.closeAll();
  }
  getProduct(): void {
    this.additinalServise.getAllFirebase().subscribe((data) => {
      this.additionalComponents = data as IAdditionalComponensResponse[];
    });
  }
  addProduct(productName: string, index: number, price: string): void {
    const parsedPrice = parseFloat(price);
    this.selectedProducts.push({
      name: productName,
      index,
      price: parsedPrice,
    });
    this.additionalComponents[index].class = 'active';
    this.totalPrice += parsedPrice;
  }
  removeProduct(index: number): void {
    const removedProduct = this.selectedProducts.splice(index, 1)[0];
    this.additionalComponents[removedProduct.index].class = '';
    this.totalPrice -= removedProduct.price;
  }
  tovarCount(tovary: ITovaryResponse, value: boolean): void {
    if (value) {
      ++tovary.count;
    } else if (!value && tovary.count > 1) {
      --tovary.count;
    }
  }
  addBasket(tovar: ITovaryResponse): void {
    let basket: Array<ITovaryResponse> = [];

    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      basket = JSON.parse(localStorage.getItem('basket') as string);

      const existingProductIndex = basket.findIndex(
        (prod) => prod.id === tovar.id
      );

      if (existingProductIndex !== -1) {
        basket[existingProductIndex].count += tovar.count;
        if (!basket[existingProductIndex].additionalProducts) {
          basket[existingProductIndex].additionalProducts = [];
        }
        this.selectedProducts.forEach((product) => {
          const existingAdditionalProduct = basket[
            existingProductIndex
          ].additionalProducts?.find((p) => p.name === product.name);
          if (existingAdditionalProduct) {
            existingAdditionalProduct.price += product.price;
          } else {
            basket[existingProductIndex].additionalProducts?.push(product);
          }
        });
      } else {
        tovar.additionalProducts = [...this.selectedProducts];
        basket.push(tovar);
      }
    } else {
      tovar.additionalProducts = [...this.selectedProducts];
      basket.push(tovar);
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    tovar.count = 1;
    this.orderService.changeBasket.next(true);
    this.selectedProducts = [];
  }
}
