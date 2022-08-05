import {Component, Input} from '@angular/core';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {Subgenre} from '../../../models/Subgenre';

@Component({
    selector: 'subgenre-item',
    templateUrl: './subgenre-item.component.html',
    styleUrls: ['./subgenre-item.component.scss'],
    host: {'class': 'media-grid-item'},
})
export class SubgenreItemComponent {
    @Input() subgenre: Subgenre;

    constructor(
        public urls: WebPlayerUrls,
    ) {}
}
