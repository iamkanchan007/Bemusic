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
import moment from 'moment';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Promocodes} from '../../../web-player/promocodes/promocodes.service';
import {Genres} from '../../../web-player/genres/genres.service';
import {Promocode} from '../../../models/Promocode';
import {MatDatepicker} from '@angular/material/datepicker';
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
import {Plans} from '@common/shared/billing/plans.service';

interface CrupdatePromocodeModalData {
    promocode?: Promocode;
}

@Component({
    selector: 'crupdate-promocode-modal',
    templateUrl: './crupdate-promocode-modal.component.html',
    styleUrls: ['./crupdate-promocode-modal.component.scss'],
    providers: [UploadQueueService],
})
export class CrupdatePromocodeModalComponent implements OnInit {
    public errors: any = {};
    public updating = false;
    public loading = false;
    public formSubmit = false;
    public is_infinite = false;

    public promocode = new Promocode();
    public filteredUsers: Observable<Promocode[]> = new Subject();
    public userAutocomplete: FormControl = new FormControl(null);
    planList: string[] = [];

    constructor(
        public settings: Settings,
        private fb: FormBuilder,
        protected promocodes: Promocodes,
        protected uploadQueue: UploadQueueService,
        private dialogRef: MatDialogRef<CrupdatePromocodeModalComponent>,
        private imageValidator: ImageUploadValidator,
        private toast: Toast,
        private search: Search,
        private users: Users,
        private genres: Genres,
        private plans: Plans,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: CrupdatePromocodeModalData,
    ) {
        if (this.data.promocode) {

            this.form.controls['name'].setValue(this.data.promocode.name);
            this.form.controls['for_plan'].setValue(this.data.promocode.plan_id);
            this.form.controls['discount'].setValue(this.data.promocode.discount);
            this.form.controls['how_long'].setValue(this.data.promocode.how_long);
            this.form.controls['valid_from'].setValue(this.data.promocode.valid_from);
            this.form.controls['valid_to'].setValue(this.data.promocode.valid_to);

            this.is_infinite = this.data.promocode.is_infinite;
            this.promocode = this.data.promocode;
            this.updating = true;
        }
        this.plans.all().subscribe((res:any)=>{
            if(res.status == "success"){
                var self =this;
                if(res.pagination){
                    res.pagination.data.forEach(function(element){
                        self.planList.push(element);
                    });
                }

            }
        })
    }
    public form = this.fb.group({
        id: [null],
        name: [''],
        for_plan: [''],
        how_long: [''],
        discount: [''],
        valid_from: [''],
        valid_to: [''],
    });

    ngOnInit() {
        this.bindToUserAutocomplete();
    }

    mindate() {
        var date = moment(moment(), "MM-DD-YYYY");
        return date.format('YYYY-MM-DD');
    }

    iserror(name){
        if(this.form.get(name).value == "" || this.form.get(name).value == null){
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
        if(this.form.get('for_plan').value == "" || this.form.get('name').value == "" || this.form.get('how_long').value == "" || this.form.get('discount').value == ""){
            return;
        }
        if(this.form.get('for_plan').value == null || this.form.get('name').value == null || this.form.get('how_long').value == null || this.form.get('discount').value == null){
            return;
        }
        if(!this.is_infinite){
            if(this.form.get('valid_from').value == ""|| this.form.get('valid_to').value == ""){
                return;
            }
            if(this.form.get('valid_from').value == null|| this.form.get('valid_to').value == null){
                return;
            }
        }
        let request;
        var message = "";
        if (this.updating) {
            message = 'Promo code updated successfully.';
            request = this.promocodes.update(this.promocode.id, this.getPayload());
        } else {
            message = 'Promo code created successfully.'
            request = this.promocodes.create(this.getPayload());
        }

        request.subscribe(response => {
            this.loading = false;
            this.toast.open(message);
            this.dialogRef.close(response.promocodes);
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
                return this.promocodes.getAll({query});
            })
        );
    }

    public close(promocode?: Promocode) {
        this.dialogRef.close(promocode);
    }

    // public openUploadImageModal() {
    //     const params = {
    //         uri: environment.upload_base_url+'uploads/images',
    //         httpParams: {diskPrefix: 'genre_media', disk: 'public'},
    //         validator: this.imageValidator
    //     } as UploadApiConfig;
    //     openUploadWindow({types: [UploadInputTypes.image]}).then(uploadedFiles => {
    //         if ( ! uploadedFiles) return;
    //         this.uploadQueue.start(uploadedFiles, params).subscribe(response => {
    //             this.promocode.image = response.fileEntry.url;
    //         });
    //     });
    // }

    public displayFn(promocode?: Promocode): string {
        return promocode ? promocode.name : null;
    }

    private getPayload() {
        return {
            name: this.form.get('name').value,
            discount: this.form.get('discount').value,
            how_long: this.form.get('how_long').value,
            valid_from: this.form.get('valid_from').value,
            valid_to: this.form.get('valid_to').value,
            plan_id: this.form.get('for_plan').value,
            is_infinite: this.is_infinite
            //display_name: this.promocode.display_name,
            //parent_id: this.userAutocomplete.value.id,
            //image: this.promocode.image,
        };
    }

    public toggleEnable(e) {
        if(e.checked){
            this.is_infinite = true;
            this.form.controls['valid_from'].setValue("");
            this.form.controls['valid_to'].setValue("");
        } else {
            this.is_infinite = false;
        }
    }
}
