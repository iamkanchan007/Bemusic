import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {Settings} from '@common/core/config/settings.service';
import {SearchSlideoutPanel} from '../search/search-slideout-panel/search-slideout-panel.service';
import {CurrentUser} from '@common/auth/current-user';
import {Player} from '../player/player.service';
import {WebPlayerUrls} from '../web-player-urls.service';
import {UserPlaylists} from '../playlists/user-playlists.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CrupdatePlaylistModalComponent} from '../playlists/crupdate-playlist-modal/crupdate-playlist-modal.component';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '@common/auth/auth.service';
import {ThemeService} from '@common/core/theme.service';
import {BehaviorSubject} from 'rxjs';
import {Track} from '../../models/Track';
import {ContextMenu} from '@common/core/ui/context-menu/context-menu.service';
import {PlaylistTrackContextMenuComponent} from '../../web-player/playlists/playlist-track-context-menu/playlist-track-context-menu.component';
import {TrackContextMenuComponent} from '../../web-player/tracks/track-context-menu/track-context-menu.component';
import {SelectedTracks} from '../../web-player/tracks/track-list/selected-tracks.service';
import {DatatableService} from '@common/datatable/datatable.service';
import {queueId} from '../../web-player/player/queue-id';
import {User} from '@common/core/types/models/User';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'nav-sidebar',
    templateUrl: './nav-sidebar.component.html',
    styleUrls: ['./nav-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatatableService],
})
export class NavSidebarComponent implements OnInit {
    public unreadCount$ = new BehaviorSubject<number>(0);
    public trendingTracks = [];
    public allCategories: any[];
    public allGenres: any[];
    public allSubGenres: any[];
    searchcat = new FormControl('0');
    searchgen = new FormControl('0');
    searchsubgenre = new FormControl('0');
    catdata = '';
    
    @Input() contextMenuParams = {type: 'track', extra: {}};
    paramData: any;

