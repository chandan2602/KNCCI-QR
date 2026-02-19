import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {

  subscribeData: any = '';
  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
    this.getSubscriptnData();
  }

  getSubscriptnData() { // http://localhost:56608/api/InternshipJobs/GetSubscriberByUserId/12345
    let userId: any = sessionStorage.UserId;
    if(userId != undefined && userId != null && userId !='') {
      this.activeSpinner();
      this.CommonService.getCall(`InternshipJobs/GetSubscriberByUserId/${sessionStorage.UserId}`, '', false).subscribe(
        (res: any) => {
          if (res?.status == true) {
            this.deactivateSpinner();
            this.subscribeData = res?.data[0];
            sessionStorage.setItem('subscribeData', `${JSON.stringify(res?.data[0])}`);
            // if (res.data.length > 0) 
  
          } else {
            this.toastr.success(res.message);
            this.deactivateSpinner();
          }
        },
        err => {
          this.deactivateSpinner();
          this.toastr.warning(err.error ? err.error.text || err.error : 'Records not getting');
          window.history.back()
        })
    }
  }

  ngOnInit(): void {
    window.scrollBy(0, 100);
  }

  ngAfterViewInit(): void {
    // Sidebar toggle code removed - no longer needed
  }



}
