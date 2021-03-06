import {
  Component,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  OnChanges,
  OnInit
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { IosInstallComponent } from './ios-install/ios-install.component';
import { LilaComponent } from './lila/lila.component';
import { Router } from '@angular/router';
import {Location} from '@angular/common';


@Component({
  selector: 'vivai-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Vivai';
  landingPage = false;
  mobileQuery: MediaQueryList;
  nav = [
    {
      'title': 'Tableau de Bord',
      'icon': 'dashboard',
      'path': '/dashboard'
    },
    {
      'title': 'Paramètres',
      'icon': 'settings_applications',
      'path': '/settings'
    }
  ];
  private _mobileQueryListener: () => void;
  @Output() toggleSideNav = new EventEmitter();

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private toast: MatSnackBar, private dialog: MatDialog, public router: Router, private _location: Location) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    }
    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in (window as any).navigator) && ((window as any).navigator.standalone);

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode()) {
      this.toast.openFromComponent(IosInstallComponent, {
        duration: 8000,
        horizontalPosition: 'start',
        panelClass: ['mat-elevation-z3']
      });
    }
  }

  toggleMobileNav(nav: MatSidenav) {
    if (this.mobileQuery.matches) {
      nav.toggle();
    }
  }

  displayButtonLila() {
    let route = this.router.url; 
    if(route.includes("plant-page")) return true;
    if (window.innerWidth < 1025 && (route !== "/") && !route.includes("auth")) {
      return true;
    } else return false;

  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';

    this.dialog.open(LilaComponent, dialogConfig);

  }

  returnNav() {
    this._location.back();
  }
}
