import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import {CustomPage} from '../core/types/models/CustomPage';
import {Pages} from '../pages/shared/pages.service';
@Component({
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicyComponent implements OnInit {

  public page:any  = null;
  constructor(private pages: Pages) { }

  ngOnInit(): void {
    this.pages.getdata(1).subscribe(response => {
      console.log(response);
        this.page = response;
    });
  }

}
