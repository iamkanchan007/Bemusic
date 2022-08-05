import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FaqsComponent } from './faqs.component';


@NgModule({
    declarations: [
        FaqsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    exports: [
        FaqsComponent,
    ]
})
export class FaqsModule {
}
