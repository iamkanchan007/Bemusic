import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {Categorie} from '../../models/Categorie';
import {BackendResponse} from '@common/core/types/backend-response';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {MixedArtist} from '../artists/mixed-artist';

@Injectable({
    providedIn: 'root'
})
export class Categories {
    constructor(private httpClient: AppHttpClient) {}

    public create(params: Partial<Categorie>): BackendResponse<{categorie: Categorie}> {
        return this.httpClient.post('categories', params);
    }

    public update(id: number, params: Partial<Categorie>): BackendResponse<{categorie: Categorie}> {
        return this.httpClient.put('categories/' + id, params);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.httpClient.delete('categories', {ids});
    }

    public get(name: string, params = {}): BackendResponse<{categorie: Categorie, artists: PaginationResponse<MixedArtist>}> {
        return this.httpClient.get(`categories/${name}`, params);
    }
}
