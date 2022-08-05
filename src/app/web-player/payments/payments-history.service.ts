import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {PaymentHistory} from '../../models/PaymentHistory';
import {BackendResponse} from '@common/core/types/backend-response';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';

@Injectable({
    providedIn: 'root'
})
export class PaymentsHistory {
    constructor(private httpClient: AppHttpClient) {}
 
    public get(name: string, params = {}): BackendResponse<{payments: PaymentHistory}> {
        return this.httpClient.get(`current/${name}`, params);
    }
    public transections(id, params = {}) {
        return this.httpClient.get(`usertransections/${id}`, params);
    }
}
