import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Promocodes} from '../../web-player/promocodes/promocodes.service';
import {Promocode} from '../../models/Promocode';
import {CrupdatePromocodeModalComponent} from './crupdate-promocode-modal/crupdate-promocode-modal.component';
import {CurrentUser} from '@common/auth/current-user';
import {WebPlayerUrls} from '../../web-player/web-player-urls.service';
import {DatatableService} from '../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';
import {Toast} from '@common/core/ui/toast.service';

@Component({
    selector: 'promocodes',
    templateUrl: './promocodes.component.html',
    styleUrls: ['./promocodes.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatatableService],
})
export class PromocodesComponent implements OnInit {
    public promocodes$ = this.datatable.data$ as Observable<Promocode[]>;
    constructor(
        public datatable: DatatableService<Promocode>,
        private promocodes: Promocodes,
        public currentUser: CurrentUser,
        public urls: WebPlayerUrls,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: 'promocodes',
            staticParams: {withCount: 'artists'}
        });
    }

    public openCrupdateSubgenreModal(promocode?: Promocode) {
        this.datatable.openCrupdateResourceModal(CrupdatePromocodeModalComponent, {promocode})
            .subscribe(() => {
                this.datatable.reset();
            });
    }

    public confirmPromoDeletion() {
        this.datatable.confirmResourceDeletion('promocodes').subscribe(() => {
            this.promocodes.delete(this.datatable.selectedRows$.value).subscribe(() => {
                this.toast.open('Promo code deleted successfully.');
                this.datatable.reset();
            });
        });
    }
}
