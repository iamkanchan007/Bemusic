import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RefundPolicyComponent } from './refund-policy.component';


@NgModule({
    declarations: [
        RefundPolicyComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    exports: [
        RefundPolicyComponent,
    ]
})
export class RefundPolicyModule {
}
