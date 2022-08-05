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
import {Keys} from '../../../web-player/keys/keys.service';
import {Genres} from '../../../web-player/genres/genres.service';
import {Key} from '../../../models/Key';
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

interface CrupdateKeyModalData {
    key?: Key;
}

@Component({
    selector: 'crupdate-key-modal',
    templateUrl: './crupdate-key-modal.component.html',
    styleUrls: ['./crupdate-key-modal.component.scss'],
    providers: [UploadQueueService],
})
export class CrupdateKeyModalComponent implements OnInit {
    public errors: any = {};
    public updating = false;
    public loading = false;
    public formSubmit = false;
    environment:any=environment;
    public key = new Key();
    public filteredUsers: Observable<Key[]> = new Subject();
    public userAutocomplete: FormControl = new FormControl(null);

    constructor(
        public settings: Settings,
        private fb: FormBuilder,
        protected keys: Keys,
        protected uploadQueue: UploadQueueService,
        private dialogRef: MatDialogRef<CrupdateKeyModalComponent>,
        private imageValidator: ImageUploadValidator,
        private toast: Toast,
        private search: Search,
        private users: Users,
        private genres: Genres,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: CrupdateKeyModalData,
    ) {
        if (this.data.key) {
            this.form.controls['name'].setValue(this.data.key.name);
            if(this.data.key.parent_id){
                this.userAutocomplete.setValue(this.data.key.parentGener);
            }
            this.key = this.data.key;
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
            message = 'Keys updated successfully.';
            request = this.keys.update(this.key.id, this.getPayload());
        } else {
            message = 'Keys created successfully.'
            request = this.keys.create(this.getPayload());
        }

        request.subscribe(response => {
            this.loading = false;
            this.toast.open(message);
            this.dialogRef.close(response.trackkeys);
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
                return this.keys.getAll({query});
            })
        );
    }

    public close(key?: Key) {
        this.dialogRef.close(key);
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
                this.key.image = response.fileEntry.url;
            });
        });
    }

    public displayFn(key?: Key): string {
        return key ? key.name : null;
    }

    private getPayload() {
        return {
            name: this.form.get('name').value,
           // display_name: this.key.display_name,
            //parent_id: this.userAutocomplete.value.id,
            //image: this.key.image,
        };
    }
}
