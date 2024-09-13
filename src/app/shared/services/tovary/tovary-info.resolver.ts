import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { TovaryService } from './tovary.service';

@Injectable({
  providedIn: 'root',
})
export class TovaryInfoResolver {
  constructor(private TovaryService: TovaryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.TovaryService.getOneFirebase(
      route.paramMap.get('id') as string
    );
  }
}
