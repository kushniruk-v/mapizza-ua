import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../shared/services/account/account.service';
import { Timestamp } from 'firebase/firestore';
import { map } from 'rxjs';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
})
export class UserprofileComponent {
  public isActive = false;
  public user: any = null;
  public orders: any[] = [];
  private userId: string | null = null;
  constructor(private accountService: AccountService, private router: Router) {
    const currentUser = JSON.parse(
      localStorage.getItem('currentUser') as string
    );
    this.userId = currentUser ? currentUser.uid : null;
  }

  ngOnInit(): void {
    if (this.userId) {
      this.accountService.getCurrentUser().subscribe((user) => {
        if (user) {
          this.user = {
            ...user,
            birthday: this.convertTimestampToDate(user.birthday),
          };
          this.orders = user.orders || [];
        }
      });
    }
    this.loadUserProfile();
  }
  loadUserProfile(): void {
    this.user = this.accountService.getCurrentUser().pipe(
      map((user) => {
        if (user) {
          return {
            ...user,
            birthday: this.convertTimestampToDate(user.birthday),
          };
        }
        return null;
      })
    );
  }
  convertTimestampToDate(timestamp: Timestamp): string {
    if (!timestamp) {
      return '';
    }
    const date = timestamp.toDate();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  logOut(): void {
    this.router.navigate(['/']);
    localStorage.removeItem('currentUser');
  }
}
