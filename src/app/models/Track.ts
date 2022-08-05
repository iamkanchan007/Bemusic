import {Album} from './Album';
import {Playlist} from './Playlist';
import {Lyric} from './Lyric';
import {User} from '@common/core/types/models/User';
import {MixedArtist} from '../web-player/artists/mixed-artist';
import {Tag} from '@common/core/types/models/Tag';
import {Genre} from './Genre';
import {Subgenre} from './Subgenre';

export const TRACK_MODEL = 'App\\Track';

export class Track {
    id: number;
    name: string;
    model_type = TRACK_MODEL;
    album_name: string;
    number: number;
    duration?: number;
    artists?: MixedArtist[];
    youtube_id?: string;
    plays_count?: number;
    spotify_popularity: number;
    popularity?: number;
    spotify_id: number;
    album_id: number;
    temp_id?: string;
    url?: string;
    image?: string;
    users?: User[];
    labeluser?: [];
    lyric?: Lyric;
    album?: Album;
    playlists?: Playlist[];
    user_id?: number;
    user?: User;
    local_popularity?: number;
    track_default?: number;
    description?: string;
    tags: Tag[];
    genres: Genre[];
    subgenres: Subgenre[];
    likes_count?: number;
    reposts_count?: number;
    comments_count?: number;
    created_at?: string;
    updated_at?: string;
    created_at_relative?: string;
    t_key?: string;
    key?: string;
    category?: string;
    category_id?: string;
    varsion?: string;
    varsions?: {
        name: string, 
        category: string, 
        key: string,
        bpm: string,
        url: string,
        genres: Genre[],
        subgenres: Subgenre[],
        default_track: string,
        id: string,
        position: number,
        duration: string,
    }[];

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
