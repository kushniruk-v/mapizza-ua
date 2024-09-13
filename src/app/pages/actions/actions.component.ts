import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IActionResponse } from '../../shared/interfaces/action/action-interface';
import { ActionService } from '../../shared/services/action/action.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {
  userAction: Array<IActionResponse> = [];
  constructor(
    private actionService: ActionService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getAction();
  }
  getAction(): void {
    this.actionService.getAllFirebase().subscribe((data) => {
      this.userAction = data as IActionResponse[];
    });
  }
}
