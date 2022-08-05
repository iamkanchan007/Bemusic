import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Genres} from '../../web-player/genres/genres.service';
import {Genre} from '../../models/Genre';
import {CrupdateGenreModalComponent} from './crupdate-genre-modal/crupdate-genre-modal.component';
import {CurrentUser} from '@common/auth/current-user';
import {WebPlayerUrls} from '../../web-player/web-player-urls.service';
import {DatatableService} from '../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';
import {Toast} from '@common/core/ui/toast.service';

@Component({
    selector: 'genres',
    templateUrl: './genres.component.html',
    styleUrls: ['./genres.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatatableService],
})
export class GenresComponent implements OnInit {
    public genres$ = this.datatable.data$ as Observable<Genre[]>;
    constructor(
        public datatable: DatatableService<Genre>,
        private genres: Genres,
        public currentUser: CurrentUser,
        public urls: WebPlayerUrls,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: 'genres',
            staticParams: {withCount: 'artists'}
        });
    }

    public openCrupdateGenreModal(genre?: Genre) {
        this.datatable.openCrupdateResourceModal(CrupdateGenreModalComponent, {genre})
            .subscribe(() => {
                this.datatable.reset();
            });
    }

    public confirmGenresDeletion() {
        this.datatable.confirmResourceDeletion('genres').subscribe(() => {
            this.genres.delete(this.datatable.selectedRows$.value).subscribe(() => {
                this.toast.open('Genres deleted successfully.');
                this.datatable.reset();
            });
        });
    }
}
