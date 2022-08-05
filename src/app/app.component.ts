import {filter} from 'rxjs/operators';
import {Component, ElementRef, OnInit, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {BrowserEvents} from '@common/core/services/browser-events.service';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {Settings} from '@common/core/config/settings.service';
import cssVars from 'css-vars-ponyfill';
import {MetaTagsService} from '@common/core/meta/meta-tags.service';
import {ChannelShowComponent} from './web-player/channels/channel-show/channel-show.component';
import {ChannelResolverService} from './admin/channels/crupdate-channel-page/channel-resolver.service';
import {CookieNoticeService} from '@common/gdpr/cookie-notice/cookie-notice.service';
import {CustomHomepage} from '@common/pages/shared/custom-homepage.service';
import { CurrentUser } from '@common/auth/current-user';
import {Player} from './web-player/player/player.service';
import {WebPlayerState} from './web-player/web-player-state.service';
export const LANDING_PAGE_NAME = 'Landing Page';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    footerLines: any={
        company:"Company",
        policy:"Policy",
        follow:"Follow Us",
        about:"About Us",
        faq:"FAQ",
        contact:"Contact Us",
        privacy:"Privacy Policy",
        terms:"Terms of Service",
        refund:"Refund Policy",
        copyrights:"© 2021 DJ Mixing Lab | All Rights Reserved"
    };
    cuser:any;
    isAdmin: boolean=false;
    constructor(
        private browserEvents: BrowserEvents,
        private el: ElementRef,
        private http: AppHttpClient,
        private settings: Settings,
        private router: Router,
        private customHomepage: CustomHomepage,
        private meta: MetaTagsService,
        private cookieNotice: CookieNoticeService,
        private user:CurrentUser,
        public state: WebPlayerState,
        public player: Player,
        private ref: ChangeDetectorRef
    ) {
        this.settings.isUser$.subscribe(res=>{
            if(res==true){
                let user=JSON.parse( localStorage.getItem('cuser')) || '';
                  this.cuser=user;
                if(user){
                  this.user.init({ user: user, guestsRole: user.roles })
                }
            }
        })
    }

    ngOnInit() {
        this.browserEvents.subscribeToEvents(this.el.nativeElement);
        this.settings.setHttpClient(this.http);
        this.meta.init();
        // google analytics
        if (this.settings.get('analytics.tracking_code')) {
            this.triggerAnalyticsPageView();
        }
        
        let user=JSON.parse( localStorage.getItem('cuser')) || '';
        this.cuser=user;
        if(user){
          this.user.init({ user: user, guestsRole: user.roles })
        }
        // custom homepage
        this.customHomepage.select({
            menuCategories: [{
                name: 'Channel',
                route: {
                    component: ChannelShowComponent,
                    resolve: {api: ChannelResolverService},
                    data: {name: 'channel'}
                }
            }],
            routes: [{
                name: LANDING_PAGE_NAME,
                ignore: true,
            }]
        });

        this.loadCssVariablesPolyfill();
        this.cookieNotice.maybeShow();
    }

    private triggerAnalyticsPageView() {
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if ( ! window['ga']) return;
                window['ga']('set', 'page', event.urlAfterRedirects);
                window['ga']('send', 'pageview');
            });
    }

    private loadCssVariablesPolyfill() {
        const isNativeSupport = typeof window !== 'undefined' &&
            window['CSS'] &&
            window['CSS'].supports &&
            window['CSS'].supports('(--a: 0)');
        if ( ! isNativeSupport) {
            cssVars();
        }
    }
    public doSomething(footerLines: any):void {
        this.footerLines={
            company:footerLines.company?footerLines.company:this.footerLines.company,
            policy:footerLines.policy?footerLines.policy:this.footerLines.policy,
            follow:footerLines.follow?footerLines.follow:this.footerLines.follow,
            about:footerLines.about?footerLines.about:this.footerLines.about,
            faq:footerLines.faq?footerLines.faq:this.footerLines.faq,
            contact:footerLines.contact?footerLines.contact:this.footerLines.contact,
            privacy:footerLines.privacy?footerLines.privacy:this.footerLines.privacy,
            terms:footerLines.terms?footerLines.terms:this.footerLines.terms,
            refund:footerLines.refund?footerLines.refund:this.footerLines.refund,
            copyrights:footerLines.copyrights?footerLines.copyrights:this.footerLines.copyrights,
        };
    }
    public hasAdmin(admin:any):void{
        this.isAdmin=admin;
    }
}
