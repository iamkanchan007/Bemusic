import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {Track} from '../../../models/Track';
import {Player} from '../../player/player.service';
import {FormattedDuration} from '../../player/formatted-duration.service';
import {Album} from '../../../models/Album';
import {WpUtils} from '../../web-player-utils';
import {Tracks} from '../tracks.service';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {TrackContextMenuComponent} from '../track-context-menu/track-context-menu.component';
import {PlaylistTrackContextMenuComponent} from '../../playlists/playlist-track-context-menu/playlist-track-context-menu.component';
import {SelectedTracks} from './selected-tracks.service';
import {Subscription} from 'rxjs';
import {WebPlayerState} from '../../web-player-state.service';
import {Toast} from '../../../../common/core/ui/toast.service'
import {CurrentUser} from '@common/auth/current-user';
import {downloadFileFromUrl} from '@common/uploads/utils/download-file-from-url';
import {BrowserEvents} from '@common/core/services/browser-events.service';
import {ContextMenu} from '@common/core/ui/context-menu/context-menu.service';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {A, DELETE} from '@angular/cdk/keycodes';
import {DatatableService} from '@common/datatable/datatable.service';
import {BehaviorSubject, Observable} from 'rxjs';
@Component({
    selector: 'track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.scss'],
    providers: [SelectedTracks],
})
export class TrackListComponent implements OnInit, OnDestroy {
    protected subscriptions: Subscription[] = [];

    @Input() dataSource: DatatableService<Track>;
    @Input() dataSourceTrending: DatatableService<Track>;
    @Input() album: Album = new Album();

    
    
    // Added by vikram for trending list
    @Input() showTrendingList = false;
    // Added by vikram for trending list

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
    isVersionTrack: boolean=false;
    versionTracks: any=[];
    expandedIndex:any=[];
    gaane: any=[];
    public loading$ = new BehaviorSubject<boolean>(false);
    constructor(
        public currentUser: CurrentUser,
        public toast: Toast,
        public tracksService: Tracks,
        public player: Player,
        private duration: FormattedDuration,
        public urls: WebPlayerUrls,
        private contextMenu: ContextMenu,
        private zone: NgZone,
        private el: ElementRef,
        public selectedTracks: SelectedTracks,
        private browserEvents: BrowserEvents,
        public state: WebPlayerState,
    ) {}

    ngOnInit() {
        this.dataSource.data$.subscribe(elements=>{
            this.gaane=elements;
        })
        this.bindHammerEvents();
        this.bindKeyboardShortcuts();
        this.reorderEnabled = !!this.orderChanged.observers.length && !this.state.isMobile;
        if (this.select) {
            this.selectedTracks.add(this.select);
        }
        // this.dataSource.data$.subscribe(res => {
        //     console.log(res, '909090909090',);
        // })
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.subscriptions = [];
    }
    expandRow(_index){
        let index=this.urls.expandedIndex.indexOf(_index);
        if(index>=0){
            this.urls.expandedIndex.splice(index,1);
        }else{
            this.urls.expandedIndex.push(_index);
        }
    }
    public getTracks(): Track[] {
        return  this.showTrendingList ? this.dataSourceTrending.data$.value : this.dataSource.data$.value;
    }

    public trackIsPlaying(track: Track) {
        return this.player.isPlaying() && this.player.cued(track);
    }

