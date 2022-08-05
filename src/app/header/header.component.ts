import { Component, OnInit, ChangeDetectionStrategy,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUser } from '@common/auth/current-user';
import { Settings } from '@common/core/config/settings.service';
import { ThemeService } from '@common/core/theme.service';
import { Localizations } from '@common/core/translations/localizations.service';
import { LocalizationWithLines } from '@common/core/types/localization-with-lines';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Translations } from '@common/core/translations/translations.service';
import { Toast } from '@common/core/ui/toast.service';
import { AuthService } from '@common/auth/auth.service';
import { HttpErrors } from '@common/core/http/errors/http-errors.enum';
import { Player } from 'src/app/web-player/player/player.service';
import { map } from 'rxjs/operators';
declare var $: any;
interface TranslationLine {
  key: string;
  translation: string;
}
@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @Output() onChangeFooterLines:EventEmitter<any> = new EventEmitter<any>();
  @Output() hasAdmin:EventEmitter<any> = new EventEmitter<any>();
  public selectedLocalization: LocalizationWithLines;
  public localizations$ = new BehaviorSubject<LocalizationWithLines[]>([]);
  public lines$ = new BehaviorSubject<TranslationLine[]>([]);
  public apiUrl: any;
  logIn:any="Log in";
  home:any="Home";
  account:any="Account";
  playlists:any="Playlists";
  logout:any="Logout";
  library:any="Library";
  support:any="support";
  navbarOpen = false;
  constructor(public theme: ThemeService, public config: Settings, public user: CurrentUser,
    public router: Router, private localizationsApi: Localizations, private settings: Settings,
    private toast: Toast, private i18n: Translations, public auth: AuthService,
    public player: Player,) {
    this.apiUrl = auth.getApiUrl();
    
  }
  
  ngOnInit(): void {
    this.localizationsApi.all()
      .subscribe(response => {
        // console.log(response.localizations)
        this.setLocalizations(response.localizations);
      });
      
      this.settings.isUser$.subscribe(res=>{
        this.isAdminUser();
        if(res==true){
          this.router.navigateByUrl('/web/dashboard');
        }
        this.isLabelUser();
      })
  }
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  private setLocalizations(localizations: LocalizationWithLines[]) {
    this.localizations$.next(localizations);
    const active = this.i18n.localization || localizations[0];
    if (active) {
      this.setSelectedLocalization(active);
    }
  }
  public setSelectedLocalization(localization: LocalizationWithLines) {
    if (this.selectedLocalization?.model.id === localization.model.id) return;

    this.selectedLocalization = localization;
    // this.setDefaultLocalization(this.selectedLocalization);
    //   if lang lines are already fetched for this localization, bail
    if (localization.lines) {
      this.lines$.next(this.originalLines());
      this.i18n.setLocalization(this.selectedLocalization);
    } else {
      this.selectedLocalization.lines = {};
      this.localizationsApi.get(this.selectedLocalization.model.name)
        .subscribe(response => {
          this.selectedLocalization = response.localization;
          this.i18n.setLocalization(this.selectedLocalization);
          const localizations = [...this.localizations$.value];
          const i = localizations.findIndex(loc => loc.model.id === localization.model.id);
          localizations[i] = response.localization;
          this.localizations$.next(localizations);
          let index=this.originalLines().findIndex(res=>res.key=='log in');
          this.lines$.next(this.originalLines());
        });
    }
    
  }
  public setDefaultLocalization(localization: LocalizationWithLines) {
    if ( ! this.selectedLocalization.model.id) {
        this.setSelectedLocalization(localization);
    }
    this.localizationsApi.setDefault(localization.model).subscribe(() => {
        // this.toast.open('Default Localization Changed');
    }, () => {
        this.toast.open(HttpErrors.Default);
    });
 }
  private linesToArray(lines: { [key: string]: string }): TranslationLine[] {
    console.log("header",lines);
    const transformed = [];
    const liness={
      company:'',
      policy:'',
      follow:'',
      about:'',
      faq:'',
      contact:'',
      privacy:'',
      terms:'',
      refund:'',
      copyrights:''
  };
    for (const key in lines) {
      if(key=='log in'){
        this.logIn=lines[key];
      }
      if(key=='home'){
        this.home=lines[key];
      }
      if(key=='account'){
        this.account=lines[key];
      }
      if(key=='playlists'){
        this.playlists=lines[key];
      }
      if(key=='logout'){
        this.logout=lines[key];
      }
      if(key=='library'){
        this.library=lines[key];
      }
      if(key=='support'){
        this.support=lines[key];
      }
      if((key=='Company') || (key=='company')){
        liness.company=lines[key];
      }
      if(key=='policy'){
        liness.policy=lines[key];
      }
      if(key=='follow us'){
        liness.follow=lines[key];
      }
      if(key=='about us'){
        liness.about=lines[key];
      }
      if(key=='faqs'){
        liness.faq=lines[key];
      }
      if(key=='contact us'){
        liness.contact=lines[key];
      }
      if(key=='privacy policy'){
        liness.privacy=lines[key];
      }
      if(key=='terms of service'){
        liness.terms=lines[key];
      }
      if(key=='refund policy'){
        liness.refund=lines[key];
      }
      if((key=='Copyrights') || (key=='copyrights')){
        liness.copyrights=lines[key];
      }    
      transformed.push({ key, translation: lines[key] });
    }
    this.onChangeFooterLines.emit(liness);
    return transformed;
  }
  private originalLines() {
    this.i18n.lines=this.selectedLocalization.lines ?
    this.linesToArray(this.selectedLocalization.lines) :
    [];
    
    return this.i18n.lines;
  }
  isLabelUser(){
    return this.user.hasRole('label')
  }
  isAdminUser(){
    this.hasAdmin.emit(this.user.hasRole('admin'));
    return this.user.hasRole('admin')
  }
  showMenus() {
    return ((location.pathname !== '/complete-profile') && (location.pathname !== '/plans') && ((this.router.url !== '/complete-profile') && (this.router.url !== '/plans')))
  }
}
