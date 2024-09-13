import { ActivatedRouteSnapshot, Resolve, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { ActionService } from './action.service';
import { Injectable } from '@angular/core';
import { IActionResponse } from '../../interfaces/action/action-interface';
@Injectable({
  providedIn: 'root'
})
export class ActionInfoResolver  implements Resolve <IActionResponse> {
  constructor(private actionService:ActionService ) {}
  resolve(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):any{
    return this.actionService.getOneFirebase(route.paramMap.get('id') as string );
  }
}
