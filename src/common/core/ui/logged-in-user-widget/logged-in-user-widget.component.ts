import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CurrentUser} from '@common/auth/current-user';
import {Settings} from '@common/core/config/settings.service';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'logged-in-user-widget',
    templateUrl: './logged-in-user-widget.component.html',
    styleUrls: ['./logged-in-user-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoggedInUserWidgetComponent  {
    @Input() hideRegisterButton = false;
    environment:any=environment;
    constructor(
        public currentUser: CurrentUser,
        public config: Settings,
        public breakpoints: BreakpointsService,
    ) {}
    public artistImage(image){
        return this.environment.image_base_url+image;
    }
}
