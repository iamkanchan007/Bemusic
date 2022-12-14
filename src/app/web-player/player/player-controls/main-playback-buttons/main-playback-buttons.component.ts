import {Component, ViewEncapsulation} from '@angular/core';
import {Player} from "../../player.service";

@Component({
    selector: 'main-playback-buttons',
    templateUrl: './main-playback-buttons.component.html',
    styleUrls: ['./main-playback-buttons.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainPlaybackButtonsComponent {

    constructor(public player: Player) {
    }
    next(){
        this.player.wavePauseTime=0;
        this.player.playNext();
    }
    previous(){
        this.player.wavePauseTime=0;
        this.player.playPrevious();
    }
}
