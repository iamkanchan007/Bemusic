import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {Bpm} from '../../models/Bpm';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {BackendResponse} from '@common/core/types/backend-response';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {MixedArtist} from '../artists/mixed-artist';

@Injectable({
    providedIn: 'root'
})
export class Bpms {
    constructor(private httpClient: AppHttpClient) {}

    public create(params: Partial<Bpm>): BackendResponse<{bpm: Bpm}> {
        return this.httpClient.post('bpms', params);
    }

    public update(id: number, params: Partial<Bpm>): BackendResponse<{bpm: Bpm}> {
        return this.httpClient.put('bpms/' + id, params);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.httpClient.delete('bpms', {ids});
    }

    public get(name: string, params = {}): BackendResponse<{bpm: Bpm, artists: PaginationResponse<MixedArtist>}> {
        return this.httpClient.get(`genres/${name}`, params);
    }
    public getAll(params: {perPage?: number, permission?: string, query?: string, limit?: number} = {}): Observable<Bpm[]> {
        return this.httpClient.get(`genres`, params).pipe(map(response => response['pagination']['data']));
    }
    public getAllSub(params: {perPage?: number, permission?: string, query?: string, limit?: number} = {}): Observable<Bpm[]> {
        return this.httpClient.get(`bpms`, params).pipe(map(response => response['pagination']['data']));
    }
    public getall(): BackendResponse<{bpm: Bpm}> {
        return this.httpClient.get(`allbpms`);
    }
}
