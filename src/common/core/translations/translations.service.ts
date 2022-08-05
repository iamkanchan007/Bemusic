import { EventEmitter, Injectable } from '@angular/core';
import { Localization } from '../types/models/Localization';
import { Settings } from '../config/settings.service';
import { LocalizationWithLines } from '../types/localization-with-lines';

@Injectable({
    providedIn: 'root',
})
export class Translations {

    /**
     * Fired when active localization changes.
     */
    public localizationChange = new EventEmitter();

    /**
     * Currently active localization.
     */
    public localization: LocalizationWithLines = {model: new Localization(), name: '', lines: {}};
    lines:any=[];
    constructor(private settings: Settings) {
        this.localization=JSON.parse(localStorage.getItem('lang'));
        console.log("ajsgggggg",this.localization)
        this.settings.set('i18n.enable',this.localization?.model.language);
        
    }

    public t(transKey: string, values?: object): string {
        if ( ! transKey) return '';
        if ( ! this.translationsEnabled()) {
            return this.replacePlaceholders(transKey, values);
        }
        
        const translation = this.localization.lines[transKey.toLowerCase().trim()] || transKey;
        return this.replacePlaceholders(translation, values);
    }

    private replacePlaceholders(message: string, values: object): string {
        if ( ! values) return message;

        const keys = Object.keys(values);

        keys.forEach(key => {
            const regex = new RegExp(':' + key, 'g');
            message = message.replace(regex, values[key]);
        });

        return message;
    }

    /**
     * Get currently active localization.
     */
    public getActive(): LocalizationWithLines {
        return this.localization;
    }

    /**
     * Set active localization.
     */
    public setLocalization(localization: LocalizationWithLines) {
        if (!localization || !localization.lines || !localization.model) return;
        if (this.localization?.model.name === localization?.model.name) return;

        localization.lines = this.objectKeysToLowerCase(localization.lines);
        this.localization = localization;
        this.settings.set('i18n.enable',this.localization?.model.language);
        localStorage.setItem('lang',JSON.stringify(this.localization));
        this.localizationChange.emit();
    }

    private objectKeysToLowerCase(object: object) {
        const newObject = {};

        Object.keys(object).forEach(key => {
            newObject[key.toLowerCase()] = object[key];
        });

        return newObject;
    }

    /**
     * Check if i18n functionality is enabled.
     */
    private translationsEnabled(): boolean {
        return this.settings.get('i18n.enable');
    }
}
