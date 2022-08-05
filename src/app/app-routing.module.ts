import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AboutUsComponent } from '@common/about-us/about-us.component';
import { UserSubscribedGuard } from '@common/billing/guards/user-subscribed-guard.service';
import {ContactComponent} from '@common/contact/contact.component';
import { FaqsComponent } from '@common/faqs/faqs.component';
import { AgreeGuard } from '@common/guards/agree-guard.service';

import {AuthGuard} from '@common/guards/auth-guard.service';
import { IsCustomerGuard } from '@common/guards/is-customer-guard.service';
import { ProfileCompleteGuard } from '@common/guards/profilecomplete-guard.service';
import { PrivacyPolicyComponent } from '@common/privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from '@common/refund-policy/refund-policy.component';
import { TermsOfConditionsComponent } from '@common/terms-of-conditions/terms-of-conditions.component';
import { AccountComponent } from './customer/account/account.component';
import { DashboardComponent } from './customer/dashboard/dashboard.component';
import { DisclaimerComponent } from './customer/disclaimer/disclaimer.component';
import { ComparePlansComponent } from './customer/homepage/compare-plans/compare-plans.component';
import { HomepageComponent } from './customer/homepage/homepage.component';
import { PlaylistsComponent } from './customer/playlists/playlists.component';
import { SupportsComponent } from './customer/supports/supports.component';
import { TermOfServicesComponent } from './customer/term-of-services/term-of-services.component';
import { PlaylistResolver } from './web-player/playlists/playlist/playlist-resolver.service';
import { PlaylistComponent } from './web-player/playlists/playlist/playlist.component';
import { WebPlayerComponent } from './web-player/web-player.component';

const routes: Routes = [
    { path: '', redirectTo: 'web', pathMatch: 'full' },
    // {
    //     path: 'home',
    //     component: HomepageComponent,
    //     // canActivate: [ProfileCompleteGuard, UserSubscribedGuard, AuthGuard, AgreeGuard, IsCustomerGuard]
    //      canActivate: [AgreeGuard]
    // },
    {path: 'label', loadChildren: () => import('src/app/label/app-label.module').then(m => m.AppLabelModule)},
    {path: 'admin', loadChildren: () => import('src/app/admin/app-admin.module').then(m => m.AppAdminModule), canLoad: [AuthGuard]},
    // {path: 'billing', loadChildren: () => import('@common/billing/billing.module').then(m => m.BillingModule)},
    // {path: 'notifications', loadChildren: () => import('@common/notifications/notifications.module').then(m => m.NotificationsModule)},
    // {path: 'contact', component: ContactComponent},
    // {path: 'about', component: AboutUsComponent},
    // {path: 'terms-of-conditions', component: TermsOfConditionsComponent},
    // {path: 'privacy-policy', component: PrivacyPolicyComponent},
    // {path: 'refund-policy', component: RefundPolicyComponent},
    // {path: 'faqs', component: FaqsComponent},
    // {path: 'plans', component: ComparePlansComponent},
    // {
    //     path: 'disclaimer',
    //     component: DisclaimerComponent,
    // },
    // {
    //     path: 'term-of-services',
    //     component: TermOfServicesComponent
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
    //     path: 'playlist',
    //     component: PlaylistsComponent,
    //     canActivate: [ProfileCompleteGuard, UserSubscribedGuard, AuthGuard, IsCustomerGuard]
    // },
    {
        path: 'web',
        component: WebPlayerComponent,
        children:[
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
                path: 'disclaimer',
                component: DisclaimerComponent,
            },
            {
                path: 'home',
                component: HomepageComponent,
                canActivate: [AgreeGuard]
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [ProfileCompleteGuard,UserSubscribedGuard, AuthGuard, IsCustomerGuard]
            },
            {
                path: 'playlist',
                component: PlaylistsComponent,
                canActivate: [ProfileCompleteGuard, UserSubscribedGuard, AuthGuard, IsCustomerGuard]
            },
            {
                path: 'playlists/:id/:name',
                component: PlaylistComponent,
                resolve: {api: PlaylistResolver},
                data: {name: 'playlist', noReuse: true, permissions: ['playlists.view']},
                canActivate: [AuthGuard]
            },
            {path: 'billing', loadChildren: () => import('@common/billing/billing.module').then(m => m.BillingModule)},
            {path: 'notifications', loadChildren: () => import('@common/notifications/notifications.module').then(m => m.NotificationsModule)},
            {path: 'contact', component: ContactComponent},
            {path: 'about', component: AboutUsComponent},
            {path: 'terms-of-conditions', component: TermsOfConditionsComponent},
            {path: 'privacy-policy', component: PrivacyPolicyComponent},
            {path: 'refund-policy', component: RefundPolicyComponent},
            {path: 'faqs', component: FaqsComponent},
            {path: 'plans', component: ComparePlansComponent},
            {
                path: 'term-of-services',
                component: TermOfServicesComponent
            },
            {
                path: 'account',
                component: AccountComponent,
                canActivate: [ProfileCompleteGuard, UserSubscribedGuard, AuthGuard, AgreeGuard, IsCustomerGuard]
            },
            {
                path: 'support',
                component: SupportsComponent
            },
        ],
    },

    // {path: 'pricing', redirectTo: 'billing/pricing'},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
