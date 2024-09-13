import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICareerResponse } from '../../shared/interfaces/career/career-interface';
import { CareerService } from '../../shared/services/career/career.service';
@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss'],
})
export class CareerComponent {
  userCareer: Array<ICareerResponse> = [];
  private eventSubscription!: Subscription;
  constructor(private careerService: CareerService) {}
  ngOnInit(): void {
    this.getCareer();
  }
  getCareer(): void {
    this.careerService.getAllFirebase().subscribe((data) => {
      this.userCareer = data as ICareerResponse[];
    });
  }
}
