import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { PrivacyPolicyComponent } from './privacy-policy.component';


@NgModule({
    declarations: [
        PrivacyPolicyComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    exports: [
        PrivacyPolicyComponent,
    ]
})
export class PrivacyPolicyModule {
}
