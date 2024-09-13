import { Pipe, PipeTransform } from '@angular/core';
import { ITovaryResponse } from '../interfaces/tovary/tovary-interface';

@Pipe({
  name: 'filter',
})
export class Filter implements PipeTransform {
  transform(tovary: ITovaryResponse[], category: string): ITovaryResponse[] {
    return tovary.filter((tovar) => tovar.category.path === category);
  }
}
