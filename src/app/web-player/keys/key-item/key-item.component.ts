import {Component, Input} from '@angular/core';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {Key} from '../../../models/Key';

@Component({
    selector: 'key-item',
    templateUrl: './key-item.component.html',
    styleUrls: ['./key-item.component.scss'],
    host: {'class': 'media-grid-item'},
})
export class SubgenreItemComponent {
    @Input() key: Key;

    constructor(
        public urls: WebPlayerUrls,
    ) {}
}
