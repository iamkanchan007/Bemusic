import {Injectable, NgZone} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrentUser} from './current-user';
import {Toast} from '../core/ui/toast.service';
import {User} from '../core/types/models/User';
import {BehaviorSubject, Observable} from 'rxjs';
import {Settings} from '../core/config/settings.service';
import {AppHttpClient} from '../core/http/app-http-client.service';
import {BackendResponse} from '../core/types/backend-response';
import { RoleService } from '@common/admin/roles/role.service';
import {HttpClient, HttpEventType, HttpParams, HttpRequest} from '@angular/common/http';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isLabel:boolean=false;
    public forcedEmail$ = new BehaviorSubject(null);
    agree: any;
    constructor(
        protected httpClient: AppHttpClient,
        protected http: HttpClient,
        protected currentUser: CurrentUser,
        protected router: Router,
        protected route: ActivatedRoute,
        protected toast: Toast,
        protected zone: NgZone,
        protected config: Settings,
        public rolesService: RoleService
    ) {
        this.agree=JSON.parse(localStorage.getItem('isAgree'));
    }
    getApiUrl(){
        return this.httpClient.apiUrl
    }
    isAgree(){
        return this.agree && this.agree.value
    }
    public djTypes(){
        return this.httpClient.get('djtypes');
    }
    public isProfileComplete(id){
        return this.httpClient.get('chekccompleteprofile/'+id);
    }
    public getTicketReasons(){
        return this.httpClient.get('ticket-reasons');
    }
    public searchData({query, modelTypes}){
        //console.log(modelTypes);
        return this.httpClient.get(`search?query=${query}&modelTypes=${modelTypes}`);
    }
    public getCarouselData(){
        return this.httpClient.get('carousel-images');
    }
    public trendingTracks(){
        return this.httpClient.get('trendingTracks');
    }
    public getCategory(){
        return this.httpClient.get('category/list');
    }
    public getGenre(){
        return this.httpClient.get('genre/list');
    }
    public getSubGenres(){
        return this.httpClient.get('subgenres');
    }
    public getAllSubGenres(){
        return this.httpClient.get('allsubgenres');
    }
    public getGenreForCat(id){
        return this.httpClient.get(`searchBycatNew/${id}`);
    }
    public getUserPlaylists(){
        return this.httpClient.get(`user/${this.currentUser.getModel().id}/playlists`);
    }
    public getPlaylistById(id){
        return this.httpClient.get(`playlists/${id}`);
    }
    public getAllPlaylists(){
        return this.httpClient.get(`playlists`);
    }
    public getAllPlaylistsWithPages(url){
       return this.http.get(url);
    }
    public login(credentials: object): BackendResponse<{data: string}> {
        return this.httpClient.post('auth/login', credentials);
    }
    public generateTicket(credentials: object, id: string): BackendResponse<{data: string}> {
        return this.httpClient.post(`create-ticket/${id}`, credentials);
     }
 
    public completeProfile(credentials: object, id: string): BackendResponse<{data: string}> {
       return this.httpClient.put(`user-profile/${id}`, credentials);
    }
    public addressDetail(credentials: object, id: string): BackendResponse<{data: string}> {
        return this.httpClient.put(`user-profile/update/address/${id}`, credentials);
    }
    public register(credentials: object): BackendResponse<{bootstrapData?: string, message?: string}> {
        return this.httpClient.post('auth/register', credentials);
    }
  
    public registerLabel(credentials: object): BackendResponse<{bootstrapData?: string, message?: string}> {
        return this.httpClient.put('add-label-user', credentials);
    }
    
    public logOut() {
        this.httpClient.post('auth/logout').subscribe(() => {
            this.currentUser.assignCurrent();
            this.currentUser.getModel().profile_complete=false;
            localStorage.removeItem('cuser');
            this.toast.open('Logged out successfully.');
            setTimeout(function(){  
                location.reload(); 
                this.router.navigate(['/login']);
            }, 1000);
            
            
        });
    }

    public sendPasswordResetLink(credentials: object): Observable<{ data: string }> {
        return this.httpClient.post('auth/password/email', credentials);
    }

    public resetPassword(credentials: object): Observable<{ data: User }> {
        return this.httpClient.post('auth/password/reset', credentials);
    }

    public savePassword(credentials: object, userId: string): Observable<{ data: User }> {
        return this.httpClient.post(`users/${userId}/password/change`, credentials);
    }
    
    public resendEmailConfirmation(email: string): BackendResponse<void> {
        return this.httpClient.post('auth/email/verify/resend', {email});
    }

    /**
     * Get URI user should be redirect to after login.
     */
    public getRedirectUri(): string {
        if (this.currentUser.redirectUri) {
            const redirectUri = this.currentUser.redirectUri;
            this.currentUser.redirectUri = null;
            return redirectUri;
        } else if (this.currentUser.isAdmin()) {
            return this.config.get('vebto.auth.adminRedirectUri');
        } else {
            return this.config.get('vebto.auth.redirectUri');
        }
    }
    public fetchAllRoles() {
        return this.httpClient.get('roles');
    }
}
