import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CurrentUser } from '@common/auth/current-user';
@Component({
  selector: 'record-labels',
  templateUrl: './record-labels.component.html',
  styleUrls: ['./record-labels.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordLabelsComponent implements OnInit {

  constructor(public currentUser: CurrentUser) { }

  ngOnInit(): void {
  }

}
