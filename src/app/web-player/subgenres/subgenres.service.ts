import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {Subgenre} from '../../models/Subgenre';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {BackendResponse} from '@common/core/types/backend-response';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {MixedArtist} from '../artists/mixed-artist';

@Injectable({
    providedIn: 'root'
})
export class Subgenres {
    constructor(private httpClient: AppHttpClient) {}

    public create(params: Partial<Subgenre>): BackendResponse<{subgenre: Subgenre}> {
        return this.httpClient.post('subgenres', params);
    }

    public update(id: number, params: Partial<Subgenre>): BackendResponse<{subgenre: Subgenre}> {
        return this.httpClient.put('subgenres/' + id, params);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.httpClient.delete('subgenres', {ids});
    }

    public get(name: string, params = {}): BackendResponse<{subgenre: Subgenre, artists: PaginationResponse<MixedArtist>}> {
        return this.httpClient.get(`genres/${name}`, params);
    }
    public getAll(params: {perPage?: number, permission?: string, query?: string, limit?: number} = {}): Observable<Subgenre[]> {
        return this.httpClient.get(`genres`, params).pipe(map(response => response['pagination']['data']));
    }
    public getAllSub(params: {perPage?: number, permission?: string, query?: string, limit?: number} = {}): Observable<Subgenre[]> {
        return this.httpClient.get(`subgenres`, params).pipe(map(response => response['pagination']['data']));
    }
    public getall(): BackendResponse<{subgenre: Subgenre}> {
        return this.httpClient.get(`allsubgenres`);
    }
}
