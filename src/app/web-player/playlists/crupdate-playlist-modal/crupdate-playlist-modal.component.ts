import {finalize} from 'rxjs/operators';
import {Component, Inject, Optional, ViewEncapsulation} from '@angular/core';
import {Playlist} from '../../../models/Playlist';
import {Playlists} from '../playlists.service';
import {Settings} from '@common/core/config/settings.service';
import {Observable} from 'rxjs';
import {Toast} from '@common/core/ui/toast.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {WebPlayerImagesService} from '../../web-player-images.service';
import {ImageUploadValidator} from '../../image-upload-validator';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {UploadInputTypes} from '@common/uploads/upload-input-config';
import {openUploadWindow} from '@common/uploads/utils/open-upload-window';
import {DefaultImagePaths} from '../../default-image-paths.enum';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {UploadApiConfig} from '@common/uploads/types/upload-api-config';
import {CurrentUser} from '@common/auth/current-user';
import {environment} from '../../../../environments/environment';

export interface CrupdatePlaylistModalData {
    playlist?: Playlist;
}

@Component({
    selector: 'crupdate-playlist-modal',
    templateUrl: './crupdate-playlist-modal.component.html',
    styleUrls: ['./crupdate-playlist-modal.component.scss'],
    providers: [UploadQueueService],
    encapsulation: ViewEncapsulation.None
})
export class CrupdatePlaylistModalComponent {
    public loading = false;
    public errors: {description?: string, name?: string} = {};
    public model = new Playlist({public: 1});
    environment:any=environment;
    constructor(
        private playlists: Playlists,
        private settings: Settings,
        private uploadQueue: UploadQueueService,
        private dialogRef: MatDialogRef<CrupdatePlaylistModalComponent>,
        public images: WebPlayerImagesService,
        private imageValidator: ImageUploadValidator,
        private user: CurrentUser,
        private toast: Toast,
        @Optional() @Inject(MAT_DIALOG_DATA) public data?: CrupdatePlaylistModalData,
    ) {
        this.hydrate();
    }

    public confirm() {
        this.loading = true;

        this.crupdatePlaylist().pipe(finalize(() => {
            this.loading = false;
        })).subscribe(playlist => {
            this.dialogRef.close(playlist);
        }, (errResponse: BackendErrorResponse) => this.errors = errResponse.errors);
    }

    public close() {
        this.dialogRef.close();
    }

    private crupdatePlaylist(): Observable<Playlist> {
        const payload = {
            name: this.model.name,
            image: (this.model.image == this.images.getDefault('artist'))? null: this.model.image,
            public: this.model.public,
            description: this.model.description,
        };

        if (this.model.id) {
            const ret =  this.playlists.update(this.model.id, payload);
            this.toast.open('Playlist updated successfully.');
            return ret;
        } else {
            const ret = this.playlists.create(this.user.get('id'), payload);
            this.toast.open('Playlist created successfully.');
            return ret;
        }
    }

    public openImageUploadModal() {
        const params = {
            uri: this.environment.upload_base_url+'uploads/images',
            httpParams: {diskPrefix: 'playlist_media', disk: 'public'},
            validator: this.imageValidator
        } as UploadApiConfig;
        openUploadWindow({types: [UploadInputTypes.image], multiple: false}).then(uploadedFiles => {
            if ( ! uploadedFiles) return;
            this.uploadQueue.start(uploadedFiles, params).subscribe(response => {
                this.model.image = response.fileEntry.url;
            });
        });
    }

    private hydrate() {
        if (this.data && this.data.playlist) {
            this.model = Object.assign({}, this.data.playlist);
        }

        if ( ! this.model.image) {
            this.model.image = this.images.getDefault('artist');
        }
    }

    public getPlaylistImage() {
        if(this.model.image.includes('client/assets/')){
            return this.model.image || DefaultImagePaths.album;
        }else{
            return this.environment.image_base_url+this.model.image || this.environment.image_base_url+DefaultImagePaths.album;
        }
    }
}
