import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    Inject, 
    Optional,
    SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Subgenres} from '../../../web-player/subgenres/subgenres.service';
import {Genres} from '../../../web-player/genres/genres.service';
import {Subgenre} from '../../../models/Subgenre';
import {BehaviorSubject, Observable, of as observableOf, Subject} from 'rxjs';
import {finalize, map, debounceTime, switchMap} from 'rxjs/operators';
import {ImageUploadValidator} from '../../../web-player/image-upload-validator';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {Settings} from '@common/core/config/settings.service';
import {openUploadWindow} from '@common/uploads/utils/open-upload-window';
import {UploadInputTypes} from '@common/uploads/upload-input-config';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {UploadApiConfig} from '../../../../common/uploads/types/upload-api-config';
import {environment} from '../../../../environments/environment';
import {Toast} from '@common/core/ui/toast.service';
import {Search} from '../../../web-player/search/search.service';
import {GENRE_MODEL} from '../../../models/Genre';
import {User} from '@common/core/types/models/User';
import {Users} from '@common/auth/users.service';

interface CrupdateSubgenreModalData {
    subgenre?: Subgenre;
}

@Component({
    selector: 'crupdate-subgenre-modal',
    templateUrl: './crupdate-subgenre-modal.component.html',
    styleUrls: ['./crupdate-subgenre-modal.component.scss'],
    providers: [UploadQueueService],
})
export class CrupdateSubgenreModalComponent implements OnInit {
    public errors: any = {};
    public updating = false;
    public loading = false;
    public formSubmit = false;
    environment:any=environment;
    public subgenre = new Subgenre();
    public filteredUsers: Observable<Subgenre[]> = new Subject();
    public userAutocomplete: FormControl = new FormControl(null);

    constructor(
        public settings: Settings,
        private fb: FormBuilder,
        protected subgenres: Subgenres,
        protected uploadQueue: UploadQueueService,
        private dialogRef: MatDialogRef<CrupdateSubgenreModalComponent>,
        private imageValidator: ImageUploadValidator,
        private toast: Toast,
        private search: Search,
        private users: Users,
        private genres: Genres,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: CrupdateSubgenreModalData,
    ) {
        if (this.data.subgenre) {
            this.form.controls['name'].setValue(this.data.subgenre.name);
            if(this.data.subgenre.parent_id){
                this.userAutocomplete.setValue(this.data.subgenre.parentGener);
            }
            this.subgenre = this.data.subgenre;
            this.updating = true;
        }
    }
    public form = this.fb.group({
        id: [null],
        name: [''],
        genres: [[]]
    });

    ngOnInit() {
        this.bindToUserAutocomplete();
    }
    iserror(){
        if(this.form.get('name').value == ""){
            return true;
        }
        return false;
    }
    isgenrror(){
        if(!this.userAutocomplete.value || !this.userAutocomplete.value.id){
            return true;
        }
        return false;
    }

    public confirm() {
        this.formSubmit = true;
        if(this.iserror()){
            return;
        }
        let request;
        var message = "";
        if (this.updating) {
            message = 'Sub Genres updated successfully.';
            request = this.subgenres.update(this.subgenre.id, this.getPayload());
        } else {
            message = 'Sub Genres created successfully.'
            request = this.subgenres.create(this.getPayload());
        }

        request.subscribe(response => {
            this.loading = false;
            this.toast.open(message);
            this.dialogRef.close(response.subgenre);
        }, (errResponse: BackendErrorResponse) => {
            this.loading = false;
            this.toast.open('something went wrong.');
            this.errors = errResponse.errors;
        });
    }

    private bindToUserAutocomplete() {
        this.filteredUsers = this.userAutocomplete.valueChanges.pipe(
            debounceTime(400),
            switchMap(query => {
                if (!query) return observableOf([]);
                return this.subgenres.getAll({query});
            })
        );
    }

    public close(subgenre?: Subgenre) {
        this.dialogRef.close(subgenre);
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
                this.subgenre.image = response.fileEntry.url;
            });
        });
    }

    public displayFn(subgenre?: Subgenre): string {
        return subgenre ? subgenre.name : null;
    }

    private getPayload() {
        return {
            name: this.form.get('name').value,
            display_name: this.subgenre.display_name,
            //parent_id: this.userAutocomplete.value.id,
            image: this.subgenre.image,
        };
    }
}
