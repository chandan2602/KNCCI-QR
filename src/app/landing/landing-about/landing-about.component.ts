import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/pages/base.component';
import { CommonService } from 'src/app/services/common.service';
import { constants } from 'src/app/constants';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-landing-about',
  templateUrl: './landing-about.component.html',
  styleUrls: ['./landing-about.component.css']
})

export class LandingAboutComponent extends BaseComponent {

constructor(public rtr: Router,
    private rte: ActivatedRoute,
    CommonService: CommonService,
    toastr: ToastrService) {
    super(CommonService, toastr);
  }

   ApplyNow() {
      this.rtr.navigate(['/signup'], { queryParams: {type : 'jobSeeker'}});
  }

  isSS(t: string): boolean {
    return ((t == 'd') ? location.href.includes('/default') : ((t == 'a') ? location.href.includes('/about') : ((t == 'j') ? location.href.includes('/job') : ((t == 'i') ? location.href.includes('/internship') : ((t == 'c') ? location.href.includes('/corporate') : ((t == 'p') ? location.href.includes('/contacts') : false))))));
  }

}