import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/pages/base.component';
import { CommonService } from 'src/app/services/common.service';
import { constants } from 'src/app/constants';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-landing-corporate',
  templateUrl: './landing-corporate.component.html',
  styleUrls: ['./landing-corporate.component.css']
})

export class LandingCorporateComponent extends BaseComponent implements OnInit {

  startUpList: any[] = []; editData: any = ''; isShow: boolean = false;

  constructor(public rtr: Router,
    private rte: ActivatedRoute,
    CommonService: CommonService,
    toastr: ToastrService) {
    super(CommonService, toastr);
   
  }

  ngOnInit(): void {
    this.LoadGrid();
  }

  LoadGrid() { // api/Registration/GetMyApprovedStartUpList
    this.CommonService.activateSpinner();
    this.startUpList = [];
    this.CommonService.getCall('Registration/GetMyApprovedStartUpList', '').subscribe((res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.startUpList = res.data;
        } else {
          this.deactivateSpinner();
          this.toastr.warning(res.message);
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Record not getting');
        // window.history.back()
      })
  }

  isShw(): boolean {
    return !location.href.includes('/default');
  }

}