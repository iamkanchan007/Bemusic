import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {Key} from '../../models/Key';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {BackendResponse} from '@common/core/types/backend-response';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {MixedArtist} from '../artists/mixed-artist';

@Injectable({
    providedIn: 'root'
})
export class Keys {
    constructor(private httpClient: AppHttpClient) {}

    public create(params: Partial<Key>): BackendResponse<{subgenre: Key}> {
        return this.httpClient.post('keys', params);
    }

    public update(id: number, params: Partial<Key>): BackendResponse<{subgenre: Key}> {
        return this.httpClient.put('keys/' + id, params);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.httpClient.delete('keys', {ids});
    }

    public get(name: string, params = {}): BackendResponse<{subgenre: Key, artists: PaginationResponse<MixedArtist>}> {
        return this.httpClient.get(`genres/${name}`, params);
    }
    public getAll(params: {perPage?: number, permission?: string, query?: string, limit?: number} = {}): Observable<Key[]> {
        return this.httpClient.get(`genres`, params).pipe(map(response => response['pagination']['data']));
    }
    public getAllSub(params: {perPage?: number, permission?: string, query?: string, limit?: number} = {}): Observable<Key[]> {
        return this.httpClient.get(`keys`, params).pipe(map(response => response['pagination']['data']));
    }
    public getall(): BackendResponse<{subgenre: Key}> {
        return this.httpClient.get(`allkeys`);
    }
}
