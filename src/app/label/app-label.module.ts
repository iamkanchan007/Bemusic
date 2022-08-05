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
import { AppLabelRoutingModule } from './app-label-routes';
import { LabelDashboardComponent } from './label-dashboard/label-dashboard.component';
import {LabelProfileComponent} from './label-profile/label-profile.component';
import {WebPlayerModule} from '../web-player/web-player.module';
import {BrowserModule} from '@angular/platform-browser';
import { PlayerUiModule } from '../web-player/player-ui.module';
@NgModule({
    imports: [
        CommonModule,
        AppLabelRoutingModule,
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
        MatChipsModule,
        MatAutocompleteModule,
        MatProgressBarModule,
        MediaImageModule,
        DragDropModule,
        MatTabsModule,
    ],
    declarations: [
        LabelDashboardComponent,
        LabelProfileComponent
    ],
})
export class AppLabelModule {

}
