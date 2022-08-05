import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Tracks} from '../../../web-player/tracks/tracks.service';
import {FormattedDuration} from '../../../web-player/player/formatted-duration.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CurrentUser} from '@common/auth/current-user';
import {Track} from '../../../models/Track';
import {CrupdateLyricModalComponent} from '../../lyrics-page/crupdate-lyric-modal/crupdate-lyric-modal.component';
import {WebPlayerUrls} from '../../../web-player/web-player-urls.service';
import {DatatableService} from '../../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';
import {Toast} from '@common/core/ui/toast.service';
import {environment} from '../../../../environments/environment';
import {AnalyticsHeaderData, AnalyticsResponse} from '@common/admin/analytics/types/analytics-response';
import {HttpCacheClient} from '@common/core/http/http-cache-client';
import {finalize} from 'rxjs/operators';
import {ReplaySubject} from 'rxjs';

@Component({
    selector: 'track-index',
    templateUrl: './track-index.component.html',
    styleUrls: ['./track-index.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatatableService],
})
export class TrackIndexComponent implements OnInit {
    public tracks$ = this.datatable.data$ as Observable<Track[]>;
    public opentrack = null;

    public headerData = null;
    public loading$ = new ReplaySubject<boolean>(1);
    environment:any=environment;
    constructor(
        private modal: Modal,
        private tracks: Tracks,
        private toast: Toast,
        private duration: FormattedDuration,
        public currentUser: CurrentUser,
        public datatable: DatatableService<Track>,
        public urls: WebPlayerUrls,
        private http: HttpCacheClient,
    ) {}

    ngOnInit() {
        this.datatable.sort$.next({orderBy: 'date'});
        this.datatable.init({
            uri: 'tracks',
            staticParams: {with: 'artists',area: 'admin' }
            //staticParams: {}
        });
        this.loading$.next(true);
        this.http.get<AnalyticsResponse>('admin/analytics/stats', {channel: 'default'})
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.headerData = response.headerData[2];
                console.log(this.headerData);
            });
    }

    public openCrupdateLyricModal(track: Track) {
        this.modal.open(CrupdateLyricModalComponent, {track, lyric: track.lyric})
            .afterClosed().subscribe(lyric => {
            if ( ! lyric) return;
            track.lyric = lyric;
        });
    }

    public maybeDeleteSelectedTracks() {
        this.datatable.confirmResourceDeletion('tracks').subscribe(() => {
            const ids = this.datatable.selectedRows$.value;
            this.tracks.delete(ids).subscribe(() => {
                this.datatable.reset();
            });
        });
    }

    public toggleEnable(e, id) {
        if(e.checked){
            this.tracks.enable(id).subscribe(() => {
                this.toast.open('Enable successfully.');
                this.datatable.reset();
            });
        } else {
            this.tracks.disable(id).subscribe(() => {
                this.toast.open('Disable successfully.');
                this.datatable.reset();
            });
        }
    }
    public trackurl(track) {
        return this.environment.audio_base_url+track.url;
    }
    public openTrack(id) {
        if(this.opentrack == id){
            this.opentrack = null;
        } else {
            this.opentrack = id;
        }
    }
    public formatDuration(duration: number) {
        return this.duration.fromMilliseconds(duration); 
    }
}
