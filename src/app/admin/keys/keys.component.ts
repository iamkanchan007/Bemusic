import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Keys} from '../../web-player/keys/keys.service';
import {Key} from '../../models/Key';
import {CrupdateKeyModalComponent} from './crupdate-key-modal/crupdate-key-modal.component';
import {CurrentUser} from '@common/auth/current-user';
import {WebPlayerUrls} from '../../web-player/web-player-urls.service';
import {DatatableService} from '../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';
import {Toast} from '@common/core/ui/toast.service';

@Component({
    selector: 'keys',
    templateUrl: './keys.component.html',
    styleUrls: ['./keys.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatatableService],
})
export class KeysComponent implements OnInit {
    public keys$ = this.datatable.data$ as Observable<Key[]>;
    constructor(
        public datatable: DatatableService<Key>,
        private keys: Keys,
        public currentUser: CurrentUser,
        public urls: WebPlayerUrls,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: 'keys',
            staticParams: {withCount: 'artists'}
        });
    }

    public openCrupdateSubgenreModal(key?: Key) {
        this.datatable.openCrupdateResourceModal(CrupdateKeyModalComponent, {key})
            .subscribe(() => {
                this.datatable.reset();
            });
    }

    public confirmGenresDeletion() {
        this.datatable.confirmResourceDeletion('keys').subscribe(() => {
            this.keys.delete(this.datatable.selectedRows$.value).subscribe(() => {
                this.toast.open('Keys deleted successfully.');
                this.datatable.reset();
            });
        });
    }
}
