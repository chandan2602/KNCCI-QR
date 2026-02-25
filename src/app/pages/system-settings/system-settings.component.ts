import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})
export class SystemSettingsComponent extends BaseComponent implements OnInit {
  
  settings: any = {
    subscriptionEnabled: false
  };

  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
  }

  ngOnInit(): void {
    if (!this.isSuperAdmin) {
      this.toastr.error('Access denied. Super Admin only.');
      this.back();
      return;
    }
    this.loadSettings();
  }

  loadSettings() {
    this.activeSpinner();
    this.CommonService.getCall('SystemSettings/GetSettings', '', false).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res?.status) {
          this.settings = res.data || { subscriptionEnabled: false };
        }
      },
      err => {
        this.deactivateSpinner();
        // If settings don't exist yet, use defaults
        this.settings = { subscriptionEnabled: false };
      }
    );
  }

  toggleSubscription() {
    const newStatus = !this.settings.subscriptionEnabled;
    const confirmMsg = newStatus 
      ? 'Are you sure you want to ENABLE the subscription feature?' 
      : 'Are you sure you want to DISABLE the subscription feature? Users will not be able to subscribe.';
    
    if (!confirm(confirmMsg)) {
      return;
    }

    this.activeSpinner();
    const payLoad = {
      settingKey: 'subscriptionEnabled',
      settingValue: newStatus,
      updatedBy: this.userId
    };

    this.CommonService.postCall('SystemSettings/UpdateSetting', payLoad).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res?.status) {
          this.settings.subscriptionEnabled = newStatus;
          this.toastr.success(`Subscription feature ${newStatus ? 'enabled' : 'disabled'} successfully`);
        } else {
          this.toastr.error(res?.message || 'Failed to update setting');
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.error('Error updating setting. Please try again.');
      }
    );
  }
}
