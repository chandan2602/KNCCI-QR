import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-offline-payment',
  templateUrl: './offline-payment.component.html',
  styleUrls: ['./offline-payment.component.css']
})
export class OfflinePaymentComponent implements OnInit {
  table: Array<any> = [];
  sId: string = '1';
  subscriptions: Array<any> = []
  constructor(private CommonService: CommonService, private toastr: ToastrService, private route: Router) {
    this.loadOfflinePayment();
  }

  ngOnInit(): void {
    this.getSubscription();
  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  loadOfflinePayment() {
    this.activeSpinner();
    this.CommonService.postCall('LoadOfflinePayment', { TenantType: this.sId }).subscribe(
      (res: any) => {
        this.table = [];
        setTimeout(() => { this.table = res }, 10);
        this.deactivateSpinner()
      }, err => {

      }
    )
  }
  getSubscription() {
    this.CommonService.postCall('GetSubscriptionType', {}).subscribe(
      (res: any) => {
        this.subscriptions = res;
      }, err => {
        console.log(err)
      }
    )
  }
  change() {
    this.loadOfflinePayment()
  }
  assign(item) {
    if (!item.SUBSCRIPTIONID) {
      this.toastr.warning('Please select Subscription type to assign');
      return
    }
    let params = {
      tCode: item.TNT_CODE,
      sId: item.SUBSCRIPTIONID,
    }
    this.route.navigate(['HOME/billingInformation'], { queryParams: params })
  }
  deActivate(item) {
    let c = confirm('Do you want to de-activate the tenant ?');
    if (c) {
      this.activeSpinner();
      this.CommonService.postCall('DeactivateSubscription', { TenantType: item.TENANTSUBSCRIPTIONID }).subscribe(
        (res: any) => {
          this.toastr.success(res.message);
          this.deactivateSpinner();
          this.loadOfflinePayment();
        }, err => {
          this.deactivateSpinner();
          this.toastr.error(err.error ? err.errror : 'error occured please try later');
        }
      )
    }
  }


}
