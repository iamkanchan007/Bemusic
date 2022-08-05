import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Bpms} from '../../web-player/bpms/bpms.service';
import {Bpm} from '../../models/Bpm';
import {CrupdateBpmModalComponent} from './crupdate-bpm-modal/crupdate-bpm-modal.component';
import {CurrentUser} from '@common/auth/current-user';
import {WebPlayerUrls} from '../../web-player/web-player-urls.service';
import {DatatableService} from '../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';
import {Toast} from '@common/core/ui/toast.service';

@Component({
    selector: 'bpms',
    templateUrl: './bpms.component.html',
    styleUrls: ['./bpms.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatatableService],
})
export class BpmsComponent implements OnInit {
    public bpms$ = this.datatable.data$ as Observable<Bpm[]>;
    constructor(
        public datatable: DatatableService<Bpm>,
        private bpms: Bpms,
        public currentUser: CurrentUser,
        public urls: WebPlayerUrls,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: 'bpms',
            staticParams: {withCount: 'artists'}
        });
    }

    public openCrupdateSubgenreModal(bpm?: Bpm) {
        this.datatable.openCrupdateResourceModal(CrupdateBpmModalComponent, {bpm})
            .subscribe(() => {
                this.datatable.reset();
            });
    }

    public confirmGenresDeletion() {
        this.datatable.confirmResourceDeletion('bpm').subscribe(() => {
            this.bpms.delete(this.datatable.selectedRows$.value).subscribe(() => {
                this.toast.open('Bpm deleted successfully.');
                this.datatable.reset();
            });
        });
    }
}
