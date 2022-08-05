import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {AuthService} from '@common/auth/auth.service';
import {DatatableService} from '../../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';
import {PaymentHistory} from '../../../models/PaymentHistory';
import {PaymentsHistory} from '../../../web-player/payments/payments-history.service';
import {CurrentUser} from '@common/auth/current-user';
@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [DatatableService],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent implements OnInit {
  public payments$ = this.paymentsDatatable.data$ as Observable<PaymentHistory[]>;
  public paymentsdata:any = [];
  constructor(
    public auth: AuthService,
    public PaymentsHistory: PaymentsHistory,
    public paymentsDatatable: DatatableService<PaymentHistory>, 
    public currentUser: CurrentUser) {
  }

  ngOnInit(): void {
    this.PaymentsHistory.transections(this.currentUser.get('id')).subscribe((response) => {
        this.paymentsdata = response;
    });
    this.paymentsDatatable.init({uri: `current/plans/${this.currentUser.get('id')}`});
  }
}
