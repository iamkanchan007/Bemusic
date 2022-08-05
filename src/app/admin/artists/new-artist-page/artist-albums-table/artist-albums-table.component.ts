import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {CurrentUser} from '@common/auth/current-user';
import {WebPlayerImagesService} from '../../../../web-player/web-player-images.service';
import {Artist} from '../../../../models/Artist';
import {Album} from '../../../../models/Album';
import {Albums} from '../../../../web-player/albums/albums.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {CrupdateAlbumModalComponent} from '../crupdate-album-modal/crupdate-album-modal.component';
import {DatatableService} from '../../../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'artist-albums-table',
    templateUrl: './artist-albums-table.component.html',
    styleUrls: ['./artist-albums-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatatableService],
})
export class ArtistAlbumsTableComponent implements OnInit {
    @Input() artist: Artist;
    public albums$ = this.datatable.data$ as Observable<Album[]>;
    constructor(
        private modal: Modal,
        private albums: Albums,
        public currentUser: CurrentUser,
        public images: WebPlayerImagesService,
        public datatable: DatatableService<Album>,
    ) {}

    ngOnInit() {
        this.datatable.init({
            initialData: this.artist ? this.artist.albums.slice() : []
        });
    }

    public maybeDeleteAlbum(album: Album) {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Album',
            body: 'Are you sure you want to delete this album?',
            ok: 'Delete'
        }).beforeClosed().subscribe(async (confirmed) => {
            if ( ! confirmed) return;
            this.albums.delete([album.id]).subscribe(() => {
                this.datatable.data = this.datatable.data.filter(a => a.id !== album.id);
            });
        });
    }

    public openCrupdateAlbumModal(album?: Album) {
        this.modal.open(CrupdateAlbumModalComponent, {album, artist: this.artist}).afterClosed().subscribe(newAlbum => {
            if (newAlbum) {
                const oldData = [...this.datatable.data];
                if (album) {
                    const i = oldData.findIndex(a => a.id === newAlbum.id);
                    oldData[i] = newAlbum;
                } else {
                    oldData.unshift(newAlbum);
                }
                this.datatable.data = oldData;
            }
        });
    }
}
