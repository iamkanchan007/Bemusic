import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import {CustomPage} from '../core/types/models/CustomPage';
import {Pages} from '../pages/shared/pages.service';

@Component({
  selector: 'refund-policy',
  templateUrl: './refund-policy.component.html',
  styleUrls: ['./refund-policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefundPolicyComponent implements OnInit {

   public page:any  = null;
  constructor(private pages: Pages) { }

  ngOnInit(): void {
    this.pages.getdata(4).subscribe(response => {
      console.log(response);
        this.page = response;
    });
  }

}
