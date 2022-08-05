import {Artist} from './Artist';

export const SUBGENRE_MODEL = 'App\\Subgenre';

export class Promocode {
    id: number;
    name: string;
    plan_id: number;
    discount: number;
    how_long: number;
    valid_from: string;
    valid_to: string;
    created_at: string;
    updated_at: string;
    is_infinite: boolean;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
