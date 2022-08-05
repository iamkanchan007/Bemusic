import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Categories} from '../../web-player/categories/categories.service';
import {Categorie} from '../../models/Categorie';
import {CrupdateCategorieModalComponent} from './crupdate-categorie-modal/crupdate-categorie-modal.component';
import {CurrentUser} from '@common/auth/current-user';
import {WebPlayerUrls} from '../../web-player/web-player-urls.service';
import {DatatableService} from '../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';
import {Toast} from '@common/core/ui/toast.service';

@Component({
    selector: 'categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatatableService],
})
export class CategoriesComponent implements OnInit {
    public categories$ = this.datatable.data$ as Observable<Categorie[]>;
    constructor(
        public datatable: DatatableService<Categorie>,
        private categories: Categories,
        public currentUser: CurrentUser,
        public urls: WebPlayerUrls,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: 'categories',
            staticParams: {withCount: 'artists'}
        });
    }

    public openCrupdateGenreModal(categorie?: Categorie) {
        this.datatable.openCrupdateResourceModal(CrupdateCategorieModalComponent, {categorie})
            .subscribe(() => {
                this.datatable.reset();
            });
    }

    public confirmGenresDeletion() {
        this.datatable.confirmResourceDeletion('categories').subscribe(() => {
            this.categories.delete(this.datatable.selectedRows$.value).subscribe(() => {
                this.toast.open('Category Deleted successfully.');
                this.datatable.reset();
            });
        });
    }
}
