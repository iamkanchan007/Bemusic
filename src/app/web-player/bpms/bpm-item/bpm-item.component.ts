import {Component, Input} from '@angular/core';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {Bpm} from '../../../models/Bpm';

@Component({
    selector: 'bpm-item',
    templateUrl: './bpm-item.component.html',
    styleUrls: ['./bpm-item.component.scss'],
    host: {'class': 'media-grid-item'},
})
export class SubgenreItemComponent {
    @Input() bpm: Bpm;

    constructor(
        public urls: WebPlayerUrls,
    ) {}
}
