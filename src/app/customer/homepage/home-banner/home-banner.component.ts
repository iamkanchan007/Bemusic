import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {CurrentUser} from '@common/auth/current-user';
@Component({
  selector: 'home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeBannerComponent implements OnInit {

  constructor(public currentUser: CurrentUser) { }

  ngOnInit(): void {
  }

}
