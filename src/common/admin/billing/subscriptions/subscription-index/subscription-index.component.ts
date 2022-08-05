import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {CrupdateSubscriptionModalComponent} from '../crupdate-subscription-modal/crupdate-subscription-modal.component';
import {Subscription} from '@common/shared/billing/models/subscription';
import {Subscriptions} from '@common/shared/billing/subscriptions.service';
import {CurrentUser} from '@common/auth/current-user';
import {Toast} from '@common/core/ui/toast.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {DatatableService} from '../../../../datatable/datatable.service';
import {Modal} from '../../../../core/ui/dialogs/modal.service';

import {AnalyticsHeaderData, AnalyticsResponse} from '@common/admin/analytics/types/analytics-response';
import {HttpCacheClient} from '@common/core/http/http-cache-client';
import {ReplaySubject} from 'rxjs';

@Component({
    selector: 'subscription-index',
    templateUrl: './subscription-index.component.html',
    styleUrls: ['./subscription-index.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DatatableService],
})
export class SubscriptionIndexComponent implements OnInit {
    public loading$ = new BehaviorSubject<boolean>(false);
    public subscriptions$ = this.datatable.data$ as Observable<Subscription[]>;
    public headerData = null;
    public loading2$ = new ReplaySubject<boolean>(1);

    constructor(
        private modal: Modal,
        private subscriptions: Subscriptions,
        public currentUser: CurrentUser,
        private toast: Toast,
        public datatable: DatatableService<Subscription>,
        private http: HttpCacheClient,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: Subscriptions.BASE_URI,
        });
        this.loading2$.next(true);
        this.http.get<AnalyticsResponse>('admin/analytics/stats', {channel: 'default'})
            .pipe(finalize(() => this.loading2$.next(false)))
            .subscribe(response => {
                this.headerData = response.headerData;
            });
    }

    public maybeCancelSubscription(subscription: Subscription) {
        this.modal.open(ConfirmModalComponent, {
            title: 'Cancel Subscription',
            body: 'Are you sure you want to cancel this subscription?',
            bodyBold: 'This will cancel or suspend subscription based on its gateway and put user on grace period until their next scheduled renewal date and allow them to renew the subscription.',
            ok: 'Cancel',
            cancel: 'Go Back'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.cancelOrDeleteSubscription(subscription, {delete: false});
        });
    }

    public maybeDeleteSubscription(subscription: Subscription) {
        this.modal.open(ConfirmModalComponent, {
            title: 'Delete Subscription',
            body: 'Are you sure you want to delete this subscription?',
            bodyBold: 'This will permanently delete user subscription and immediately cancel it on billing gateway.',
            ok: 'Delete',
            cancel: 'Go Back'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.cancelOrDeleteSubscription(subscription, {delete: true});
        });
    }

    private cancelOrDeleteSubscription(subscription: Subscription, params: {delete?: boolean} = {}) {
        this.loading$.next(true);
        this.subscriptions.cancel(subscription.id, {delete: params.delete})
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(() => {
                this.datatable.reset();
                this.toast.open('Subscription Deleted.');
            });
    }

    public openCrupdateSubscriptionModal(subscription?: Subscription) {
        this.modal.open(CrupdateSubscriptionModalComponent, {subscription})
            .afterClosed()
            .subscribe(newSubscription => {
                if ( ! newSubscription) return;
                this.datatable.reset();
            });
    }

    public toggleEnable(e, id) {
        if(e.checked){
            this.toast.open('We can not enable subscription again.');
            this.datatable.reset();
            // this.subscriptions.enable(id).subscribe(() => {
            //     this.toast.open('Enable successfully.');
            //     this.datatable.reset();
            // });
        } else {
            this.subscriptions.disable(id).subscribe(() => {
                this.toast.open('Disable successfully.');
                this.datatable.reset();
            });
        }
    }
}
