import {Artist} from './Artist';
import {Genre} from './Genre';

export const CATEGORIE_MODEL = 'App\\Categorie';

export class Categorie {
    id: number;
    name: string;
    display_name: string;
    model_type: 'App\\Categorie';
    image: string;
    parent_id: number;
    genres: Genre[];
    popularity: number;
    created_at: string;
    updated_at: string;
    artists?: Artist[];
    parentGener?: [];
    artists_count?: number;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
