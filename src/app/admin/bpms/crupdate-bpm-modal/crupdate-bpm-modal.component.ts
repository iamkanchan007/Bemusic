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
import {Bpms} from '../../../web-player/bpms/bpms.service';
import {Genres} from '../../../web-player/genres/genres.service';
import {Bpm} from '../../../models/Bpm';
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

interface CrupdateBpmModalData {
    bpm?: Bpm;
}

@Component({
    selector: 'crupdate-bpm-modal',
    templateUrl: './crupdate-bpm-modal.component.html',
    styleUrls: ['./crupdate-bpm-modal.component.scss'],
    providers: [UploadQueueService],
})
export class CrupdateBpmModalComponent implements OnInit {
    public errors: any = {};
    public updating = false;
    public loading = false;
    public formSubmit = false;
    environment:any=environment;
    public bpm = new Bpm();
    public filteredUsers: Observable<Bpm[]> = new Subject();
    public userAutocomplete: FormControl = new FormControl(null);

    constructor(
        public settings: Settings,
        private fb: FormBuilder,
        protected bpms: Bpms,
        protected uploadQueue: UploadQueueService,
        private dialogRef: MatDialogRef<CrupdateBpmModalComponent>,
        private imageValidator: ImageUploadValidator,
        private toast: Toast,
        private search: Search,
        private users: Users,
        private genres: Genres,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: CrupdateBpmModalData,
    ) {
        if (this.data.bpm) {
            this.form.controls['name'].setValue(this.data.bpm.name);
            if(this.data.bpm.parent_id){
                this.userAutocomplete.setValue(this.data.bpm.parentGener);
            }
            this.bpm = this.data.bpm;
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
            message = 'Bpm updated successfully.';
            request = this.bpms.update(this.bpm.id, this.getPayload());
        } else {
            message = 'Bpm created successfully.'
            request = this.bpms.create(this.getPayload());
        }

        request.subscribe(response => {
            this.loading = false;
            this.toast.open(message);
            this.dialogRef.close(response.trackbpms);
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
                return this.bpms.getAll({query});
            })
        );
    }

    public close(bpm?: Bpm) {
        this.dialogRef.close(bpm);
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
                this.bpm.image = response.fileEntry.url;
            });
        });
    }

    public displayFn(bpm?: Bpm): string {
        return bpm ? bpm.name : null;
    }

    private getPayload() {
        return {
            name: this.form.get('name').value,
           // display_name: this.bpm.display_name,
            //parent_id: this.userAutocomplete.value.id,
            //image: this.bpm.image,
        };
    }
}
