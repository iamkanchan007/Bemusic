import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {BEMUSIC_CONFIG} from './bemusic-config';
import {APP_CONFIG} from '@common/core/config/app-config';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {AuthModule} from '@common/auth/auth.module';
import {AppRoutingModule} from './app-routing.module';
import {WebPlayerModule} from './web-player/web-player.module';
import {AccountSettingsModule} from '@common/account-settings/account-settings.module';
import {Bootstrapper} from '@common/core/bootstrapper.service';
import {BeMusicBootstrapper} from './bootstrapper.service';
import {CustomRouteReuseStrategy} from '@common/shared/custom-route-reuse-strategy';
import {CORE_PROVIDERS} from '@common/core/core-providers';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

import {ContactPageModule} from '@common/contact/contact-page.module';
// noinspection ES6UnusedImports
import * as User from 'src/app/models/App-User';
import { CookieNoticeModule } from '@common/gdpr/cookie-notice/cookie-notice.module';
import { PagesModule } from '@common/pages/shared/pages.module';
import { AppCustomerModule } from './customer/app-customer.module';
import { AppLabelModule } from './label/app-label.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { PrivacyPolicyModule } from '@common/privacy-policy/privacy-policy.module';
import { TermsOfConditionsModule } from '@common/terms-of-conditions/terms-of-conditions.module';
import { FaqsModule } from '@common/faqs/faqs.module';
import { AboutUsModule } from '@common/about-us/about-us.module';
import { RefundPolicyModule } from '@common/refund-policy/refund-policy.module';
import { AngularWavesurferServiceModule } from 'angular-wavesurfer-service';
import { PlayerUiModule } from './web-player/player-ui.module';
import {Ng2TelInputModule} from 'ng2-tel-input';
@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot([], {scrollPositionRestoration: 'top'}),
        AppRoutingModule,
        AuthModule,
        CookieNoticeModule,
        AppCustomerModule,
        AppLabelModule,
        PlayerUiModule,
        WebPlayerModule,
        // account settings and pages modules must come after web player
        // module for proper account settings and custom page route override
        AccountSettingsModule,
        PagesModule,
        ContactPageModule,
        PrivacyPolicyModule,
        TermsOfConditionsModule,
        FaqsModule,
        AboutUsModule,
        RefundPolicyModule,
        // material
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatSelectModule,
        AngularWavesurferServiceModule,
        Ng2TelInputModule
    ],
    providers: [
        ...CORE_PROVIDERS,
        {provide: APP_CONFIG, useValue: BEMUSIC_CONFIG, multi: true},
        {provide: Bootstrapper, useClass: BeMusicBootstrapper},
        {provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
