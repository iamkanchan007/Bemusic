import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    NgZone,
    OnDestroy,
    ViewChild
} from '@angular/core';
import {Track} from '../../../../models/Track';
import {Subscription} from 'rxjs';
import {FormattedDuration} from '../../formatted-duration.service';
import {Player} from '../../player.service';
import {Album} from '../../../../models/Album';
import {queueId} from '../../queue-id';

@Directive()
export abstract class BasePlayerSeekbar implements AfterViewInit, OnDestroy {
    @Input() track: Track;
    @Input() album: Album;
    @Input() startPlaybackOnSeek = false;

    @ViewChild('outerTrack', { static: true }) protected outerTrack: ElementRef;
    @ViewChild('progressTrack', { static: true }) protected progressTrack: ElementRef;
    @ViewChild('progressHandle', { static: true }) protected progressHandle: ElementRef;
    @ViewChild('elapsedTimeEl', { static: true }) protected elapsedTimeEl: ElementRef;
    @ViewChild('trackLengthEl', { static: true }) protected trackLengthEl: ElementRef;

    protected abstract el: ElementRef<HTMLElement>;
    protected abstract duration: FormattedDuration;
    protected abstract player: Player;
    protected abstract zone: NgZone;
    protected seekbarInterval;
    public elapsedTime = '0:00';
    public trackLength = 0;
    protected subscriptions: Subscription[] = [];

    protected cache: {
        outerTrackRect?: ClientRect,
        // handleRect?: ClientRect,
        // handlePercent?: number,
        // handleEl?: HTMLElement,
        // progressTrackEl?: HTMLElement
    } = {};

    ngAfterViewInit() {
        // wait for animations to complete
        // TODO: refactor this to use events instead
        setTimeout(() => {
            // this.setupCache();
            this.bindToPlayerStateEvents();
            this.track=this.track;
            this.setTrackLength();
            this.bindHammerEvents();
        }, 201);
    }

    ngOnDestroy() {
        this.stopSeekbarInterval();
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.subscriptions = [];
    }

    protected setupCache() {
        this.cache.outerTrackRect = this.outerTrack.nativeElement.getBoundingClientRect();
        // this.cache.handleRect = this.progressHandle.nativeElement.getBoundingClientRect();
        // this.cache.handlePercent = (this.cache.handleRect.width / this.cache.outerTrackRect.width) * 100 / 2;
        // this.cache.handleEl = this.progressHandle.nativeElement;
        // this.cache.progressTrackEl = this.progressTrack.nativeElement;
    }


    protected setElapsedTime(time=null):void {
        if (time === null) time = this.player.wavesurfer.getCurrentTime();
        if (time != null && isFinite(time)) {
            if(Math.ceil(time)>=60){
                this.player.wavePauseTime=60;
                time=60;
            }
            
            this.elapsedTime = this.duration.fromSeconds(time);
            this.elapsedTimeEl.nativeElement.textContent = this.elapsedTime;
        }
    }

    protected setTrackLength() {
        let duration = this.player.getDuration() || (this.getTrack() ? (this.getTrack().duration / 1000) :null);
        let waveDuration=this.player.wavesurfer.getDuration();
        if ( duration === null || duration === this.trackLength) {
            return;
        }
        if(duration > waveDuration){
            duration=waveDuration;
        }
        this.trackLength = ((duration>0) && (duration<=60))?duration:60;
        this.trackLengthEl.nativeElement.textContent = this.duration.fromSeconds(this.trackLength);
    }

    public seek(clickX: number) {
        if ( ! this.player.cued()) return;

        this.stopSeekbarInterval();

        const rect = this.cache.outerTrackRect;
        const ratio   = (clickX - rect.left) / rect.width,
            percent = ratio * 100;

        if (percent > 100) return;

        this.positionElapsedTrackAndHandle(percent);

        let duration = this.player.getDuration() ||
            (this.track ? this.track.duration / 1000 : 0);
            duration=((duration>0) && (duration<=60))?duration:60;
        return ratio * duration;
    }

    public startSeekbarInterval() {
        this.stopSeekbarInterval();
        this.zone.runOutsideAngular(() => {
            this.seekbarInterval = setInterval(() => {
                const time = this.player.wavesurfer.getCurrentTime();
                let aduration = (this.player.getDuration() || (this.getTrack() ? (this.getTrack().duration / 1000) :null));
                let waveDuration=this.player.wavesurfer.getDuration();
                waveDuration=Math.round(waveDuration);
                if(aduration > waveDuration){
                    aduration=waveDuration;
                }
                
                let duration=((aduration>0) && (aduration<=60))?aduration:60;
                let current=this.duration.fromSeconds(time);
                let aend=this.duration.fromSeconds(aduration);
                let end=this.duration.fromSeconds(duration);
                
                if((current==end) && (current != aend) ){
                    this.player.pause();
                }
                if((current==end) && (current == aend) ){
                    this.player.wavePauseTime=0;
                    let track=this.getTrack();
                    console.log(track,this.player.lastTrack);
                    let tracks=JSON.parse(localStorage.getItem('player.queue'));
                    tracks=tracks.tracks;
                    let lastTrack=tracks[tracks.length-1];

                    if(track.id==lastTrack.id){
                        this.player.stop();
                    }else{
                        this.player.playNext();
                    }  
                }
                this.positionElapsedTrackAndHandle(0);

                this.setElapsedTime();
                this.setTrackLength();
            }, 50);
        });
    }

