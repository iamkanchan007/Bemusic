import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {Promocode} from '../../models/Promocode';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {BackendResponse} from '@common/core/types/backend-response';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {MixedArtist} from '../artists/mixed-artist';

@Injectable({
    providedIn: 'root'
})
export class Promocodes {
    constructor(private httpClient: AppHttpClient) {}

    public create(params: Partial<Promocode>): BackendResponse<{promocode: Promocode}> {
        return this.httpClient.post('promocodes', params);
    }

    public update(id: number, params: Partial<Promocode>): BackendResponse<{promocode: Promocode}> {
        return this.httpClient.put('promocodes/' + id, params);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.httpClient.delete('promocodes', {ids});
    }

    public get(name: string, params = {}): BackendResponse<{promocode: Promocode, artists: PaginationResponse<MixedArtist>}> {
        return this.httpClient.get(`genres/${name}`, params);
    }
    public getAll(params: {perPage?: number, permission?: string, query?: string, limit?: number} = {}): Observable<Promocode[]> {
        return this.httpClient.get(`genres`, params).pipe(map(response => response['pagination']['data']));
    }
    public getAllSub(params: {perPage?: number, permission?: string, query?: string, limit?: number} = {}): Observable<Promocode[]> {
        return this.httpClient.get(`promocodes`, params).pipe(map(response => response['pagination']['data']));
    }
    public getall(): BackendResponse<{promocode: Promocode}> {
        return this.httpClient.get(`allsubgenres`);
    }
}
