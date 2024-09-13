import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ROLE } from '../../constans/role-constans';
import { AccountService } from '../../services/account/account.service';
import { map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.accountService.getCurrentUser().pipe(
      take(1),
      map((user) => {
        if (user && (user.role === ROLE.ADMIN || user.role === ROLE.USER)) {
          return true;
        }
        this.router.navigate(['']);
        return false;
      })
    );
  }
}
