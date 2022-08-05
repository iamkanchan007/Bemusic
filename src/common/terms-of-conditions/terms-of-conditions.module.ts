import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TermsOfConditionsComponent} from './terms-of-conditions.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        TermsOfConditionsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    exports: [
        TermsOfConditionsComponent,
    ]
})
export class TermsOfConditionsModule {
}
