import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppHttpClient} from '../../core/http/app-http-client.service';
import {PaginationResponse} from '../../core/types/pagination/pagination-response';
import {User} from '../../core/types/models/User';
import {Subscription} from '@common/shared/billing/models/subscription';
import {Plan} from '@common/core/types/models/Plan';
import {BackendResponse} from '@common/core/types/backend-response';

export interface CreateSubOnStripeResponse {
    status: 'complete'|'requires_action';
    user?: User;
    payment_intent_secret: string|undefined;
    reference: string;
    end_date: string;
}

@Injectable({
    providedIn: 'root'
})
export class Subscriptions {
    static BASE_URI = 'billing/subscriptions';
    public selectedPromo:number;
    constructor(private http: AppHttpClient) {}

    public all(params?: object): Observable<PaginationResponse<Subscription>> {
        return this.http.get(Subscriptions.BASE_URI, params);
    }
    public getPromos(id: number): Observable<{subscription: Subscription}> {
        return this.http.get(`secure/promocodes-by-plan/${id}`);
    }
    public get(id: number): Observable<{subscription: Subscription}> {
        return this.http.get(`${Subscriptions.BASE_URI}/${id}`);
    }

    public createOnStripe(params: {plan_id: number, start_date?: string,coupon_id:number}, userId: number): Observable<CreateSubOnStripeResponse> {
        return this.http.post(`${Subscriptions.BASE_URI}/stripe/${userId}`, params);
    }

    public update(id: number, params: object): Observable<{subscription: Subscription}> {
        return this.http.put(`${Subscriptions.BASE_URI}/${id}`, params);
    }

    public create(params: object): Observable<{subscription: Subscription}> {
        return this.http.post(Subscriptions.BASE_URI, params);
    }

    public cancel(id: number, params: {delete: boolean}): Observable<{user: User}> {
        return this.http.delete(`${Subscriptions.BASE_URI}/${id}`, params);
    }

    public resume(id: number): Observable<{subscription: Subscription}> {
        return this.http.post(`${Subscriptions.BASE_URI}/${id}/resume`);
    }

    public changePlan(id: number, plan: Plan): Observable<{user: User}|{links: {approve: string}}> {
        return this.http.post(`${Subscriptions.BASE_URI}/${id}/change-plan`, {newPlanId: plan.id});
    }

    public addCard(token: string, userId: number): Observable<{user: User}> {
        return this.http.post(`billing/stripe/cards/add/${userId}`, {token});
    }
    public addPromo(promo_id: string, userId: number): Observable<{user: User}> {
        return this.http.post(`${Subscriptions.BASE_URI}/stripe/${userId}`, {coupon_id:promo_id});
    }
    public enable(id) {
        return this.http.get(`subscription/enable/${id}`);
    }

    public disable(id) {
        return this.http.get(`subscription/disable/${id}`);
    }

    public finalizeOnStripe(reference: string, userId: number): BackendResponse<CreateSubOnStripeResponse> {
        return this.http.post(`${Subscriptions.BASE_URI}/stripe/finalize`, {reference, userId});
    }
}
