import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Tracks} from '../../web-player/tracks/tracks.service';
import {FormattedDuration} from '../../web-player/player/formatted-duration.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CurrentUser} from '@common/auth/current-user';
import {Track} from '../../models/Track';
import { Location } from '@angular/common'
import { ActivatedRoute } from '@angular/router';
//import {CrupdateLyricModalComponent} from '../lyrics-page/crupdate-lyric-modal/crupdate-lyric-modal.component';
import {WebPlayerUrls} from '../../web-player/web-player-urls.service';
import {Playlists} from '../../web-player/playlists/playlists.service';
import {DatatableService} from '../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';
import {Toast} from '@common/core/ui/toast.service';

@Component({
    selector: 'playlist-track',
    templateUrl: './playlist-track.component.html',
    styleUrls: ['./playlist-track.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatatableService],
})
export class PlaylistTrackComponent implements OnInit {
   public tracks$ = this.datatable.data$ as Observable<Track[]>;
    constructor(
        private location: Location,
        private modal: Modal,
        private tracks: Tracks,
        private duration: FormattedDuration,
        public currentUser: CurrentUser,
        public datatable: DatatableService<Track>,
        public urls: WebPlayerUrls,
        private toast: Toast,
        public playlists: Playlists,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.datatable.sort$.next({});
        this.datatable.init({
            uri: 'playlisttracks',
            staticParams: {playlistid: this.route.snapshot.paramMap.get('id')}
        });
    }

    public openCrupdateLyricModal(track: Track) {
        // this.modal.open(CrupdateLyricModalComponent, {track, lyric: track.lyric})
        //     .afterClosed().subscribe(lyric => {
        //     if ( ! lyric) return;
        //     track.lyric = lyric;
        // });
    }

    public locationback() {
        this.location.back();
    }
    public maybeDeleteSelectedTracks() {
        var self = this;
        this.datatable.confirmResourceDeletion('tracks').subscribe(() => {
            const ids = this.datatable.selectedRows$.value;
            this.playlists.removeplaylistTracks(self.route.snapshot.paramMap.get('id'), ids).subscribe(() => {
                this.toast.open('Track Removed.');
                this.datatable.reset();
            });
        });
    }

    public formatDuration(duration: number) {
        return this.duration.fromMilliseconds(duration);
    }
}
