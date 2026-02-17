import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { WindowRefService } from '../../../app/services/window-ref.service';
import { dataDictionary } from '../../../app/dataDictionary';
import { CommonService, DateFrmts } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-posting-job-view',
  templateUrl: './posting-job-view.component.html',
  styleUrls: ['./posting-job-view.component.css']
})
export class PostingJobViewComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() parentId: any = 0;

  params: any = ''; isLogin: boolean = true; subscribeDetails: any = ''; jobApply: any = true;

  constructor(CommonService: CommonService, private winRef: WindowRefService, public fb: FormBuilder, public router: Router, private active: ActivatedRoute, toastr: ToastrService) {
    super(CommonService, toastr)
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['parentId']) {
      if(changes['parentId'].currentValue != '') {
        if(this.parentId != 0 && this.parentId != '') {
          this.jobApply = false, this.GetById(this.parentId)
        }
        
      }
    }
  }
  
  ngOnInit(): void {

  }

  GetById(iD: any) { // http://localhost:56608/api/InternshipJobs/JobGetById/job_id
    this.CommonService.activateSpinner();
    this.CommonService.getCall(`InternshipJobs/JobGetById/${iD}`, '', false).subscribe(
          (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.params = res.data[0];
          // this.BindData()
        } else {
          this.toastr.warning(res.message);
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Job relatd record not getting');
        // window.history.back()
      })
  }

  ApplyJob() {
    let params = this.params

    let today = new Date();
    let dateToCheck = new Date(this.subscribeDetails?.expired_date);

    // Remove time for accurate comparison
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);

    let isFutureDate: boolean = dateToCheck < today;
    if (this.subscribeDetails == '' || this.subscribeDetails == undefined || this.subscribeDetails ==  null || this.subscribeDetails == 'undefined' ) {
      this.toastr.info('Please Subscribe');
      this.router.navigate(['/HOME/subscribe']);
    } else if(this.subscribeDetails?.jobs_remaining == 0 || isFutureDate) {
      this.toastr.info('Subscription is Expired');
      this.router.navigate(['/HOME/subscribe']);
    } else {
      this.router.navigate(['HOME/applyJob'], {  queryParams: {jobId: params.job_id} })
    }
    // if (this.isLogin) {
    // } else 
    //   this.router.navigate(['/login'], { queryParams: {job_id: params.job_id} });
  }

}
