import {Component, Input} from '@angular/core';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {Categorie} from '../../../models/Categorie';

@Component({
    selector: 'categorie-item',
    templateUrl: './categorie-item.component.html',
    styleUrls: ['./categorie-item.component.scss'],
    host: {'class': 'media-grid-item'},
})
export class CategorieItemComponent {
    @Input() categorie: Categorie;

    constructor(
        public urls: WebPlayerUrls,
    ) {}
}
