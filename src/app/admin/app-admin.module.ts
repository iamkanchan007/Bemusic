import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ArtistsComponent} from './artists/artists.component';
import {NewArtistPageComponent} from './artists/new-artist-page/new-artist-page.component';
import {ArtistAlbumsTableComponent} from './artists/new-artist-page/artist-albums-table/artist-albums-table.component';
import {CrupdateLyricModalComponent} from './lyrics-page/crupdate-lyric-modal/crupdate-lyric-modal.component';
import {AlbumIndexComponent} from './albums/album-index/album-index.component';
import {LyricsPageComponent} from './lyrics-page/lyrics-page.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {PlaylistsPageComponent} from './playlists-page/playlists-page.component';
import {PlaylistTrackComponent} from './playlist-track/playlist-track.component';
import {ProvidersSettingsComponent} from './settings/providers/providers-settings.component';
import {PlayerSettingsComponent} from './settings/player/player-settings.component';
import {BlockedArtistsSettingsComponent} from './settings/blocked-artists/blocked-artists-settings.component';
import {GenresComponent} from './genres/genres.component';
import {SubgenresComponent} from './subgenres/subgenres.component';
import {KeysComponent} from './keys/keys.component';
import {BpmsComponent} from './bpms/bpms.component';
import {CategoriesComponent} from './categories/categories.component';
import {PromocodesComponent} from './promocodes/promocodes.component';
import {CrupdateCategorieModalComponent} from './categories/crupdate-categorie-modal/crupdate-categorie-modal.component';
import {CrupdatePromocodeModalComponent} from './promocodes/crupdate-promocode-modal/crupdate-promocode-modal.component';
import {CrupdateSubgenreModalComponent} from './subgenres/crupdate-subgenre-modal/crupdate-subgenre-modal.component';
import {CrupdateKeyModalComponent} from './keys/crupdate-key-modal/crupdate-key-modal.component';
import {CrupdateBpmModalComponent} from './bpms/crupdate-bpm-modal/crupdate-bpm-modal.component';
import {CrupdateGenreModalComponent} from './genres/crupdate-genre-modal/crupdate-genre-modal.component';
import {BaseAdminModule} from '@common/admin/base-admin.module';
import {UploadsModule} from '@common/uploads/uploads.module';
import {CrupdateTrackPageComponent} from './tracks/crupdate-track-page/crupdate-track-page.component';
import {MediaImageModule} from '../web-player/shared/media-image/media-image.module';
import {CrupdateAlbumPageComponent} from './albums/crupdate-album-page/crupdate-album-page.component';
import {TrackIndexComponent} from './tracks/track-index/track-index.component';
import {ChannelIndexComponent} from './channels/channel-index/channel-index.component';
import {CrupdateChannelPageComponent} from './channels/crupdate-channel-page/crupdate-channel-page.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {SlugControlModule} from '@common/shared/form-controls/slug-control/slug-control.module';
import {InterfaceComponent} from './settings/interface/interface.component';
import {UploadImageControlModule} from '@common/shared/form-controls/upload-image-control/upload-image-control.module';
import {CrupdateAlbumModalComponent} from './artists/new-artist-page/crupdate-album-modal/crupdate-album-modal.component';
import {UploadingModule} from '../uploading/uploading.module';
import {NoResultsMessageModule} from '@common/core/ui/no-results-message/no-results-message.module';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {InfoPopoverModule} from '@common/core/ui/info-popover/info-popover.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BaseAdminModule,
        UploadsModule,
        UploadingModule,
        NoResultsMessageModule,
        LoadingIndicatorModule,
        InfoPopoverModule,

        SlugControlModule,
        UploadImageControlModule,

        // material
        MatChipsModule,
        MatAutocompleteModule,
        MatProgressBarModule,
        MediaImageModule,
        DragDropModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule
    ],
    declarations: [
        ArtistsComponent,
        NewArtistPageComponent,
        ArtistAlbumsTableComponent,
        CrupdateLyricModalComponent,
        TrackIndexComponent,
        AlbumIndexComponent,
        LyricsPageComponent,
        PlaylistsPageComponent,
        PlaylistTrackComponent,
        ChannelIndexComponent,

        // settings
        ProvidersSettingsComponent,
        PlayerSettingsComponent,
        BlockedArtistsSettingsComponent,
        GenresComponent,
        SubgenresComponent,
        KeysComponent,
        BpmsComponent,
        CategoriesComponent,
        PromocodesComponent,
        CrupdateGenreModalComponent,
        CrupdateCategorieModalComponent,
        CrupdateBpmModalComponent,
        CrupdatePromocodeModalComponent,
        CrupdateSubgenreModalComponent,
        CrupdateKeyModalComponent,
        CrupdateTrackPageComponent,
        CrupdateAlbumPageComponent,
        CrupdateChannelPageComponent,
        InterfaceComponent,
        CrupdateAlbumModalComponent,
    ]
})
export class AppAdminModule {
}
