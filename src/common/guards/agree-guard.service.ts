import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AgreeGuard implements CanActivate {
    constructor(
        private auth: AuthService,
        private router: Router,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(this.auth.isAgree()){
            return true
        }
        this.router.navigateByUrl('/web/disclaimer');
        return false;
    }
}
