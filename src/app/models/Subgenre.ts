import {Artist} from './Artist';

export const SUBGENRE_MODEL = 'App\\Subgenre';

export class Subgenre {
    id: number;
    name: string;
    display_name: string;
    model_type: 'App\\Genre';
    image: string;
    parent_id: number;
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
