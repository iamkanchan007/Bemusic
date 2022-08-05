import {finalize} from 'rxjs/operators';
import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Bpm} from '../../../models/Bpm';
import {Bpms} from '../bpms.service';
import {Settings} from '@common/core/config/settings.service';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {MixedArtist} from '../../artists/mixed-artist';
import {InfiniteScroll} from '@common/core/ui/infinite-scroll/infinite.scroll';
import {WebPlayerState} from '../../web-player-state.service';

@Component({
    selector: 'bpm',
    templateUrl: './bpm.component.html',
    styleUrls: ['./bpm.component.scss'],
})
export class SubgenreComponent extends InfiniteScroll implements OnInit {
    public pagination: PaginationResponse<MixedArtist>;
    public bpm: Bpm = new Bpm();
    public loading = false;

    constructor(
        private route: ActivatedRoute,
        private bpms: Bpms,
        public state: WebPlayerState,
        public settings: Settings,
        protected zone: NgZone,
    ) {
        super();
    }

    ngOnInit() {
        this.el = this.state.scrollContainer;
        this.route.data.subscribe(data => {
            this.pagination = data.api.artists;
            this.bpm = data.api.bpm;
        });
        super.ngOnInit();
    }

    public loadMoreItems() {
        this.loading = true;
        const params = {page: this.pagination.current_page + 1};
        this.bpms.get(this.bpm.name, params).pipe(finalize(() => {
            this.loading = false;
        })).subscribe(response => {
            const currentArtists = this.pagination.data;
            this.pagination = {...response.artists, data: [...currentArtists, ...response.artists.data]};
        });
    }

    public canLoadMore() {
        return !this.loading && (this.pagination.current_page < this.pagination.last_page);
    }

    protected isLoading(): boolean {
        return this.loading;
    }
}
