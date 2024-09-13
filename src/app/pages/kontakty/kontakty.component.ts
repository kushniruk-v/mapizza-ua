import { Component } from '@angular/core';
import { createMask } from '@ngneat/input-mask';
@Component({
  selector: 'app-kontakty',
  templateUrl: './kontakty.component.html',
  styleUrls: ['./kontakty.component.scss'],
})
export class KontaktyComponent {
  telInputMask = createMask('+38 (999) 999 99 99');
}
