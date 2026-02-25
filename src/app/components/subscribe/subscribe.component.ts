import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService, DateFrmts } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';
declare const $: any;
@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent extends BaseComponent implements OnInit, OnDestroy {

  dtF = DateFrmts; roleId: any = sessionStorage.getItem('RoleId');
  cardType: string = ''; fromDate: any = new Date(); toDate: any = new Date(); listData: any = []; rowData: any = '';
  silverAmt: number = 1000;
  goldAmt: number = 1500;
  platiumAmt: number = 2000;
  silverJobs: number = 10;
  goldJobs: number = 20;
  platiuJobs: number = 35;
  silverStartUps: number = 2;
  goldStartUps: number = 5;
  platiumStartUps: number = 10;
  subscriptionEnabled: boolean = false;
  private statusCheckInterval: any;
  	tooltipContent = `
					Choose a subscription plan (Silver, Gold, or Platinum) to unlock access to internships and job applications. Click on a plan card to proceed with payment. Once the payment is successful, you'll gain access to all features included in the selected plan.
					`;

  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
    // this.isAdmin = (+this.USERTYPE == 24);
    // this.active.queryParams.subscribe((res) => {
    //   if (Object.keys(res).length) {
    //     this.params = res;
    //     this.getAll();
    //   }
    // })
  }

  ngOnInit(): void {
    this.toDate.setDate(this.fromDate.getDate() + 30);
    this.checkSubscriptionStatus();
    
    // Check subscription status every 10 seconds
    this.statusCheckInterval = setInterval(() => {
      this.checkSubscriptionStatusSilently();
    }, 10000); // 10 seconds
  }

  ngOnDestroy(): void {
    // Clear interval when component is destroyed
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
  }

  checkSubscriptionStatusSilently() {
    // Check without showing spinner or toasts
    this.CommonService.getCall('SystemSettings/GetSettings', '', false).subscribe(
      (res: any) => {
        const previousStatus = this.subscriptionEnabled;
        if (res?.status && res.data) {
          this.subscriptionEnabled = res.data.subscriptionEnabled || false;
        } else {
          this.subscriptionEnabled = false;
        }
        
        // If status changed from enabled to disabled, clear the list and show warning
        if (previousStatus && !this.subscriptionEnabled) {
          this.listData = [];
          this.toastr.warning('Subscription feature has been disabled by administrator');
        }
        // If status changed from disabled to enabled, reload the list
        else if (!previousStatus && this.subscriptionEnabled) {
          this.GetList();
          this.toastr.success('Subscription feature has been enabled');
        }
      },
      err => {
        // Silently fail
      }
    );
  }

  checkSubscriptionStatus() {
    this.activeSpinner();
    this.CommonService.getCall('SystemSettings/GetSettings', '', false).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res?.status && res.data) {
          this.subscriptionEnabled = res.data.subscriptionEnabled || false;
        } else {
          this.subscriptionEnabled = false;
        }
        
        if (!this.subscriptionEnabled) {
          this.toastr.warning('Subscription feature is currently disabled by administrator');
        } else {
          this.GetList();
        }
      },
      err => {
        this.deactivateSpinner();
        // If API fails, assume disabled for safety
        this.subscriptionEnabled = false;
        this.toastr.warning('Unable to check subscription status. Feature is currently unavailable.');
      }
    );
  }

  GetList() { // http://localhost:56608/api/InternshipJobs/GetAllSubscriptionPackage
    this.listData = [];
    this.activeSpinner();
    this.CommonService.getCall('InternshipJobs/GetAllSubscriptionPackage', '', false).subscribe(
      (res: any) => {
        if (res?.status == true) {
          let studntSub: any[] = [], companySub: any[] = [];
          this.deactivateSpinner();
          if (res.data.length > 0) 
            res.data.forEach(e => {
              if(e.subscription_type == 'Student')
                studntSub.push(e)
              if(e.subscription_type == 'Company')
                companySub.push(e);
            });
            if(sessionStorage.getItem('RoleId') == '3') {
              this.listData = studntSub;
            } else {  
              this.listData = companySub;
            }
            // this.listData = res.data;
            
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

  Save() { // http://localhost:56608/api/InternshipJobs/InsertSubscriber
    if (!this.subscriptionEnabled) {
      this.toastr.error('Subscription feature is currently disabled');
      return;
    }
    
    this.activeSpinner();
    let payLoad: any = {
      user_id: sessionStorage.UserId,
      subscription_type_id: this.rowData?.subscription_type_id,
      expired_date: this.CommonService.setDtFrmt(new Date(this.toDate), this.dtF.ymd),
      jobs_count: this.rowData?.jobs_count,
      startups_count: this.rowData?.startups_count,
      internships_count: this.rowData?.internships_count
     }
    this.CommonService.postCall('InternshipJobs/InsertSubscriber', payLoad).subscribe(
      (res: any) => {
        if (res?.status == true) {         
            this.toastr.success(res.message);
            this.deactivateSpinner(), this.getSubscriptnData(), $('#cls').click();
        } else {
          this.toastr.warning(res.message);
          this.deactivateSpinner();
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Record not getting');
        $('#cls').click();
        window.history.back()
      })
  }

  getSubscriptnData() { // http://localhost:56608/api/InternshipJobs/GetSubscriberByUserId/12345
    let userId: any = sessionStorage.UserId;
    if(userId != undefined && userId != null && userId !='') {
      this.activeSpinner();
      this.CommonService.getCall(`InternshipJobs/GetSubscriberByUserId/${sessionStorage.UserId}`, '', false).subscribe(
        (res: any) => {
          if (res?.status == true) {
            this.deactivateSpinner();
            if(res?.data.length > 0) {
              // this.subscribeData = res?.data[0];
              sessionStorage.setItem('subscribeData', `${JSON.stringify(res?.data[0])}`);
            }
              
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

  GotoHome(ctrl: string = '') {
    // Check subscription status before opening modal
    if (!this.subscriptionEnabled) {
      this.toastr.error('Subscription feature is currently disabled. Cannot proceed with payment.');
      return;
    }
    
    this.cardType = ctrl;
    if(ctrl == 'Silver') {
      
    }
    if(ctrl == 'Gold') {

    }
    if(ctrl == 'Platinum') {

    }

    // if(sessionStorage.getItem('USERTYPE') == '24')
    //   this.router.navigate(['HOME/usersRegistrationList']);
    // else if (sessionStorage.getItem('USERTYPE') == '25')
    //   this.router.navigate(['HOME/trainer-dashboard']);
    // else if (sessionStorage.getItem('USERTYPE') == '27')
    //   this.router.navigate(['HOME/founder-dshbrd'])
    // else if (sessionStorage.getItem('USERTYPE') == '28')
    //   this.router.navigate(['HOME/incubator-dshbrd'])
    // else if (sessionStorage.getItem('USERTYPE') == '29')
    //   this.router.navigate(['HOME/investor-dshbrd'])
  }

  onPaymentClicked() {
    this.router.navigate(['HOME/intereShipList'])
  }

  close() {

  }

  showDisabledMessage() {
    this.toastr.error('Subscription feature is currently disabled. Cannot proceed with payment.');
  }

  handleSubscriptionClick(item: any) {
    if (!this.subscriptionEnabled) {
      this.showDisabledMessage();
      return;
    }
    this.rowData = item;
    this.GotoHome(item);
  }

}


