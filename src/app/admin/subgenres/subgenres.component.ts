import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Subgenres} from '../../web-player/subgenres/subgenres.service';
import {Subgenre} from '../../models/Subgenre';
import {CrupdateSubgenreModalComponent} from './crupdate-subgenre-modal/crupdate-subgenre-modal.component';
import {CurrentUser} from '@common/auth/current-user';
import {WebPlayerUrls} from '../../web-player/web-player-urls.service';
import {DatatableService} from '../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';
import {Toast} from '@common/core/ui/toast.service';

@Component({
    selector: 'subgenres',
    templateUrl: './subgenres.component.html',
    styleUrls: ['./subgenres.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatatableService],
})
export class SubgenresComponent implements OnInit {
    public subgenres$ = this.datatable.data$ as Observable<Subgenre[]>;
    constructor(
        public datatable: DatatableService<Subgenre>,
        private subgenres: Subgenres,
        public currentUser: CurrentUser,
        public urls: WebPlayerUrls,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: 'subgenres',
            staticParams: {withCount: 'artists'}
        });
    }

    public openCrupdateSubgenreModal(subgenre?: Subgenre) {
        this.datatable.openCrupdateResourceModal(CrupdateSubgenreModalComponent, {subgenre})
            .subscribe(() => {
                this.datatable.reset();
            });
    }

    public confirmGenresDeletion() {
        this.datatable.confirmResourceDeletion('subgenres').subscribe(() => {
            this.subgenres.delete(this.datatable.selectedRows$.value).subscribe(() => {
                this.toast.open('Subgenres deleted successfully.');
                this.datatable.reset();
            });
        });
    }
}