    constructor(
        public settings: Settings,
        public searchPanel: SearchSlideoutPanel,
        public currentUser: CurrentUser,
        public player: Player,
        public urls: WebPlayerUrls,
        public auth: AuthService,
        public playlists: UserPlaylists,
        private modal: Modal,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public theme: ThemeService,
        private contextMenu: ContextMenu,
        public selectedTracks: SelectedTracks,
        public datatable: DatatableService<Track>,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: `trendingTracks`
            // uri: `playlists/23/tracks/${this.currentUser.get('id')}`
          });
        this.searchPanel.searchCategory.setValue(0);
        this.searchPanel.searchGenre.setValue(0);
        this.searchPanel.searchSubGenre.setValue(0);
        this.unreadCount$.next(this.currentUser.get('unread_notifications_count'));
        this.getTrendingTracks()
        this.getCategory()
        this.getallGenres()
        this.getSubGenres()
        this.getPlaylists()

        this.catdata = 'eqwe';
        this.activatedRoute.queryParams.subscribe(params => {
            var paramsdata = JSON.parse(JSON.stringify(params));
            this.catdata = paramsdata.query?paramsdata.query : '';
            this.searchcat.setValue(paramsdata.catid?paramsdata.catid : 0);
            this.searchsubgenre.setValue(paramsdata.subgenre?paramsdata.subgenre : 0);
            let catdata = paramsdata?.catid?paramsdata?.catid : 0;
            this.searchgen.setValue(paramsdata.genre?paramsdata.genre : 0);
            // if(catdata){
            //     this.auth.getGenreForCat(catdata).subscribe((res:any)=>{
            //         if(res.status == 'success'){
            //             this.allGenres = res.pagination;
            //             this.searchgen.setValue(paramsdata.genre?paramsdata.genre : 0);
            //         }
            //     })
            // }
            this.paramData=paramsdata;
        });
    }
    ngAfterViewChecked(){
        this.searchgen.setValue(this.paramData?.genre?this.paramData?.genre : 0);
    }
    public queueId() {
        return queueId(this.currentUser.getModel() as User, 'a', this.datatable.getCurrentParams());
    }

    getPlaylists(){
        this.auth.getUserPlaylists().subscribe((res:any)=>{
            if(res.status==='success'){
                this.playlists.add(res.pagination.data)
            }
          })
    }
    getTrendingTracks(){
        this.auth.trendingTracks().subscribe((res:any)=>{
            if(res.status==='success'){
                this.trendingTracks = res.pagination.data;
            }
        })
    }
    getCategory(){
        this.auth.getCategory().subscribe((res:any)=>{
            if(res.status == true){
                this.allCategories = res.data;
            }
        })        
    }
    getSubGenres(){
        this.auth.getAllSubGenres().subscribe((res:any)=>{
            if(res.status == 'success'){
                this.allSubGenres = res.pagination;
            }
        })        
    } 
    getallGenres(){
        this.auth.getGenre().subscribe((res:any)=>{
            if(res.status){
                res.data.sort((a,b) => (a.name  < b.name)? -1 : 1);
                this.allGenres = res.data;
            }
        })        
    }
    // getGenre(){
    //     this.auth.getGenre().subscribe((res:any)=>{
    //         if(res.status == true){
    //             this.allGenres = res.data;
    //         }
    //     })
    // }
    getsearchcus(event){
        this.urls.paramData=this.paramData.catid?{
            'catid' :this.paramData.catid?this.paramData.catid:0,
        'genre': this.paramData.genre?this.paramData.genre:0,
        'subgenre' : this.paramData.subgenre?this.paramData.subgenre:0,
        }:{}
        this.urls.paramData['query'] = event.target.value;
        this.router.navigateByUrl('/web/playlist', {skipLocationChange: true}).then(() => {
            this.router.navigate(['web/dashboard'], { queryParams:  this.urls.paramData});
        });
    }
    getGenresearch(event){
        this.urls.paramData={
            'catid' :this.paramData.catid?this.paramData.catid:0,
        'genre': this.paramData.genre?this.paramData.genre:0,
        'subgenre' : this.paramData.subgenre?this.paramData.subgenre:0,
        }
        this.urls.paramData['genre'] = event.target.value;
        this.router.navigateByUrl('/web/playlist', {skipLocationChange: true}).then(() => {
            this.router.navigate(['web/dashboard'], { queryParams: this.urls.paramData});
        });
        
    }
    getsubGenresearch(event){
        this.urls.paramData={
            'catid' :this.paramData.catid?this.paramData.catid:0,
        'genre': this.paramData.genre?this.paramData.genre:0,
        'subgenre' : this.paramData.subgenre?this.paramData.subgenre:0,
        }
        this.urls.paramData['subgenre'] = event.target.value;
            this.router.navigateByUrl('/web/playlist', {skipLocationChange: true}).then(() => {
                this.router.navigate(['web/dashboard'], { queryParams: this.urls.paramData});
            });
    }
    getGenre(event){
        // this.auth.getGenreForCat(event.target.value).subscribe((res:any)=>{
        //     if(res.status == 'success'){
        //         this.allGenres = res.pagination;
        //     }
        // })
        this.urls.paramData={
            'catid' :this.paramData.catid?this.paramData.catid:0,
        'genre': this.paramData.genre?this.paramData.genre:0,
        'subgenre' : this.paramData.subgenre?this.paramData.subgenre:0,
        }
        this.urls.paramData['catid'] = event.target.value;
        // this.urls.paramData['genre'] = 0;
        // this.urls.paramData['subgenre'] = 0;
        console.log(this.urls.paramData);
        this.router.navigateByUrl('/web/playlist', {skipLocationChange: true}).then(() => {
            this.router.navigate(['web/dashboard'], { queryParams: this.urls.paramData});
        });
    }
    private getContextMenuComponent() {
        if (this.contextMenuParams.type === 'playlistTrack') {
            return PlaylistTrackContextMenuComponent;
        } else {
            return TrackContextMenuComponent;
        }
    }
    public getContextMenuParams(track: Track) {
        return Object.assign(
            {item: track, type: this.contextMenuParams.type, selectedTracks: this.selectedTracks},
            this.contextMenuParams.extra
        );
    }
    public showContextMenu(track: Track, e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.contextMenu.open(this.getContextMenuComponent(), e.target, {data: this.getContextMenuParams(track)});
    }
    public openNewPlaylistModal() {
        if ( ! this.currentUser.isLoggedIn()) {
            return this.router.navigate(['/login']);
        }

        this.modal.open(CrupdatePlaylistModalComponent)
            .afterClosed()
            .subscribe(playlist => {
            if ( ! playlist) return;
            this.playlists.add(playlist);
            this.router.navigate(this.urls.playlist(playlist));
        });
    }
}
