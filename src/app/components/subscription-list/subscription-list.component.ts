import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent extends BaseComponent implements OnInit {

  roleId: any = sessionStorage.getItem('RoleId');
  USERTYPE: any = sessionStorage.getItem('USERTYPE');
  isAdmin: boolean = false; listGrid: any[] = [];
  	tooltipContent = `
					View all your subscription-related payment details, including subscription type, invoice, date, and amount. You can download invoices anytime using the<strong> Invoice</strong> button.
					`;

  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
    this.isAdmin = (+this.USERTYPE == 24);
  }

  ngOnInit(): void {
    this.LoadGrid()
  }

  LoadGrid() { // InternshipJobs/GetSubscribtionHistoryUserId
    this.CommonService.activateSpinner();
    this.CommonService.getCall(`InternshipJobs/GetSubscribtionHistoryUserId/${sessionStorage.UserId}`, '', false).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.listGrid = res.data;
        } else {
          this.toastr.warning(res.message);
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Records not getting');
        // window.history.back()
      })
  }

}
