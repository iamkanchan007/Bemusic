import {catchError, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Injectable, ViewChild, ElementRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Search} from '../search.service';
import {of as observableOf} from 'rxjs';
import {Router} from '@angular/router';
import {SearchResults} from '../search-results';
import {MAIN_SEARCH_MODELS} from '../../../models/model_types';

@Injectable({
    providedIn: 'root'
})
export class SearchSlideoutPanel {
    public noResults = false;
    public searching = false;
    public isOpen = false;
    public searchQuery = new FormControl();
    public searchCategory = new FormControl();
    public searchGenre = new FormControl();
    public searchSubGenre = new FormControl();
    public results: SearchResults;

    constructor(private search: Search, private router: Router) {
        this.bindToSearchQuery();
        this.bindTosearchCategoryQuery();
        this.bindTosearchGenreQuery();
        this.bindTosearchSubGenreQuery();
        this.results = this.getEmptyResultSet();
    }

    public close() {
        this.searchQuery.reset();
        this.isOpen = false;
        this.results = this.getEmptyResultSet();
    }

    public open() {
        this.isOpen = true;
    }

    public clearInput() {
        this.searchQuery.reset();
    }

    public goToSearchPage() {
        if ( ! this.searchQuery.value) return;
        this.router.navigate(['/search', this.searchQuery.value]);
    }

    private bindToSearchQuery() {
        this.searchQuery.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(query => {
                this.searching = true;
                //if ( ! query) return observableOf({results: this.getEmptyResultSet()});
                return this.search.searchcutomTrack(query, 
                    {
                        limit: 3,
                        modelTypes: MAIN_SEARCH_MODELS,
                        category: this.searchCategory.value,
                        genres: this.searchGenre.value,
                        subgenres: this.searchSubGenre.value
                    }
                    ).pipe(catchError(() => {
                    this.searching = false;
                    return observableOf({results: this.getEmptyResultSet()});
                }));
            })).subscribe(response => {
                this.results = response.results;
                this.noResults = !this.responseHasResults(response);
                this.searching = false;
                if (this.searchQuery.value) this.open();
            });
    }
    private bindTosearchCategoryQuery() {
        this.searchCategory.valueChanges.pipe(
          switchMap(query => {
                this.searching = true;
                if ( ! query) return observableOf({results: this.getEmptyResultSet()});
                return this.search.searchcutomTrack(this.searchQuery.value,
                    {
                        limit: 3,
                        modelTypes: MAIN_SEARCH_MODELS,
                        category: query,
                        genres: '0',
                        subgenres: '0'
                    }
                    ).pipe(catchError(() => {
                    this.searching = false;
                    return observableOf({results: this.getEmptyResultSet()});
                }));
            })).subscribe(response => {
                this.results = response.results;
                this.noResults = !this.responseHasResults(response);
                this.searching = false;
                if (this.searchCategory.value) this.open();
            });
    }
    private bindTosearchGenreQuery() {
        this.searchGenre.valueChanges.pipe(
            switchMap(query => {
                this.searching = true;
                if ( ! query) return observableOf({results: this.getEmptyResultSet()});
                return this.search.searchcutomTrack(this.searchQuery.value,
                    {
                        limit: 3,
                        modelTypes: MAIN_SEARCH_MODELS,
                        category: this.searchCategory.value,
                        genres: query,
                        subgenres: '0'
                    }
                ).pipe(catchError(() => {
                    this.searching = false;
                    return observableOf({results: this.getEmptyResultSet()});
                }));
            })).subscribe(response => {
                this.results = response.results;
                this.noResults = !this.responseHasResults(response);
                this.searching = false;
                if (this.searchGenre.value) this.open();
            });
    }
    private bindTosearchSubGenreQuery() {
        this.searchSubGenre.valueChanges.pipe(
            switchMap(query => { 
                this.searching = true;
                if ( ! query) return observableOf({results: this.getEmptyResultSet()});
                return this.search.searchcutomTrack(this.searchQuery.value,
                    {
                        limit: 3,
                        modelTypes: MAIN_SEARCH_MODELS,
                        category: this.searchCategory.value,
                        genres: this.searchGenre.value,
                        subgenres: query
                    }
                    ).pipe(catchError(() => {
                    this.searching = false;
                    return observableOf({results: this.getEmptyResultSet()});
                }));
            })).subscribe(response => {
                this.results = response.results;
                this.noResults = !this.responseHasResults(response);
                this.searching = false;
                if (this.searchSubGenre.value) this.open();
            });
    }

    private responseHasResults(response: Object): boolean {
        for (const key in response) {
            if (response[key].length) return true;
        }
    }

    private getEmptyResultSet(): SearchResults {
        return {
            albums: [],
            artists: [],
            tracks: [],
            playlists: [],
            users: [],
        };
    }
}
