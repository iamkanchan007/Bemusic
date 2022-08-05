import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CurrentUser} from '@common/auth/current-user';
import {WebPlayerImagesService} from '../../web-player/web-player-images.service';
import {Playlist} from '../../models/Playlist';
import {Playlists} from '../../web-player/playlists/playlists.service';
import {CrupdatePlaylistModalComponent} from '../../web-player/playlists/crupdate-playlist-modal/crupdate-playlist-modal.component';
import {DatatableService} from '../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';
import {WebPlayerUrls} from '../../web-player/web-player-urls.service';
import {environment} from '../../../environments/environment';
import {Toast} from '@common/core/ui/toast.service';

@Component({
    selector: 'playlists-page',
    templateUrl: './playlists-page.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DatatableService],
})
export class PlaylistsPageComponent implements OnInit {
    environment:any=environment;
    public playlists$ = this.datatable.data$ as Observable<Playlist[]>;
    constructor(
        public datatable: DatatableService<Playlist>,
        private playlists: Playlists,
        public currentUser: CurrentUser,
        public wpImages: WebPlayerImagesService,
        public urls: WebPlayerUrls,
         private toast: Toast,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: 'playlists',
        });
    }

    public showCrupdatePlaylistModal(playlist?: Playlist) {
        this.datatable.openCrupdateResourceModal(CrupdatePlaylistModalComponent, {playlist})
            .subscribe(() => {
                this.datatable.reset();
            });
    }

    public confirmPlaylistsDeletion() {
        this.datatable.confirmResourceDeletion('playlists').subscribe(confirmed => {
            const ids = this.datatable.selectedRows$.value;
            this.playlists.delete(ids).subscribe(() => {
                this.toast.open('Playlist deleted successfully.');
                this.datatable.reset();
            });
        });
    }
    getPlaylistImage(image){
        if(image){
            return this.environment.image_base_url+image;
        }
        return this.environment.image_base_url+"client/assets/images/default/album.png";
    }
}
