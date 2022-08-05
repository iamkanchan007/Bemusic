import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@common/auth/auth.service';
import { Observable } from 'rxjs';
import {WebPlayerUrls} from "../../web-player/web-player-urls.service";
import { Player } from 'src/app/web-player/player/player.service';
@Component({
  selector: 'playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistsComponent implements OnInit {
  public playlists: any[];
  public apiUrl: any;
  constructor(
    private router: Router,
    public auth: AuthService,
    public urls: WebPlayerUrls,public player: Player) {

    }

  ngOnInit(): void {
    this.getUserPlaylists()
      this.apiUrl = this.auth.getApiUrl()
  }
  getUserPlaylists(){
    let _ = this
    this.auth.getUserPlaylists().subscribe((res:any)=>{
      if(res.status==='success'){
          _.playlists = res.pagination.data
      }
    })
  }
  openDetails(playlist){
    this.router.navigate(['customer/web/playlist-details'], {queryParams: {playlist : playlist.id}});
  }
}
