import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Subgenres} from '../subgenres.service';
import {Subgenre} from '../../../models/Subgenre';
import {WebPlayerState} from '../../web-player-state.service';
import {catchError, mergeMap} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
import {BackendResponse} from '@common/core/types/backend-response';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {MixedArtist} from '../../artists/mixed-artist';

@Injectable({
    providedIn: 'root'
})
export class GenreArtistsResolver implements Resolve<BackendResponse<{subgenre: Subgenre, artists: PaginationResponse<MixedArtist>}>> {

    constructor(
        private subgenres: Subgenres,
        private router: Router,
        private state: WebPlayerState
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BackendResponse<{subgenre: Subgenre, artists: PaginationResponse<MixedArtist>}> {
        this.state.loading = true;
        const name = route.paramMap.get('name');

        return this.subgenres.get(name).pipe(
            catchError(() => {
                this.state.loading = false;
                this.router.navigate(['/']);
                return EMPTY;
            }),
            mergeMap(response => {
                this.state.loading = false;

                if (response.artists) {
                    return of(response);
                } else {
                    this.router.navigate(['/']);
                    return EMPTY;
                }
            })
        );
    }
}
