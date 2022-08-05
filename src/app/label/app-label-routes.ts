import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { LabelDashboardComponent } from './label-dashboard/label-dashboard.component';
import { TermOfServicesComponent } from '../customer/term-of-services/term-of-services.component';
import {AgreeGuard} from '@common/guards/agree-guard.service';
import {GuestGuard} from '@common/guards/guest-guard.service';
import { WebPlayerComponent } from '../web-player/web-player.component';
import { SupportsComponent } from '../customer/supports/supports.component';
import { UserSubscribedGuard } from '../../common/billing/guards/user-subscribed-guard.service';
import {ProfileCompleteGuard} from '@common/guards/profilecomplete-guard.service';
import {AuthGuard} from '@common/guards/auth-guard.service';
import {LabelProfileComponent} from './label-profile/label-profile.component';

const routes: Routes = [
    {
        path: '',
        component: LabelDashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'home',
        component: LabelDashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'account',
        component: LabelProfileComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppLabelRoutingModule {
}
