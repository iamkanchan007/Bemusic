import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Settings} from '../core/config/settings.service';
import {CurrentUser} from '../auth/current-user';
import {BreakpointsService} from '../core/ui/breakpoints.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {MenuItem} from '@common/core/ui/custom-menu/menu-item';

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
    public leftColumnIsHidden = false;
    public menu = this.generateMenu();
    public salemenu = false;
    public salemenuicon = 'add';
    public settingmenu = false;
    public settingicon = 'add';

    constructor(
        public settings: Settings,
        public currentUser: CurrentUser,
        public breakpoints: BreakpointsService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.leftColumnIsHidden = this.breakpoints.isMobile$.value;
        this.menu = this.generateMenu();

        // close left column when navigating between admin pages on mobile
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe(() => {
                this.leftColumnIsHidden = this.breakpoints.isMobile$.value;
            });
    }

    public toggleLeftSidebar() {
        this.leftColumnIsHidden = !this.leftColumnIsHidden;
    }

    public showSale() {
        if(this.salemenu){
            this.salemenu = false;
            this.salemenuicon = "add";
        } else {
            this.salemenu = true;
            this.salemenuicon = "remove";
        }
    }
    public showSetting() {
        if(this.settingmenu){
            this.settingmenu = false;
            this.settingicon = "add";
        } else {
            this.settingmenu = true;
            this.settingicon = "remove";
        }
    }
    public getCustomSidebarItems() {
        var aa = this.settings.get('vebto.admin.pages');
        return aa.filter(function(e) { 
            return (e.name == 'library') 
            //return (e.name == 'library' || e.name == 'categories' || e.name == 'genres' || e.name == 'subgenres' || e.name == 'playlists') 
        })
    }

    // TODO: refactor this later, so can be changed from menu manager
    private generateMenu() {
        const items = [
            //{name: 'analytics', icon: 'pie-chart', permission: 'reports.view', route: 'analytics'},
            {name: 'Dashboard', icon: 'pie-chart', permission: 'reports.view', route: 'analytics'},
            //{name: 'appearance', icon: 'style', permission: 'resources.defaults.permissions.update', route: 'appearance'},
            {name: 'Sale', icon: 'assignment', permission: 'plans.view', route: 'sales'},
           // {name: 'subscriptions', icon: 'subscriptions', permission: 'subscriptions.view', route: 'subscriptions'},
            ...this.getCustomSidebarItems(),
            {name: 'settings', icon: 'settings', permission: 'settings.view', route: 'settings'},
           // {name: 'users', icon: 'person', permission: 'users.view', route: 'users'},
            //{name: 'pages', icon: 'page', permission: 'pages.view', route: 'custom-pages'},
            //{name: 'translations', icon: 'translate', permission: 'localizations.view', route: 'translations'}


            //{name: 'channels', icon: 'queue-music', route: 'channels', permission: 'channels.create'},
            //{name: 'lyrics', icon: 'queue-music', route: 'lyrics', permission: 'lyrics.view'},

            //{name: 'roles', icon: 'people', permission: 'roles.view', route: 'roles'},
            //{name: 'tags', icon: 'local-offer', permission: 'tags.view', route: 'tags'},
           // {name: 'files', icon: 'file', permission: 'files.view', route: 'files'},
        ];

        //if (this.settings.get('vebto.admin.ads')) {
            //items.push({name: 'ads', icon: 'ads', permission: 'settings.view', route: 'ads'});
        //}
        
        return items.map(item => {
            item.type = 'route';
            item.label = item.name;
            item.action = 'admin/' + item.route;
            item.activeExact = false;
            item.condition = function(user: CurrentUser, settings: Settings) {
                let condition = true;
                if (item.name === 'plans' || item.name === 'subscriptions') {
                    condition = settings.get('billing.enable');
                }
                return condition && user.hasPermission(item.permission);
            };
            return item;
        }) as MenuItem[];
    }
}
