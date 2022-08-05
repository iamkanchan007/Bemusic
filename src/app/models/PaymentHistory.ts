import {Album} from './Album';
import {Playlist} from './Playlist';
import {Lyric} from './Lyric';
import {User} from '@common/core/types/models/User';
import {MixedArtist} from '../web-player/artists/mixed-artist';
import {Genre} from './Genre';

export const TRACK_MODEL = 'App\\Subcriptions';

export class PaymentHistory {
    id: number;
    gateway: string;
    model_type = TRACK_MODEL;
    user?: User;
    plan?: [];
    renews_at?: string;
    created_at?: string;
    updated_at?: string;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
