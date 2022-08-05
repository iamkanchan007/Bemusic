import { Component, OnInit, ChangeDetectionStrategy, ElementRef, EventEmitter,Input,NgZone,OnDestroy,Output} from '@angular/core';
import {AuthService} from '@common/auth/auth.service';
import {DatatableService} from '@common/datatable/datatable.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Track} from '../../models/Track';
import {Playlist} from '../../models/Playlist';
import {Albums} from '../../web-player/albums/albums.service'
import {Album} from '../../models/Album';
import {Playlists} from '../../web-player/playlists/playlists.service'
import {Tracks} from '../../web-player/tracks/tracks.service';
import {CurrentUser} from '@common/auth/current-user';
import {downloadFileFromUrl} from '@common/uploads/utils/download-file-from-url';
import {Toast} from '../../../common/core/ui/toast.service';
import {Subscription} from 'rxjs';
import {BrowserEvents} from '@common/core/services/browser-events.service';
import {ContextMenu} from '@common/core/ui/context-menu/context-menu.service';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {A, DELETE} from '@angular/cdk/keycodes';
import { Player } from 'src/app/web-player/player/player.service';
import { FormattedDuration } from 'src/app/web-player/player/formatted-duration.service';
import { WebPlayerUrls } from 'src/app/web-player/web-player-urls.service';
import { SelectedTracks } from 'src/app/web-player/tracks/track-list/selected-tracks.service';
import { WebPlayerState } from 'src/app/web-player/web-player-state.service';
import { PlaylistTrackContextMenuComponent } from 'src/app/web-player/playlists/playlist-track-context-menu/playlist-track-context-menu.component';
import { TrackContextMenuComponent } from 'src/app/web-player/tracks/track-context-menu/track-context-menu.component';
import { WpUtils } from 'src/app/web-player/web-player-utils';
@Component({
  selector: 'label-dashboard',
  templateUrl: './label-dashboard.component.html',
  styleUrls: ['./label-dashboard.component.scss'],
  providers: [DatatableService],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelDashboardComponent implements OnInit {
    protected subscriptions: Subscription[] = [];

    @Input() dataSource: DatatableService<Track>;
    @Input() album: Album = new Album();

    @Input() showArtist = false;
    @Input() showAlbum = false;
    @Input() showPopularity = false;
    @Input() showAddedAt = false;
    @Input() showHeader = true;
    @Input() overrideQueue = true;

    @Input() queueItemId: string;
    @Input() contextMenuParams = {type: 'track', extra: {}};
    @Input() select: Track;

    @Output() delete = new EventEmitter();
    @Output() orderChanged: EventEmitter<CdkDragDrop<any>> = new EventEmitter();

    public reorderEnabled = false;
  public carouselData;
  public gaane$ = this.datatable.data$ as Observable<Track[]>;
  constructor(
    public auth: AuthService,
    public datatable: DatatableService<Track>,
    public tracksService: Tracks,
    public currentUser: CurrentUser,
    protected toast: Toast,
    public player: Player,
        private duration: FormattedDuration,
        public urls: WebPlayerUrls,
        private contextMenu: ContextMenu,
        private zone: NgZone,
        private el: ElementRef,
        public selectedTracks: SelectedTracks,
        private browserEvents: BrowserEvents,
        public state: WebPlayerState,) {
  }

  ngOnInit(): void {
    this.datatable.init({
      uri: `labeltracks/${this.currentUser.get('id')}`
    });
    this.getCarouselData();
    this.bindHammerEvents();
        this.bindKeyboardShortcuts();
        this.reorderEnabled = !!this.orderChanged.observers.length && !this.state.isMobile;
        if (this.select) {
            this.selectedTracks.add(this.select);
        }
  }
  downloadTrack(id:number, _index: number): void{
    this.gaane$.subscribe((elements) => {
      let storeLocation = elements[_index]
      let downloads = storeLocation['user_downloads']
      if(downloads != null){
        if(downloads == 3){
          this.toast.open('Download limit reached for this song.');
          return 
        }
        downloadFileFromUrl(this.tracksService.downloadTrack(id, this.currentUser.get('id')))
        storeLocation['user_downloads'] += 1
      }else{
        downloadFileFromUrl(this.tracksService.downloadTrack(id, this.currentUser.get('id')))
        storeLocation['user_downloads'] = 1
      }
      console.log(downloads)
    });
  }
 
  downloadTrackVersion(songId:number, versionId:number, songIndex: number, versionIndex: number): void{
    this.gaane$.subscribe((elements) => {
      let storeLocation = elements[songIndex]['track_versions'][versionIndex]
      let downloads = storeLocation['download_count']
      console.log(downloads);

      if(downloads > 0){
        if(downloads == 3){
          this.toast.open('Download limit reached for this song.');
          return
        }
        downloadFileFromUrl(this.tracksService.downloadTrackVersion(songId, versionId, this.currentUser.get('id')))
        storeLocation['download_count'] += 1
      }else{
        downloadFileFromUrl(this.tracksService.downloadTrackVersion(songId, versionId, this.currentUser.get('id')))
        storeLocation['download_count'] = 1
      }
    //   console.log(downloads)
    });
  }
  getCarouselData(){
    this.auth.getCarouselData().subscribe((res:any)=>{
    if(res.status == true){
          this.carouselData = res.data;
      }
    })
  }
  // isDownloaded(count: number, downloads){
  //   return downloads.length == 0 ? '' : (downloads[0]?.number_of_times >= count) ? 'text-success' : ''
  // }
  isDownloaded(count: number, downloads){
    return downloads == 0 ? '' : (downloads >= count) ? 'text-success' : ''
  }
  isVerDownloaded(count: number, downloads){
    return downloads == 0 ? '' : (downloads >= count) ? 'text-success' : ''
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
    });
    this.subscriptions = [];
}

public getTracks(): Track[] {
    return this.datatable.data$.value;
}

public trackIsPlaying(track: Track) {
    return this.player.isPlaying() && this.player.cued(track);
}

public playTrack(track: Track, index: number) {
    if (this.player.cued(track)) {
        this.player.play();
    } else {
        this.player.stop();
        this.playFrom(index);
    }
}

public async toggleTrackPlayback(track: Track, index: number) {
    if (this.trackIsPlaying(track)) {
        this.player.pause();
    } else {
        this.playTrack(track, index);
    }
}


/**
 * Add tracks from specified index to player queue and start playback.
 */
private playFrom(index: number) {
    if (this.overrideQueue) {
        let tracks = this.getTracks().slice(index, this.getTracks().length);

        tracks = WpUtils.assignAlbumToTracks(tracks, this.album);
        this.player.overrideQueue({tracks, queuedItemId: this.queueItemId}).then(() => {
          if(!this.player.wavesurfer){
            this.player.cuedTrack=true;
            this.player.state.buffering=true;
            setTimeout(()=>{
                this.player.state.buffering=false;
                this.player.play();
            },1000)
        }else{
          this.player.cuedTrack=false;
            this.player.play();
        }
        });
    } else {
        this.player.stop();
        this.player.queue.set(index);
        this.player.play();
    }
}

public formatTrackDuration(track: Track) {
    return this.duration.fromMilliseconds(track.duration);
}

/**
 * Bind handlers to needed hammer.js events.
 */
private bindHammerEvents() {
    let hammer, singleTap, doubleTap;

    this.zone.runOutsideAngular(() => {
        hammer = new Hammer.Manager(this.el.nativeElement);
        singleTap = new Hammer.Tap({event: 'singletap'});
        doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2});
        hammer.add([doubleTap, singleTap]);
    });

    // select track on tap or multiple tracks when ctrl is pressed
    hammer.on('singletap', e => {
        this.zone.run(() => {
            const data = this.getTrackFromEvent(e);

            if ( ! data || ! data.track) return;

            if (this.state.isMobile && !e.target.closest('.track-options-button, a')) {
                const i = this.getTracks().findIndex(t => t.id === data.track.id);
                this.toggleTrackPlayback(data.track, i);
            }

            if ( ! e.srcEvent.ctrlKey) {
                this.selectedTracks.clear();
                this.selectedTracks.add(data.track);
            } else {
                this.selectedTracks.toggle(data.track);
            }
        });
    });

    // play track on double tap
    hammer.on('doubletap', e => {
        this.zone.run(() => {
            const data = this.getTrackFromEvent(e);
            if ( ! data) return;
            this.playTrack(data.track, data.index);
        });
    });

    // deselect all tracks when clicked outside of track list.
    const sub = this.browserEvents.globalClick$.subscribe(e => {
        if ( ! (e.target as HTMLElement).closest('.track-list-row')) {
            this.selectedTracks.clear();
        }
    });

    this.subscriptions.push(sub);
}

/**
 * Get track from specified hammer tap event.
 */
private getTrackFromEvent(e: HammerInput): {track: Track, index: number} {
    if ( ! e.target) return;
    const row = e.target.closest('.track-list-row');
    if ( ! row) return;
    const id = +row.getAttribute('data-id');
    const i = this.getTracks().findIndex(track => track.id === id);
    return {track: this.getTracks()[i], index: i};
}

/**
 * Initiate tracks list shortcuts.
 */
private bindKeyboardShortcuts() {
    const sub = this.browserEvents.globalKeyDown$.subscribe((e: KeyboardEvent) => {
        // ctrl+a - select all tracks
        if (e.ctrlKey && e.keyCode === A) {
            this.getTracks().forEach(track => this.selectedTracks.add(track));
            e.preventDefault();

        // delete - fire delete event
        } else if (e.keyCode === DELETE && ! this.selectedTracks.empty()) {
            this.delete.emit(this.selectedTracks.all());
            this.selectedTracks.clear();
            e.preventDefault();
        }
    });

    this.subscriptions.push(sub);
}

public trackByFn = (i: number, track: Track) => track.id;

}