    public playTrack(track: Track, index: number) {
        this.isVersionTrack=false;
        this.player.stop();
        this.player.wavePauseTime=0;
        if (this.player.cued(track)) {
            this.player.play();
        } else {
            
            this.playFrom(index);
        }
    }
    public playVersionTrack(tracks: any, vTrack:Track, vIndex: number) {
        this.isVersionTrack=true;
        this.player.stop();
        this.player.wavePauseTime=0;
        this.versionTracks=tracks;
        if (this.player.cued(vTrack)) {    
            this.player.play();
        } else {
            
            this.playFrom(vIndex);
        }
    }
    public async toggleTrackPlayback(track: Track, index: number) {
        if (this.trackIsPlaying(track)) {
            this.player.pause();
        } else {
            this.playTrack(track, index);
        }
    }
    isDownloaded(count: number, downloads){
        return downloads == 0 ? '' : (downloads >= count) ? 'text-success' : ''
      }
      downloadTrack(id:number, _index: number): void{
        let storeLocation;
        let downloads=null;
        this.dataSource.data$.subscribe((elements) => {
          storeLocation = elements[_index]
          downloads = storeLocation['user_downloads']
          
          
        });
        console.log(downloads)
        if(downloads != null){
            if(downloads == 3){
                setTimeout(()=>{
                    this.loading$.next(false);
                   },1000) 
              this.toast.open('Download limit reached for this song.');
              return 
            }
            this.loading$.next(true);
            this.tracksService.todayDownloads(this.currentUser.get('id')).subscribe((data:any)=>{
                setTimeout(()=>{
                    this.loading$.next(false);
                   },1000) 
                if(data < 250){
                    storeLocation['user_downloads'] += 1
                    downloadFileFromUrl(this.tracksService.downloadTrack(id,this.currentUser.get('id')))    
                }else {
                    this.toast.open('You can download only 250 tracks in a day.');
                }
            })
        }else{
            this.loading$.next(true);
            this.tracksService.todayDownloads(this.currentUser.get('id')).subscribe((data:any)=>{
                setTimeout(()=>{
                    this.loading$.next(false);
                   },1000) 
                if(data < 250){
                    storeLocation['user_downloads'] = 1
                    downloadFileFromUrl(this.tracksService.downloadTrack(id, this.currentUser.get('id')))   
                }else {
                    this.toast.open('You can download only 250 tracks in a day.');
                }
            })
        }
      }
    public showContextMenu(track: Track, e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.contextMenu.open(this.getContextMenuComponent(), e.target, {data: this.getContextMenuParams(track)});
    }

    /**
     * Get params needed to open context menu for track.
     */
    public getContextMenuParams(track: Track) {
        return Object.assign(
            {item: track, type: this.contextMenuParams.type, selectedTracks: this.selectedTracks},
            this.contextMenuParams.extra
        );
    }
    isVerDownloaded(count: number, downloads){
        return downloads == 0 ? '' : (downloads >= count) ? 'text-success' : ''
      }
    downloadTrackVersion(songId:number, versionId:number, songIndex: number, versionIndex: number): void{
        let storeLocation;
        let downloads=null;
        this.dataSource.data$.subscribe((elements) => {
            storeLocation = elements[songIndex]['track_versions'][versionIndex]
            downloads = storeLocation['download_count']
            //   console.log(downloads)
        });
        console.log(downloads);
       
        if(downloads != null){
            if(downloads == 3){
                setTimeout(()=>{
                    this.loading$.next(false);
                   },1000) 
                this.toast.open('Download limit reached for this song.');
                return
            }
            this.loading$.next(true);
            this.tracksService.todayDownloads(this.currentUser.get('id')).subscribe((data:any)=>{
                setTimeout(()=>{
                    this.loading$.next(false);
                   },1000) 
                if(data < 250){
                    storeLocation['download_count'] += 1
                    downloadFileFromUrl(this.tracksService.downloadTrackVersion(songId, versionId, this.currentUser.get('id')))    
                }else {
                    this.toast.open('You can download only 250 tracks in a day.');
                }
            })    
        }else{
            this.loading$.next(true);
            this.tracksService.todayDownloads(this.currentUser.get('id')).subscribe((data:any)=>{ 
                setTimeout(()=>{
                    this.loading$.next(false);
                   },1000) 
                if(data < 250){
                    storeLocation['download_count'] = 1
                    downloadFileFromUrl(this.tracksService.downloadTrackVersion(songId, versionId, this.currentUser.get('id')))
                }else {
                    this.toast.open('You can download only 250 tracks in a day.');
                }
            })
        }
    }
    /**
     * Get context menu component based on specified type.
     */
    private getContextMenuComponent() {
        if (this.contextMenuParams.type === 'playlistTrack') {
            return PlaylistTrackContextMenuComponent;
        } else {
            return TrackContextMenuComponent;
        }
    }

    /**
     * Add tracks from specified index to player queue and start playback.
     */
    private playFrom(index: number) {
        if (this.overrideQueue) {
            let tracks =[];
            if(this.isVersionTrack){
                tracks = this.versionTracks.slice(index, this.versionTracks.length);
            }else{
                tracks = this.getTracks().slice(index, this.getTracks().length);
            }
            this.player.lastTrack=tracks[tracks.length-1];
            tracks = WpUtils.assignAlbumToTracks(tracks, this.album);

            this.player.overrideQueue({tracks, queuedItemId: this.queueItemId}).then(() => {
                if(!this.player.wavesurfer){
                    this.player.cuedTrack=true;
                    this.player.state.buffering=true;
                    setTimeout(()=>{
                        this.player.state.buffering=false;
                        this.player.play();
                    },500)
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
