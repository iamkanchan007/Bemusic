import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AboutUsComponent } from './about-us.component';


@NgModule({
    declarations: [
        AboutUsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    exports: [
        AboutUsComponent,
    ]
})
export class AboutUsModule {
}
