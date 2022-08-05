import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd  } from '@angular/router';
import {AuthService} from '@common/auth/auth.service';
import {DatatableService} from '../../../common/datatable/datatable.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Track} from '../../models/Track';
import {Playlist} from '../../models/Playlist';
import {Albums} from '../../web-player/albums/albums.service'
import {Album} from '../../models/Album';
import {Playlists} from '../../web-player/playlists/playlists.service'
import {Tracks} from '../../web-player/tracks/tracks.service';
import {CurrentUser} from '@common/auth/current-user';
import {downloadFileFromUrl} from '@common/uploads/utils/download-file-from-url';
import {Toast} from '../../../common/core/ui/toast.service';
import {Player} from "../../web-player/player/player.service";

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
    public tracksService: Tracks,
    public currentUser: CurrentUser,
    private player: Player,
    protected toast: Toast) {
      this.apiUrl = auth.getApiUrl();
    }
  ngAfterViewInit(): void {
  
  }

  ngOnInit(): void {
    this.playlistId = JSON.parse(this.route.snapshot.queryParams.playlist);
    this.getPlaylistById(this.playlistId);
    this.datatable.init({uri: `playlists/${this.playlistId}/tracks/${this.currentUser.get('id')}`});
  }
  downloadTrack(id:number, _index: number): void{
    this.gaane$.subscribe((elements) => {
      let storeLocation = elements[_index]
      let downloads = storeLocation['user_downloads']
      if(downloads != null){
        if(downloads == 3){
          this.toast.open('Download limit reached for this song.');
          return 
        }
        downloadFileFromUrl(this.tracksService.downloadTrack(id, this.currentUser.get('id')))
        storeLocation['user_downloads'] += 1
      }else{
        downloadFileFromUrl(this.tracksService.downloadTrack(id, this.currentUser.get('id')))
        storeLocation['user_downloads'] = 1
      }
      console.log(downloads)
    });
  }
  downloadTrackVersion(songId:number, versionId:number, songIndex: number, versionIndex: number): void{
    this.gaane$.subscribe((elements) => {
      let storeLocation = elements[songIndex]['track_versions'][versionIndex]
      let downloads = storeLocation['download_count']
      console.log(downloads);
      
      if(downloads > 0){
        if(downloads == 3){
          this.toast.open('Download limit reached for this song.');
          return
        }
        downloadFileFromUrl(this.tracksService.downloadTrackVersion(songId, versionId, this.currentUser.get('id')))
        storeLocation['download_count'] += 1
      }else{
        downloadFileFromUrl(this.tracksService.downloadTrackVersion(songId, versionId, this.currentUser.get('id')))
        storeLocation['download_count'] = 1
      }
    //   console.log(downloads)
    });
  }
  isDownloaded(count: number, downloads){
    return downloads == 0 ? '' : (downloads >= count) ? 'text-success' : ''
  }
  isVerDownloaded(count: number, downloads){
    return downloads == 0 ? '' : (downloads >= count) ? 'text-success' : ''
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
  public playTrack(track: Track) {
      this.player.queue.prepend([track]);
      this.player.cueTrack(track).then(() => {
          this.player.play();
      });
  }

  /**
   * Pause the player.
   */
  public pausePlayer() {
      this.player.pause();
  }

}
