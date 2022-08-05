import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Settings} from '@common/core/config/settings.service';
import {Albums} from '../../../web-player/albums/albums.service';
import {Album} from '../../../models/Album';
import {CurrentUser} from '@common/auth/current-user';
import {WebPlayerUrls} from '../../../web-player/web-player-urls.service';
import {WebPlayerImagesService} from '../../../web-player/web-player-images.service';
import {DatatableService} from '../../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';
import {Toast} from '@common/core/ui/toast.service';

@Component({
    selector: 'album-index',
    templateUrl: './album-index.component.html',
    styleUrls: ['./album-index.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatatableService],
})
export class AlbumIndexComponent implements OnInit {
    public albums$ = this.datatable.data$ as Observable<Album[]>;
    constructor(
        public datatable: DatatableService<Album>,
        private settings: Settings,
        private albums: Albums,
        public currentUser: CurrentUser,
        private toast: Toast,
        public urls: WebPlayerUrls,
        public images: WebPlayerImagesService,
    ) {}

    ngOnInit() {
        this.datatable.sort$.next({orderBy: 'spotify_popularity'});
        this.datatable.init({
            uri: 'albums',
            staticParams: {withCount: 'tracks'}
        });
    }

    public maybeDeleteSelectedAlbums() {
        this.datatable.confirmResourceDeletion('albums').subscribe(() => {
            this.albums.delete(this.datatable.selectedRows$.value).subscribe(() => {
                this.toast.open('Album deleted.');
                this.datatable.reset();
            });
        });
    }
}
