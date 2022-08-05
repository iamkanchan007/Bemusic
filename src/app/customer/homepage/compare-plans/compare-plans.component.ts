import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {Plans} from '@common/shared/billing/plans.service';

@Component({
  selector: 'compare-plans',
  templateUrl: './compare-plans.component.html',
  styleUrls: ['./compare-plans.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparePlansComponent implements OnInit {
  public allPlans: Array<any>;
  public maximumFeaturesCount: number = 0;
  constructor( private plans: Plans ) { }

  ngOnInit(): void {
    let params = {orderBy: 'position', orderDir: 'asc'} 
    this.plans.all(params).subscribe(res => {
      this.allPlans = res.pagination.data
      res.pagination.data.filter(item => this.maximumFeaturesCount < item.features.length ? this.maximumFeaturesCount = item.features.length:this.maximumFeaturesCount)
    })
  }

}
