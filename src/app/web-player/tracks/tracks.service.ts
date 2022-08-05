import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {Track} from '../../models/Track';
import {BackendResponse} from '@common/core/types/backend-response';
import {TrackComment} from '../../models/TrackComment';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {PaginatedBackendResponse} from '@common/core/types/pagination/paginated-backend-response';
import {PaginationParams} from '@common/core/types/pagination/pagination-params';
import {Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Settings} from '@common/core/config/settings.service';
export const TRACKS_BASE_URI = 'tracks';

export interface GetTrackResponse {
    track: Track;
    comments: PaginationResponse<TrackComment>;
}

@Injectable({
    providedIn: 'root'
})
export class Tracks {
    public tracksDeleted$ = new Subject<number[]>();
    constructor(private http: AppHttpClient, private settings: Settings) {}

    public get(id: number): BackendResponse<GetTrackResponse> {
        return this.http.get(`${TRACKS_BASE_URI}/${id}`);
    }

    public getRadioRecommendations(id: number) {
        return this.http.get(`radio/track/${id}`);
    }
    public checkUrlDownload(url:string){
        return this.http.checkUrl(url);    
    }
    public downloadTrack(tid: number, uid: number) {
        return this.settings.getBaseUrl(true) + `secure/${TRACKS_BASE_URI}/${tid}/${uid}/download`;
    }
    public todayDownloads( uid: number) { 
        return this.http.get(`todaydownloads/${uid}`);
    }
    public downloadTrackVersion(songId: number, versionId: number, uid: number) {
        return this.settings.getBaseUrl(true) + `secure/${TRACKS_BASE_URI}/${songId}/${versionId}/${uid}/download`;
    }
    public create(payload: Partial<Track>): BackendResponse<{track: Track}> {
        return this.http.post(TRACKS_BASE_URI, payload);
    }

    public update(id: number, payload: Partial<Track>): BackendResponse<{track: Track}> {
        return this.http.put(`${TRACKS_BASE_URI}/${id}`, payload);
    }

    public delete(ids: number[]) {
        return this.http.delete(TRACKS_BASE_URI, {ids}).pipe(tap(() => {
            this.tracksDeleted$.next(ids);
        }));
    }

    public enable(id) {
        return this.http.get(`track/enable/${id}`);
    }

    public disable(id) {
        return this.http.get(`track/disable/${id}`);
    }

    public logPlay(track: Track) {
        return this.http.post(`track/plays/${track.id}/log`);
    }

    public loadWaveData(id: number): BackendResponse<{waveData: number[][], comments: TrackComment[]}> {
        return this.http.get(`${TRACKS_BASE_URI}/${id}/wave`);
    }

    public loadComments(id: number, params: PaginationParams): PaginatedBackendResponse<TrackComment> {
        return this.http.get(`${TRACKS_BASE_URI}/${id}/comments`, params);
    }
}
