import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CurrentUser } from '../auth/current-user';

@Injectable({
    providedIn: 'root',
})
export class IsCustomerGuard implements CanActivate {
    constructor(
        private currentUser: CurrentUser,
        private router: Router
    ) { }

    canActivate() {
        if(this.currentUser.hasRole('admin')){
            this.router.navigate(['/admin/analytics/google']);
            return false;
        }
        if (this.currentUser.getModel().roles == undefined || this.currentUser.hasRole('dj')) {
        //if (this.currentUser.getModel().roles == undefined || this.currentUser.hasRole('customer')) {
            return true;
        } else {
            this.router.navigate(['/label']);
            return false;
        }
    }
}
