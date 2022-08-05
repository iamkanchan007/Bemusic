import {Component, Input} from '@angular/core';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {Promocode} from '../../../models/Promocode';

@Component({
    selector: 'promocode-item',
    templateUrl: './promocode-item.component.html',
    styleUrls: ['./promocode-item.component.scss'],
    host: {'class': 'media-grid-item'},
})
export class PromocodeItemComponent {
    @Input() promocode: Promocode;

    constructor(
        public urls: WebPlayerUrls,
    ) {}
}
