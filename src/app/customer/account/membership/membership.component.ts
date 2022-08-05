import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@common/auth/auth.service';
import { CurrentUser } from '@common/auth/current-user';
import { PaymentsHistory } from '../../../web-player/payments/payments-history.service';
import { Subscriptions } from '@common/shared/billing/subscriptions.service';
import { Plans } from '@common/shared/billing/plans.service';
import { Plan } from '@common/core/types/models/Plan';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subscription } from '@common/shared/billing/models/subscription';
import { finalize, share } from 'rxjs/operators';
import { SubscriptionStepperState } from '@common/billing/subscriptions/subscription-stepper-state.service';
import { Modal } from '@common/core/ui/dialogs/modal.service';
import { ConfirmModalComponent } from '@common/core/ui/confirm-modal/confirm-modal.component';
import { Toast } from '@common/core/ui/toast.service';
import { User } from '@common/core/types/models/User';

@Component({
  selector: 'membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembershipComponent implements OnInit {
  public loading$ = new BehaviorSubject<boolean>(false);
  public activeSubscription$ = new BehaviorSubject<Subscription>(null);
  public currentMembership;
  public allPlans;
  public hasRecommendedPlan = false;
  public maximumFeaturesCount: number = 0;
  constructor(
    public auth: AuthService,
    public currentUser: CurrentUser,
    public paymentService: PaymentsHistory,
    private subscriptions: Subscriptions,
    private plansService: Plans,
    public state: SubscriptionStepperState,
    private modal: Modal,
    private toast: Toast
  ) { }

  ngOnInit(): void {
    this.hasRecommendedPlan = this.state.plans.filter(plan => plan.recommended).length > 0;
    this.activeSubscription$.next(this.currentUser.getSubscription());
    this.paymentService.get(`plans/${this.currentUser.get('id')}`).subscribe((res: any) => {
      if (res.status == 'success') {
        this.currentMembership = res.pagination.data;
      }
    })
    let params = {orderBy: 'position', orderDir: 'asc'} 
    this.plansService.all(params).subscribe(plans => {
      this.allPlans = plans.pagination.data;
      plans.pagination.data.filter(item => this.maximumFeaturesCount < item.features.length ? this.maximumFeaturesCount = item.features.length:this.maximumFeaturesCount)
      console.log('hello dream travel', plans.pagination.data)
    });
  }
  // cancelMembership() {
  //   this.loading$.next(true);

  //   const request = this.subscriptions.cancel(this.activeSubscription$.value.id, { delete: true })
  //     .pipe(finalize(() => this.loading$.next(false)))
  //     .pipe(share());

  //   request.subscribe(response => {

  //   });
  // }

  public userSubscribedToPlan(plan: Plan): boolean {
    if (this.state.mode !== 'pricing' && plan.free && !this.currentUser.model$?.value?.subscriptions?.length) {
      return true;
    }
    return !!this.currentUser.getSubscription({ planId: plan.id });
  }

  public selectPlanButtonText(plan: Plan) {
    if (this.userSubscribedToPlan(plan)) {
      return 'current';
    } else if (plan.free && this.state.mode === 'pricing') {
      return 'start';
    } else {
      return 'choose';
    }
  }

  public canCancel() {
    return this.currentUser.isSubscribed() && !this.currentUser.onGracePeriod();
  }
  public maybeCancelSubscription() {
    this.modal.open(ConfirmModalComponent, {
      title: 'Cancel Subscription',
      body: 'Are you sure you want to cancel your subscription?',
      ok: 'Yes, Cancel',
      cancel: 'Go Back'
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.cancelSubscription().subscribe(() => {
        this.toast.open('Subscription cancelled.');
      });
    });
  }
   /**
     * Cancel currently active user subscription.
     */
    private cancelSubscription(params: {delete?: boolean} = {}): Observable<{user: User}> {
      this.loading$.next(true);

      const request = this.subscriptions.cancel(this.activeSubscription$.value.id, {delete: params.delete})
          .pipe(finalize(() => this.loading$.next(false)))
          .pipe(share());

      request.subscribe(response => {
          // set new active subscription, if user had more then one
          this.updateUserAndSubscription(response.user);
      });

      return request;
  }
   /**
     * Update current user and active subscription.
     */
    private updateUserAndSubscription(user: User) {
      this.currentUser.assignCurrent(user);
      localStorage.setItem("cuser", JSON.stringify(user));
      this.activeSubscription$.next(this.currentUser.getSubscription());
  }
}
