import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../environments/environment';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Lmsapp';
  constructor(private route: Router, private spinner: NgxSpinnerService, private commonService: CommonService) {
    commonService.appComponent = this;

  }


  ngOnInit(): void {
  }

  activateSpinner() {
    this.spinner.show();
  }
  deactivateSpinner() {
    this.spinner.hide();
  }

  @HostListener('window:beforeunload', ['$event'])
  resetAdsOnRefresh(event: Event) {
    localStorage.adsShown = false; // Reset on refresh
  }


  getCompanyDetails() {
    sessionStorage.isDomain = false;
    const { fileUrl } = environment;
    let { hostname } = location;
    ['localhost'].includes(hostname) ? hostname = "oukinternship.dhanushinfotech.com" : hostname;
    // hostname  = 'rfrf.shiksion.com';
    // host = "uma.shiksion.com";

    // if (["shiksionqa.samvaadpro.com", "localhost", "shiksion.com"].includes(host))
    // if (["localhost", "shiksion.com", "oukinternship.dhanushinfotech.com"].includes(hostname))
    //   return;
    this.commonService.getCall(`account/IsSubDomainExists/${hostname}`).subscribe((res: any) => {
      if (res.data == true) {
        this.commonService.getCall(`account/GetCompanyDetails/${hostname}`).subscribe((res: any) => {
          if (res.data.length > 0) {
            sessionStorage.isDomain = true;
            sessionStorage.company_id = res.data[0].company_id;
            if (res.data[0].cerficateimage_path)
              sessionStorage.cerficateimage_path = res.data[0].cerficateimage_path;
            if (res.data[0].favicon_path)
              sessionStorage.favicon_path = res.data[0].favicon_path;
            if (res.data[0].homepageimage_path)
              sessionStorage.homepageimage_path = res.data[0].homepageimage_path;
            if (res.data[0].landingpageimage_path)
              sessionStorage.landingpageimage_path = res.data[0].landingpageimage_path;
            if (sessionStorage.favicon_path) {
              document.getElementById("appFavcon")?.setAttribute("href", `${fileUrl}${res.data[0].favicon_path}`);
            }
            // document.getElementById("homepageimage_path")
            console.log("AppComponent");

          }
        });
      }

    });



  }


}
