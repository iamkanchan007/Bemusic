import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {CurrentUser} from '../auth/current-user';
import {Settings} from '../core/config/settings.service';
import {AppearanceListenerService} from '../shared/appearance/appearance-listener.service';

@Injectable({
    providedIn: 'root',
})
export class MembershipGuard implements CanActivate {
    constructor(
        private currentUser: CurrentUser,
        private auth: AuthService,
        private router: Router,
        private settings: Settings,
        private listener: AppearanceListenerService,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(this.currentUser.getModel().profile_complete){
            return true;
        }else{
            this.router.navigate(['/complete-profile']);
            return false;
        }
    }
}
