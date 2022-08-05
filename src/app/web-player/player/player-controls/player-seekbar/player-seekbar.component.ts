import {ChangeDetectorRef, Component, ElementRef, Input, NgZone, ViewChild, ViewEncapsulation} from '@angular/core';
import {BasePlayerSeekbar} from './base-player-seekbar';
import {FormattedDuration} from '../../formatted-duration.service';
import {Player} from '../../player.service';
import WaveSurfer from 'wavesurfer.js';

@Component({
    selector: 'player-seekbar',
    templateUrl: './player-seekbar.component.html',
    styleUrls: ['./player-seekbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlayerSeekbarComponent extends BasePlayerSeekbar {
    options={
        backgroundColor: '#181818',
        cursorColor: 'transparent',
        waveColor: '#bebebee0',
        height:50
    }
    wavesurfer: WaveSurfer;
    constructor(
        protected el: ElementRef<HTMLElement>,
        protected duration: FormattedDuration,
        protected player: Player,
        protected zone: NgZone,
        private ref: ChangeDetectorRef
    ) {
        super();
    }
    ngOnInit(){
        if(!this.player.wavesurfer){
            this.player.waveInit();
        }
    }
    ngDoCheck(){
        if(this.player.wavesurfer && document.getElementsByTagName('wave').length==0){
            this.player.wavesurfer.destroy();
            this.player.waveInit();
        }
        if(this.player.wavesurfer && !this.player.cuedTrack){
            this.player.showWavePlayer()
        }
        if(this.player.state.playing){
            this.player.playwave();
        }
        if((!this.player.showWave && !this.player.waveloaded)){
            this.player.waveLoaded();
        }
         
    }
    ngOnDestroy() {
        this.player.wavesurfer.destroy();
    }
    ngAfterContentChecked() {
        this.ref.detectChanges();
    }
}
