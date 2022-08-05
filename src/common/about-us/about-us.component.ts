import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import {CustomPage} from '../core/types/models/CustomPage';
import {Pages} from '../pages/shared/pages.service';

@Component({
  selector: 'about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutUsComponent implements OnInit {

   public page:any  = null;
  constructor(private pages: Pages) { }

  ngOnInit(): void {
    this.pages.getdata(3).subscribe(response => {
      console.log(response);
        this.page = response;
    });
  }

}
