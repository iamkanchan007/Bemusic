import {finalize} from 'rxjs/operators';
import {Component, Injector, ViewEncapsulation} from '@angular/core';
import {Track} from '../../../models/Track';
import {ContextMenuComponent} from '../../context-menu/context-menu.component';
import {Player} from '../../player/player.service';
import {UserLibrary} from '../../users/user-library/user-library.service';
import {SelectedTracks} from '../track-list/selected-tracks.service';
import {Lyrics} from '../../lyrics/lyrics.service';
import {LyricsModalComponent} from '../../lyrics/lyrics-modal/lyrics-modal.component';
import {downloadFileFromUrl} from '@common/uploads/utils/download-file-from-url';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {Tracks} from '../tracks.service';

@Component({
    selector: 'track-context-menu',
    templateUrl: './track-context-menu.component.html',
    styleUrls: ['./track-context-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'context-menu'},
})
export class TrackContextMenuComponent extends ContextMenuComponent<Track> {
    public data: {selectedTracks?: SelectedTracks, playlistId?: number, item: Track};
    public shouldHideDownloadButton: boolean;
    public editTrackUrl: (string | number)[];

    constructor(
        protected player: Player,
        protected library: UserLibrary,
        protected injector: Injector,
        protected lyrics: Lyrics,
        protected tracks: Tracks,
    ) {
        super(injector);
        this.shouldHideDownloadButton = !this.settings.get('player.enable_download') || !this.currentUser.hasPermission('tracks.download');
        if (this.currentUser.isAdmin()) {
            this.editTrackUrl = ['admin/tracks', this.data.item.id];
        } else {
            this.editTrackUrl = ['upload/tracks', this.data.item.id, 'edit'];
        }
    }

    /**
     * Check if this track is in player queue.
     */
    public inQueue() {
        return this.player.queue.has(this.data.item);
    }

    /**
     * Remove track from player queue.
     */
    public removeFromQueue() {
        this.player.queue.remove(this.data.item);
        this.contextMenu.close();
    }

    /**
     * Check if track is in user's library.
     */
    public inLibrary() {
        return this.library.has(this.data.item);
    }

    /**
     * Remove track from user's library.
     */
    public removeFromLibrary() {
        this.library.remove(this.getTracks());
        this.contextMenu.close();
    }

    /**
     * Copy fully qualified album url to clipboard.
     */
    public copyLinkToClipboard() {
        super.copyLinkToClipboard('track');
    }

    /**
     * Check if multiple tracks are selected in track list.
     */
    public multipleTracksSelected() {
        return this.data.selectedTracks && this.data.selectedTracks.all().length > 1;
    }

    /**
     * Get tracks that should be used by context menu.
     */
    public getTracks(): Track[] {
        return this.getSelectedTracks() || [this.data.item];
    }

    /**
     * Go to track radio route.
     */
    public goToTrackRadio() {
        this.contextMenu.close();
        this.router.navigate(this.urls.trackRadio(this.data.item));
    }

    /**
     * Fetch lyrics and show lyrics modal.
     */
    public showLyricsModal() {
        this.state.loading = true;
        this.contextMenu.close();

        this.lyrics.get(this.data.item.id).pipe(finalize(() => {
            this.state.loading = false;
        })).subscribe(response => {
            this.modal.open(LyricsModalComponent, {lyrics: response.lyric.text}, {panelClass: 'lyrics-modal-container'});
        }, () => {
            this.toast.open('Could not find lyrics for this song.');
        });
    }

    public downloadTrack() {
        const track = this.data.item;
        if ( ! track) return;
        downloadFileFromUrl(this.urls.trackDownload(track));
    }

    private getSelectedTracks() {
        if ( ! this.data.selectedTracks || this.data.selectedTracks.all().length <= 1) return;
        return this.data.selectedTracks.all();
    }

    public canEditTrack(permission = 'tracks.update') {
        const userOwnsTrack = !!(this.data.item.artists || []).find(user => {
            return user.id === this.currentUser.get('id');
        });
        return userOwnsTrack || this.currentUser.hasPermission(permission);
    }

    public maybeDeleteTrack() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Track',
            body:  'Are you sure you want to delete this track?',
            ok:    'Delete'
        }).beforeClosed().subscribe(confirmed => {
            if (confirmed) {
                this.tracks.delete([this.data.item.id]).subscribe(() => {
                    this.toast.open('Track deleted.');
                });
            }
        });
    }
}
