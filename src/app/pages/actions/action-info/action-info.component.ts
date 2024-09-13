import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IActionResponse } from '../../../shared/interfaces/action/action-interface';

@Component({
  selector: 'app-action-info',
  templateUrl: './action-info.component.html',
  styleUrls: ['./action-info.component.scss'],
})
export class ActionInfoComponent {
  public currentAction!: IActionResponse;

  constructor(private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.currentAction = response['actionInfo'];
    });
  }
}
