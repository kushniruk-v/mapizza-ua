import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  public isActive = false;
  constructor(private router: Router) {}
  logOut(): void {
    this.router.navigate(['/']);
    localStorage.removeItem('currentUser');
  }
}
