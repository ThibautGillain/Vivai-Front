import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/loader/loader.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PlantService } from 'src/app/services/plant.service';
import { UserPlant } from 'src/app/models/user-plant';
import { InfosPlant } from 'src/app/models/infos-plant';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'vivai-plant-page',
  templateUrl: './plant-page.component.html',
  styleUrls: ['./plant-page.component.scss']
})
export class PlantPageComponent implements OnInit {
  display: Boolean = false;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  currentPlant: UserPlant =  null;
  infoCurrentPlant: InfosPlant = null;
  public reportingForm: FormGroup;
  taskNumber: 0;

  constructor(public _loading: LoaderService,iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer, media: MediaMatcher, changeDetectorRef: ChangeDetectorRef,
    private router: Router, private fb: FormBuilder, private _plantService: PlantService,
    private _notification: NotificationService,
    ) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);

      iconRegistry.addSvgIcon(
        'water',
        sanitizer.bypassSecurityTrustResourceUrl('assets/svg/water.svg'));
      iconRegistry.addSvgIcon(
        'prune',
        sanitizer.bypassSecurityTrustResourceUrl('assets/svg/prune.svg'));
      iconRegistry.addSvgIcon(
        'harvest',
        sanitizer.bypassSecurityTrustResourceUrl('assets/svg/harvest.svg'));
      iconRegistry.addSvgIcon(
        'repoting',
        sanitizer.bypassSecurityTrustResourceUrl('assets/svg/repoting.svg'));
    }

  ngOnInit() {
    this.catchPlantFromHistory();
    this.initForm();
    this.getInfoPlant();
  }

  getInfoPlant() {
    if (this.display) {
      this._plantService.getPlantInfos(this.currentPlant.plantId).subscribe(data =>
      this.infoCurrentPlant = data);
    }
  }


  initForm() {
    this.reportingForm = this.fb.group({
      water: [false],
      prune: [false],
      repoting: [false],
      harvest: [false]
    });
    this.taskNumber = 0;
  }


  catchPlantFromHistory() {
    this.currentPlant = history.state.data;
    if(this.currentPlant == undefined) {
      this.router.navigate(['/dashboard']);
    }else this.display = true;

    console.log(this.currentPlant);
  }

  checkTaskNumber() {
    this.taskNumber = 0;
    setTimeout(() => {
    if (this.reportingForm.get('water').value) {
      this.taskNumber++;
    }
    if (this.reportingForm.get('prune').value) {
      this.taskNumber++;
    }
    if (this.reportingForm.get('repoting').value) {
      this.taskNumber++;
    }
    if (this.reportingForm.get('harvest').value) {
      this.taskNumber++;
    }
  });
}

share() {

}

delete() {
  this._plantService.deleteUserPlant(this.currentPlant.id).subscribe(data => {
    console.log(data);
    this._notification.show(data.Message, "OK");
    this.router.navigate(['/dashboard']);
  }
    )
}

}