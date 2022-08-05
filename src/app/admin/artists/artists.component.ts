import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Artist} from '../../models/Artist';
import {Artists} from '../../web-player/artists/artists.service';
import {CurrentUser} from '@common/auth/current-user';
import {WebPlayerUrls} from '../../web-player/web-player-urls.service';
import {DatatableService} from '../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';
import {Toast} from '@common/core/ui/toast.service';

@Component({
    selector: 'artists',
    templateUrl: './artists.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DatatableService],
})
export class ArtistsComponent implements OnInit {
    public artists$ = this.datatable.data$ as Observable<Artist[]>;
    constructor(
        public datatable: DatatableService<Artist>,
        private artists: Artists,
        public currentUser: CurrentUser,
        public urls: WebPlayerUrls,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.datatable.sort$.next({orderBy: 'spotify_popularity'});
        this.datatable.init({
            uri: 'artists',
        });
    }

    public maybeDeleteSelectedArtists() {
        this.datatable.confirmResourceDeletion('artists').subscribe(() => {
            this.artists.delete(this.datatable.selectedRows$.value).subscribe(() => {
                this.toast.open('Artist deleted.');
                this.datatable.reset();
            });
        });
    }
}
