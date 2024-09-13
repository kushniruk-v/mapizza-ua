import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITovaryResponse } from '../../../shared/interfaces/tovary/tovary-interface';
import { IAdditionalComponensResponse } from '../../../shared/interfaces/additional-components/additional-components-interface';
import { TovaryService } from '../../../shared/services/tovary/tovary.service';
import { OrderService } from '../../../shared/order/order.service';
import { AdditionalComponentsService } from '../../../shared/services/additional components/additional-components.service';
import { ProductDialogComponent } from '../../../components/product-dialog/product-dialog.component';

@Component({
  selector: 'app-tovary-info',
  templateUrl: './tovary-info.component.html',
  styleUrls: ['./tovary-info.component.scss'],
})
export class TovaryInfoComponent {
  @ViewChild('swiper1') swiper1: ElementRef | undefined;
  public currentTovary!: ITovaryResponse;
  public userTovary: Array<ITovaryResponse> = [];
  public additionalComponents: Array<IAdditionalComponensResponse> = [];

  public currentCategoryName!: string;
  selectedProducts: { name: string; index: number; price: number }[] = [];
  totalPrice: number = 0;

  public breakpointsConfig = {
    1200: {
      slidesPerView: 4,
    },
    992: {
      slidesPerView: 3,
    },
    575: {
      slidesPerView: 2,
    },
  };

  constructor(
    private tovaryServis: TovaryService,
    private activatedRoute: ActivatedRoute,

    private orderService: OrderService,
    public dialog: MatDialog,
    private router: Router,
    private additinalServise: AdditionalComponentsService
  ) {}
  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.currentTovary = response['tovaryInfo'];
    });
    this.getTovary();
    this.getProduct();
  }
  loadTovary(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  getTovary(): void {
    this.tovaryServis.getAllFirebase().subscribe((data) => {
      this.userTovary = data as ITovaryResponse[];
    });
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

  tovaryCount(tovary: ITovaryResponse, value: boolean): void {
    if (value) {
      ++tovary.count;
    } else if (!value && tovary.count > 1) {
      --tovary.count;
    }
  }
  tovaryCountfound(tovar: ITovaryResponse, value: boolean): void {
    if (value) {
      ++tovar.countFound;
    } else if (!value && tovar.countFound > 1) {
      --tovar.countFound;
    }
  }
  addToBasket(tovar: ITovaryResponse): void {
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
  openProductDialog(currentTovary: ITovaryResponse): void {
    this.dialog.open(ProductDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'product-dialog',
      autoFocus: false,
      data: { currentTovary },
    });
  }
}
