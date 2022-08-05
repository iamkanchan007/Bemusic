import {Component, Inject, Optional} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Categories} from '../../../web-player/categories/categories.service';
import {Categorie} from '../../../models/Categorie';
//import {GENRE_MODEL} from '../../models/Genre';
import {Genre} from '../../../models/Genre';
import {Genres} from '../../../web-player/genres/genres.service';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {BehaviorSubject, Observable, of as observableOf, Subject} from 'rxjs';
import {ImageUploadValidator} from '../../../web-player/image-upload-validator';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {Settings} from '@common/core/config/settings.service';
import {finalize, map, debounceTime, switchMap} from 'rxjs/operators';
import {Search} from '../../../web-player/search/search.service';
import {openUploadWindow} from '@common/uploads/utils/open-upload-window';
import {UploadInputTypes} from '@common/uploads/upload-input-config';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {UploadApiConfig} from '../../../../common/uploads/types/upload-api-config';
import {environment} from '../../../../environments/environment';
import {Toast} from '@common/core/ui/toast.service';

interface CrupdateCategorieModalData {
    categorie?: Categorie;
}

@Component({
    selector: 'crupdate-categorie-modal',
    templateUrl: './crupdate-categorie-modal.component.html',
    styleUrls: ['./crupdate-categorie-modal.component.scss'],
    providers: [UploadQueueService],
})
export class CrupdateCategorieModalComponent {
    public errors: any = {};
    public updating = false;
    public loading = false;
    public formSubmit = false;
    public categorie = new Categorie();
    genereList: string[] = [];
    public form = this.fb.group({
        name: [''],
        genres: [[]]
    });
    environment:any=environment;
    constructor(
        private fb: FormBuilder,
        public settings: Settings,
        protected categories: Categories,
        protected genres: Genres,
        protected uploadQueue: UploadQueueService,
        private dialogRef: MatDialogRef<CrupdateCategorieModalComponent>,
        private imageValidator: ImageUploadValidator,
        private toast: Toast,
        private search: Search,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: CrupdateCategorieModalData,
    ) {
        if (this.data.categorie) {
            this.categorie = this.data.categorie;
            this.form.controls['name'].setValue(this.categorie.name);
            this.form.controls['genres'].setValue((this.categorie.genres || []).map(t => t.name) as any);

            this.updating = true;
        }
        this.genres.getall().subscribe((res:any)=>{
            if(res.status == "success"){
                var self =this;
                if(res.pagination){
                    res.pagination.forEach(function(element){
                        self.genereList.push(element.name);
                    });
                }
 
            }
        })        
    }

    public suggestGenreFn = (query: string) => {
        return this.search.media(query, {modelTypes: ['App\\Genre'], limit: 5})
            .pipe(map(response => response.results.genres.map(genre => genre.name)));
    }
    iserror(){
        if(this.form.get('name').value == ""){
            return true;
        }
        return false;
    }

    public confirm() {
        let request;
        this.formSubmit = true;
        if(this.iserror()){
            return;
        }
        var message = "";
        if (this.updating) {
            message = 'Category Updated successfully.';
            request = this.categories.update(this.categorie.id, this.getPayload());
        } else {
            message = 'Category Created successfully.'
            request = this.categories.create(this.getPayload());
        }

        request.subscribe(response => {
            this.loading = false;
            this.toast.open(message);
            this.dialogRef.close(response.categorie);
        }, (errResponse: BackendErrorResponse) => {
            this.loading = false;
            this.toast.open('something went wrong.');
            this.errors = errResponse.errors;
        });
    }

    public close(categorie?: Categorie) {
        this.dialogRef.close(categorie);
    }

    public openUploadImageModal() {
        const params = {
            uri: this.environment.upload_base_url+'uploads/images',
            httpParams: {diskPrefix: 'genre_media', disk: 'public'},
            validator: this.imageValidator
        } as UploadApiConfig;
        openUploadWindow({types: [UploadInputTypes.image]}).then(uploadedFiles => {
            if ( ! uploadedFiles) return;
            this.uploadQueue.start(uploadedFiles, params).subscribe(response => {
                this.categorie.image = response.fileEntry.url;
            });
        });
    }

    private getPayload() {
        return {
            name: this.form.get('name').value,
            genres: this.form.get('genres').value,
            // image: this.categorie.image,
        };
    }
}
