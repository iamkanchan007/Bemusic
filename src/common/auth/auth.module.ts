import {NgModule} from '@angular/core';
import {AuthRoutingModule} from './auth.routing';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {RequestExtraCredentialsModalComponent} from './request-extra-credentials-modal/request-extra-credentials-modal.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CustomMenuModule} from '@common/core/ui/custom-menu/custom-menu.module';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { CompleteProfileComponent } from './complete-profile/complete-profile.component';
import { LabelRegisterComponent } from './label-register/label-register.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {Ng2TelInputModule} from 'ng2-tel-input';
@NgModule({
    imports: [
        AuthRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        LoadingIndicatorModule,
        TranslationsModule,
        CustomMenuModule,

        // material
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatDatepickerModule,
        Ng2TelInputModule
    ],
    declarations: [
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        RequestExtraCredentialsModalComponent,
        AuthPageComponent,
        CompleteProfileComponent,
        LabelRegisterComponent

    ],
})
export class AuthModule {
}
