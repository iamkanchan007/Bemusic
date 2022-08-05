import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Player} from '../player.service';
import {Track} from '../../../models/Track';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
@Component({
    selector: 'playback-control-button',
    templateUrl: './playback-control-button.component.html',
    styleUrls: ['./playback-control-button.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PlaybackControlButtonComponent {
    @Output() play = new EventEmitter();
    @Output() pause = new EventEmitter();
    @Input() track: Track;
    @Input() playing = null;
    @Input() usedFor;
    previousUrl: string = undefined;
    currentUrl: string = undefined;

    constructor(
        private router : Router,
        private player: Player,
    ) {
        // this.currentUrl = this.router.url;
        // router.events.subscribe(event => {
        //     if (event instanceof NavigationEnd) {
        //         this.previousUrl = this.currentUrl;
        //         this.currentUrl = event.url;
        //         this.player.changedUrl=true;
        //         if(this.player.isPlaying() && (this.previousUrl != this.currentUrl) && this.player.changedUrl){
        //             this.player.pause();
        //             this.player.wavePauseTime=this.player.wavesurfer.getCurrentTime();
        //             this.player.state.buffering=true;
        //             setTimeout(()=>{
        //                 this.player.state.buffering=false;
        //                 this.player.play();
        //             },1)
        //         }
        //     };
        // });
    }
    public trackIsPlaying() {
        // parent component is controlling playback state.
        if (this.playing !== null) return this.playing;

        // playback state is based on current track
        return (this.player.isPlaying() || this.player.isBuffering()) && this.player.cued(this.track);
    }

}
