import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd  } from '@angular/router';
import {AuthService} from '@common/auth/auth.service';
import {DatatableService} from '../../../../common/datatable/datatable.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Track} from '../../../models/Track';
import {Playlist} from '../../../models/Playlist';
import {Albums} from '../../../web-player/albums/albums.service'
import {Album} from '../../../models/Album';
import {Playlists} from '../../../web-player/playlists/playlists.service'
import {Tracks} from '../../../web-player/tracks/tracks.service';

import {CurrentUser} from '@common/auth/current-user';
import {downloadFileFromUrl} from '@common/uploads/utils/download-file-from-url';
@Component({ 
  selector: 'playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.scss'],
  providers: [DatatableService],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistDetailsComponent implements OnInit, AfterViewInit {
  playlistId: any;
  public playlist: any[];
  public playlistTracks: any[];
  public apiUrl: any;
  public gaane$ = this.datatable.data$ as Observable<Track[]>;
  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    public datatable: DatatableService<Track>, 
    public tracksService: Tracks, public currentUser: CurrentUser) {
    this.apiUrl = auth.getApiUrl();
  }
  ngAfterViewInit(): void {
  
  }

  ngOnInit(): void {
    this.playlistId = JSON.parse(this.route.snapshot.queryParams.playlist);
    this.getPlaylistById(this.playlistId);
    this.datatable.init({uri: `playlists/${this.playlistId}/tracks`});
  }
  downloadTrack(id): void{
    downloadFileFromUrl(this.tracksService.downloadTrack(id, this.currentUser.get('id')))
  }
  getPlaylistById(id){
    let _ = this
    this.auth.getPlaylistById(id).subscribe((res:any)=>{
      if(res.status==='success'){
          _.playlist = res.playlist
          _.playlistTracks = res.tracks.data
      }
    })
}

}
