import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Channel} from '../../../../admin/channels/channel';
import {WebPlayerUrls} from '../../../web-player-urls.service';
import {Track, TRACK_MODEL} from '../../../../models/Track';
import {ALBUM_MODEL} from '../../../../models/Album';
import {ARTIST_MODEL} from '../../../../models/Artist';
import {PLAYLIST_MODEL} from '../../../../models/Playlist';
import {USER_MODEL} from '@common/core/types/models/User';
import {GENRE_MODEL} from '../../../../models/Genre';
import {MIXED_ARTIST_MODEL} from '../../../artists/mixed-artist';
import {CurrentUser} from '@common/auth/current-user';
import {DatatableService} from '@common/datatable/datatable.service';

@Component({
    selector: 'channel-content',
    templateUrl: './channel-content.component.html',
    styleUrls: ['./channel-content.component.scss'],
    providers: [DatatableService],
})
export class ChannelContentComponent implements OnInit, OnDestroy {
    @Input() channel: Channel;
    @Input() disablePlayback = false;
    @Input() nested = false;

    public modelTypes = {
        track: TRACK_MODEL,
        album: ALBUM_MODEL,
        artist: ARTIST_MODEL,
        user: USER_MODEL,
        playlist: PLAYLIST_MODEL,
        genre: GENRE_MODEL,
        mixedArtist: MIXED_ARTIST_MODEL,
    };

    constructor(
        public urls: WebPlayerUrls,
        public user: CurrentUser,
        public datatable: DatatableService<Track>,
    ) {
        // this.channel={
        //     layout: 'carousel',
        // }
        // this.nested=true;
    }

    ngOnInit() {
        if (this.channel.layout === 'trackTable') {
            this.datatable.init({
                initialData: this.channel.content as Track[]
            });
        }
    }

    ngOnDestroy() {
        this.datatable.destroy();
    }
}
