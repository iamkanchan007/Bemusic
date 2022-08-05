import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import {CustomPage} from '../core/types/models/CustomPage';
import {Pages} from '../pages/shared/pages.service';

@Component({
  selector: 'terms-of-conditions',
  templateUrl: './terms-of-conditions.component.html',
  styleUrls: ['./terms-of-conditions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsOfConditionsComponent implements OnInit {

   public page:any  = null;
  constructor(private pages: Pages) { }

  ngOnInit(): void {
    this.pages.getdata(2).subscribe(response => {
      console.log(response);
        this.page = response;
    });
  }

}
