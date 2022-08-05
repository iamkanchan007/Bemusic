import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {BaseAdminModule} from '@common/admin/base-admin.module';
import {UploadsModule} from '@common/uploads/uploads.module';
import {MediaImageModule} from '../web-player/shared/media-image/media-image.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {SlugControlModule} from '@common/shared/form-controls/slug-control/slug-control.module';
import {UploadImageControlModule} from '@common/shared/form-controls/upload-image-control/upload-image-control.module';
import {UploadingModule} from '../uploading/uploading.module';
import {NoResultsMessageModule} from '@common/core/ui/no-results-message/no-results-message.module';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {InfoPopoverModule} from '@common/core/ui/info-popover/info-popover.module';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { TermOfServicesComponent } from './term-of-services/term-of-services.component';
import { AppCustomerRoutingModule } from './app-customer-routes';
import { HomepageComponent } from './homepage/homepage.component';
import { ListSectionComponent } from './homepage/list-section/list-section.component';
import { ExtensiveLibraryComponent } from './homepage/extensive-library/extensive-library.component';
import { CuratedPlaylistComponent } from './homepage/curated-playlist/curated-playlist.component';
import { RecordLabelsComponent } from './homepage/record-labels/record-labels.component';
import { ComparePlansComponent } from './homepage/compare-plans/compare-plans.component';
import { MusicSourceComponent } from './homepage/music-source/music-source.component';
import { HomeBannerComponent } from './homepage/home-banner/home-banner.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import {WebPlayerModule} from '../web-player/web-player.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './account/profile/profile.component';
import { MembershipComponent } from './account/membership/membership.component';
import { PaymentComponent } from './account/payment/payment.component';
import { DownloadComponent } from './account/download/download.component';
import { SupportsComponent } from './supports/supports.component';
import {BrowserModule} from '@angular/platform-browser';
import { PlaylistDetailsComponent } from './playlist-details/playlist-details.component';
import { PlayerUiModule } from '../web-player/player-ui.module';
import { NavSidebarComponent } from '../web-player/nav-sidebar/nav-sidebar.component';
import { SearchSlideoutPanelComponent } from '../web-player/search/search-slideout-panel/search-slideout-panel.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {Ng2TelInputModule} from 'ng2-tel-input';
@NgModule({
    imports: [
        CommonModule,
        AppCustomerRoutingModule,
        PlayerUiModule,
        WebPlayerModule,
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
        MatSidenavModule,
        MatDialogModule,
        DragDropModule,
        MediaImageModule,
        MatChipsModule,
        UploadsModule,
        MatBadgeModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatMenuModule,
        MatTabsModule,
        MatCheckboxModule,
        MatDatepickerModule,
        Ng2TelInputModule
    ],
    declarations: [
       DisclaimerComponent,
       TermOfServicesComponent,
       HomepageComponent,
       ListSectionComponent,
       ExtensiveLibraryComponent,
       CuratedPlaylistComponent,
       RecordLabelsComponent,
       ComparePlansComponent,
       MusicSourceComponent,
       HomeBannerComponent,
       PlaylistsComponent,
       DashboardComponent,
       AccountComponent,
       ProfileComponent,
       MembershipComponent,
       PaymentComponent,
       DownloadComponent,
       SupportsComponent,
       PlaylistDetailsComponent,
    ],
    exports: [
       ProfileComponent,
       MembershipComponent,
       PaymentComponent,
       DownloadComponent

    ],
})
export class AppCustomerModule {

}
