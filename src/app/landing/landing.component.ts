import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/pages/base.component';
import { CommonService } from 'src/app/services/common.service';
import { constants } from 'src/app/constants';
import { environment } from 'src/environments/environment';
// import { Tooltip } from 'bootstrap';

declare var $: any;
// declare var bootstrap: any;


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})

export class LandingComponent extends BaseComponent implements OnInit {

  @Input() achivementsList: Array<{ count: number, usertype: string }> = []; testMonialsList: any[] = [];
  private readonly onDestroy = new Subscription(); currentYear = (new Date()).getFullYear();

  constructor(public rtr: Router,
    private rte: ActivatedRoute,
    CommonService: CommonService,
    toastr: ToastrService) {
    super(CommonService, toastr);
    this.getTestMonials();
  }
  ngOnInit(): void {
    this.getTestMonials();
    this.getAchivements();
  }

    tooltipContent = `
  <strong>1. Job Seeker</strong><br>
  Create your profile to explore job and internship opportunities tailored to your skills and interests.<br><br>
  <strong>2. Company</strong><br>
  Register your company to post job openings, manage applications, and connect with top talent.<br><br>
  <strong>3. Founder</strong><br>
  Sign up to showcase your startup, seek visibility, and connect with investors or incubators.<br><br>
  <strong>4. Incubator</strong><br>
  Register as an incubator to discover and support promising startups with mentorship and resources.<br><br>
  <strong>5. Investor</strong><br>
  Sign up to explore investment-ready startups and access detailed business insights.
`;

  // ngAfterViewInit(): void {
  //   const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  //   tooltipTriggerList.forEach(el => new Tooltip(el));
  // }

  isSS(t: string): boolean {
    return ((t == 'd') ? location.href.includes('/default') : ((t == 'a') ? location.href.includes('/about') : ((t == 'j') ? location.
      href.includes('/job') : ((t == 'i') ? location.href.includes('/internship') : ((t == 'c') ? location.href.includes('/corporate') :
        ((t == 'p') ? location.href.includes('/contacts') : false))))));
  }

  getAchivements() {
    this.achivementsList = [];
    const ob1$ = this.CommonService.getCall('Courses/Achivements').subscribe((res: any) => {
      this.achivementsList = res;
    })
  }

  getCount(usertype: string): number {
    const count: number = this.achivementsList.find(e => e.usertype == usertype)?.count || 0;
    return count;
  }

  getTestMonials() {
    this.testMonialsList = [
      {
        id: 1,
        name: '— Faith N., BSc Computer Science Now working at: TujengeTech Solutions',
        image: '../../../../assets/img/aboutus-img.png',
        description: 'My internship at a Nairobi-based startup helped me discover my passion for product design. I never imagined I’d contribute to something used by thousands. This platform changed everything for me.',
        name1: '',
        designation: '',
      },
      {
        id: 2,
        name: '— Daniel K., BA Communication & Media Now working at: Brand Republic Africa',
        image: '../../../../assets/img/about-img.png',
        description: 'As a first-year student, I thought internships were out of reach. But the portal connected me to a marketing firm that gave me real client work — and a full-time offer.',
        name1: '',
        designation: '',
      },
      {
        id: 2,
        name: '— Joy W., BBA Human Resource Management Now working at: Peoplewise Consulting',
        image: '../../../../assets/img/about-img.png',
        description: 'The experience helped me build confidence, work with professionals, and understand how HR operates in the real world. It wasn’t just an internship — it was growth.”',
        name1: '',
        designation: '',
      },
    ];
    // this.testMonialsList = monials;
  }

  NavigateTo() {
    const URL = "/signup";
    this.rtr.navigate([URL]);
  }

  signUPLogin(evnt: any) {
    if (evnt == 3) {
      this.rtr.navigate(['startsUpReg']);
      $('#cls').click();
    } else if (evnt == 4) {
      this.rtr.navigate(['incubatorReg']);
      $('#cls').click();
    } else if (evnt == 5) {
      this.rtr.navigate(['investorReg']);
      $('#cls').click();
    } else {
      // if(evnt == 1 || evnt == 2) {
      this.rtr.navigate(['/signup'], { queryParams: { type: evnt == 1 ? 'company' : 'jobSeeker' } });

      $('#cls').click();
      // } else 
    }
  }

  ApplyNow() {
    this.rtr.navigate(['/signup'], { queryParams: { type: 'jobSeeker' } });
  }
}

interface TMonials {
  id: number;
  name: string;
  image: string;
  description: string;
  name1: string;
  designation: string;
}

interface MSlider {
  id: number;
  image: string;
  name: string;
  description: string;
  name1: string;
}