    public stopSeekbarInterval() {
        if ( ! this.seekbarInterval) return;
        
        clearInterval(this.seekbarInterval);
        this.seekbarInterval = null;
    }

    protected positionElapsedTrackAndHandle(leftPercent: number) {
        // let handleLeft = leftPercent - this.cache.handlePercent;

        // if (leftPercent < 0) leftPercent = 0;
        // if (handleLeft < 0) handleLeft = 0;

        // this.cache.handleEl.style.left = handleLeft + '%';
        // this.cache.progressTrackEl.style.width = leftPercent + '%';
        
        if(!this.player.state.playing){
            const pauseTime = this.player.wavesurfer.getCurrentTime();
            this.player.wavePauseTime=Math.ceil(pauseTime)>=60?60:pauseTime;
        }
        let time=this.player.wavesurfer.getCurrentTime();
        // if((Math.ceil(this.player.getCurrentTime())==1) && (Math.ceil(this.player.wavesurfer.getCurrentTime())==0)){
        //     time=this.player.getCurrentTime;
        // }
        this.player.seekTo(time).then(() => {
                this.setElapsedTime(time);
                this.startSeekbarInterval();
                if (this.startPlaybackOnSeek) {
                    this.player.play();
                }
            
        });
    }

    protected bindHammerEvents() {
        let hammer, tap, pan;

        this.zone.runOutsideAngular(() => {
            hammer = new Hammer.Manager(this.el.nativeElement);
            tap = new Hammer.Tap();
            pan = new Hammer.Pan();
            hammer.add([tap, pan]);
        });

        hammer.on('tap panend', async e => {
            if (this.album || this.track) {
                await this.cueMedia();
            }
            // const time = this.seek(e.center.x);
            const time = this.player.wavesurfer.getCurrentTime();
            this.player.seekTo(time).then(() => {
                this.setElapsedTime(time);
                this.startSeekbarInterval();
                if (this.startPlaybackOnSeek) {
                    this.player.play();
                }
            });
        });

        hammer.on('panstart', e => this.stopSeekbarInterval());
        hammer.on('panleft panright', e => this.player.wavesurfer.getCurrentTime());
    }

    public async cueMedia() {
        if (this.album) {
            const id = queueId(this.album, 'allTracks');
            await this.player.cueMediaItem(id, this.album.tracks, this.track);
        } else if (this.track) {
            if ( ! this.player.queue.has(this.track)) {
                this.player.queue.prepend([this.track]);
            }
            await this.player.cueTrack(this.track);
        }
    }

    protected resetSeekbar() {
        this.positionElapsedTrackAndHandle(0);
        this.setElapsedTime(0);
    }

    protected getTrack() {
        this.track=this.player.queue.getCurrent();
        return this.track;
    }

    /**
     * Update player controls on player state events.
     */
    protected bindToPlayerStateEvents() {
        if (this.player.state.playing && ( !this.getTrack() || this.player.cued(this.getTrack()))) {
            this.startSeekbarInterval();
        }

        const sub = this.player.state.onChange$.subscribe(type => {
            switch (type) {
                case 'BUFFERING_STARTED':
                    this.stopSeekbarInterval();
                    break;
                case 'PLAYBACK_STARTED':
                    // if multiple seekbars are present on page,
                    // make sure they only respond to their own track
                    if (this.getTrack()) {
                        if (this.player.cued(this.getTrack())) {
                            // this.player.play();
                            // this.setElapsedTime(this.player.wavesurfer.getCurrentTime());
                            this.startSeekbarInterval();   
                        } else {
                            this.stopSeekbarInterval();
                            this.resetSeekbar();
                        }
                    } else {
                        this.startSeekbarInterval();
                    }
                    break;
                case 'PLAYBACK_PAUSED': 
                    this.player.wavesurfer.pause();
                    this.player.pause(); 
                    this.stopSeekbarInterval();
                    
                    break;
                case 'PLAYBACK_STOPPED':
                    this.stopSeekbarInterval();
                    this.resetSeekbar();
                    break;
            }
        });

        this.subscriptions.push(sub);
    }
}
