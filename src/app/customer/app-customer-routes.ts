import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DisclaimerComponent} from './disclaimer/disclaimer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { TermOfServicesComponent } from './term-of-services/term-of-services.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import {AgreeGuard} from '@common/guards/agree-guard.service';
import {IsCustomerGuard} from '@common/guards/is-customer-guard.service';
import {GuestGuard} from '@common/guards/guest-guard.service';
import { WebPlayerComponent } from '../web-player/web-player.component';
import { AccountComponent } from './account/account.component';
import { SupportsComponent } from './supports/supports.component';
import { UserSubscribedGuard } from '../../common/billing/guards/user-subscribed-guard.service';
import {ProfileCompleteGuard} from '@common/guards/profilecomplete-guard.service';
import {AuthGuard} from '@common/guards/auth-guard.service';

const routes: Routes = [
    // { path: '', redirectTo: 'home', pathMatch: 'full' },
    // {
    //     path: 'home',
    //     component: HomepageComponent,
    //     // canActivate: [ProfileCompleteGuard, UserSubscribedGuard, AuthGuard, AgreeGuard, IsCustomerGuard]
    //      canActivate: [AgreeGuard]
    // },
    // {
    //     path: 'disclaimer',
    //     component: DisclaimerComponent,
    // },
    // {
    //     path: 'term-of-services',
    //     component: TermOfServicesComponent
    // },
    // {
    //     path: 'playlist',
    //     component: PlaylistsComponent,
    //     canActivate: [ProfileCompleteGuard, UserSubscribedGuard, AuthGuard, AgreeGuard, IsCustomerGuard]

    // },
    // {
    //     path: 'account',
    //     component: AccountComponent,
    //     canActivate: [ProfileCompleteGuard, UserSubscribedGuard, AuthGuard, AgreeGuard, IsCustomerGuard]
    // },
    // {
    //     path: 'support',
    //     component: SupportsComponent
    // },
    // {
    //     path: 'web',
    //     component: WebPlayerComponent,
    //     loadChildren: () => import('src/app/web-player/web-player.module').then(m => m.WebPlayerModule)
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppCustomerRoutingModule {
}
