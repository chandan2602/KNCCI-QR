import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent extends BaseComponent implements OnInit {
  table: Array<any> = [];
  rId: string = '';
  roles: Array<any> = [];
  tId: string = '';
  roleId: any = sessionStorage.getItem('RoleId');
  USERTYPE: any = sessionStorage.getItem('USERTYPE');
  isAdmin: boolean = false;

  tenanates: Array<any> = [];
  UserRoleName: string;
  
  // Subscription management properties
  selectedUser: any = null;
  userSubscription: any = null;
  subscriptionPlans: Array<any> = [];
  newSubscription: any = {
    subscription_type_id: '',
    duration: 30
  };
  extendDays: number = 30;
  
  // Subscription toggle property
  subscriptionEnabled: boolean = false;
  tenantSubscriptionEnabled: boolean = false;
  constructor(public CommonService: CommonService, public toastr: ToastrService, private route: Router) {
    // this.getRoles();
    super(CommonService, toastr)
    const { company_id = 0 } = sessionStorage;
    // this.isAdmin = ((+company_id > 0) && (+this.USERTYPE == 24));
    this.isAdmin = (+this.USERTYPE == 24);
    if (this.roleId == '4') {
      this.getTennates();
    } else {
      this.getRoles();
    }
    this.rId = this.roleId;
    this.change();

    this.UserRoleName = (+sessionStorage.USERTYPE == 25) ? 'Tutor' : (+sessionStorage.USERTYPE == 24) ? 'Admin' : 'Trainee';
  }
  ngOnInit(): void {
    if (this.isSuperAdmin) {
      this.loadSubscriptionSettings();
    }
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  change() {
    this.activeSpinner();
    let tenantcode;
    if (this.roleId == '4') {
      tenantcode = this.tId || 0;
    } else {
      tenantcode = sessionStorage.getItem('TenantCode');
    }
    let payLoad = {
      "TenantCode": tenantcode,
      "objUserinrole": { "RoleId": this.rId || 0 }
    };

    const { UserId } = sessionStorage;
    this.CommonService.postCall('UserRolesChange', payLoad).subscribe(
      (res) => {
        this.table = [];
        setTimeout(() => {
          this.table = res;
          // this.table = this.table.filter(m => m.USERID == UserId);
        }, 10)
        this.deactivateSpinner();

      },
      err => {
        this.deactivateSpinner()
      })
  }
  changeTname() {
    this.getRoles();
    // Load tenant subscription status when tenant changes
    if (this.tId && this.isSuperAdmin) {
      this.loadTenantSubscriptionSettings();
    }
  }
  edit(item) {
    let id = item.USERID;
    this.activeSpinner();
    this.CommonService.postCall('EditRegistrationByUserId', { CREATEDBY: id }).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        this.route.navigate(['HOME/userRegistration'], { queryParams: { token: res.value } })
        //this.route.navigate(['HOME/editUserRegistration'], { queryParams: { token: res.value } })
      }, err => {
        this.deactivateSpinner();
      }
    )

  }


  getRoles() {
    this.activeSpinner();
    this.CommonService.postCall('GetRolesByTenantCode', { TENANT_CODE: this.tId || sessionStorage.getItem('TenantCode') }).subscribe(
      (res: any) => {
        this.roles = res.filter(e => e.ROLE_ID != 3);
        // && e.ROLE_ID != 1
        this.deactivateSpinner();
      }, error => {
        this.deactivateSpinner();
      }
    )
  }
  getTennates() {
    this.activeSpinner();
    this.CommonService.postCall('GetTenantByRoleId', { RoleId: this.roleId }).subscribe(
      (res) => {
        this.tenanates = res;
        this.deactivateSpinner()
      }, err => {
        this.deactivateSpinner()
      }
    )
  }

  add() {
    let payLoad = {
      TENANT_CODE: this.tId || sessionStorage.getItem('TenantCode'),
      CREATEDBY: sessionStorage.getItem('UserId'),
      RoleId: this.rId
    }
    this.activeSpinner();
    this.CommonService.postCall('AddRegistration', payLoad).subscribe(
      (res) => {
        this.deactivateSpinner();
        let params = {
          tcode: this.tId || this.TenantCode,
          uType: res.UserType,
          rId: res.RoleId,
          token: res.VerificationToken && res.VerificationToken[0]
        }
        this.route.navigate(['/HOME/addUserRegistration'], { queryParams: params })
      }, err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error)
      })
  }

  // Subscription Management Methods
  loadSubscriptionSettings() {
    this.activeSpinner();
    this.CommonService.getCall('SystemSettings/GetSettings', '', false).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res?.status && res.data) {
          this.subscriptionEnabled = res.data.subscriptionEnabled || false;
        }
      },
      err => {
        this.deactivateSpinner();
        this.subscriptionEnabled = false;
      }
    );
  }

  loadTenantSubscriptionSettings() {
    if (!this.tId) return;
    
    this.activeSpinner();
    this.CommonService.getCall(`SystemSettings/GetTenantSubscriptionStatus/${this.tId}`, '', false).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res?.status) {
          this.tenantSubscriptionEnabled = res.data?.subscriptionEnabled || false;
        }
      },
      err => {
        this.deactivateSpinner();
        this.tenantSubscriptionEnabled = false;
      }
    );
  }

  toggleGlobalSubscription() {
    const newStatus = !this.subscriptionEnabled;
    const confirmMsg = newStatus 
      ? 'Are you sure you want to ENABLE the subscription feature globally? All tenants will be able to use subscriptions.' 
      : 'Are you sure you want to DISABLE the subscription feature globally? No tenant will be able to use subscriptions.';
    
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
          this.subscriptionEnabled = newStatus;
          this.toastr.success(`Global subscription feature ${newStatus ? 'enabled' : 'disabled'} successfully`);
          
          // If disabling globally, also disable tenant subscription
          if (!newStatus) {
            this.tenantSubscriptionEnabled = false;
          }
        } else {
          this.toastr.error(res?.message || 'Failed to update setting');
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.error('Error updating subscription setting');
      }
    );
  }

  toggleTenantSubscription() {
    if (!this.subscriptionEnabled) {
      this.toastr.warning('Please enable global subscription first');
      return;
    }

    if (!this.tId) {
      this.toastr.warning('Please select a tenant first');
      return;
    }

    const newStatus = !this.tenantSubscriptionEnabled;
    const tenantName = this.getSelectedTenantName();
    const confirmMsg = newStatus 
      ? `Are you sure you want to ENABLE subscription for "${tenantName}" tenant? All users in this tenant will be able to use subscriptions.` 
      : `Are you sure you want to DISABLE subscription for "${tenantName}" tenant? All users in this tenant will lose access to subscriptions.`;
    
    if (!confirm(confirmMsg)) {
      return;
    }

    this.activeSpinner();
    const payLoad = {
      tenantCode: this.tId,
      subscriptionEnabled: newStatus,
      updatedBy: this.userId
    };

    this.CommonService.postCall('SystemSettings/UpdateTenantSubscription', payLoad).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res?.status) {
          this.tenantSubscriptionEnabled = newStatus;
          this.toastr.success(`Subscription ${newStatus ? 'enabled' : 'disabled'} for ${tenantName} tenant`);
        } else {
          this.toastr.error(res?.message || 'Failed to update tenant subscription');
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.error('Error updating tenant subscription setting');
      }
    );
  }

  getSelectedTenantName(): string {
    if (!this.tId || !this.tenanates.length) return '';
    const tenant = this.tenanates.find(t => t.TNT_CODE === this.tId);
    return tenant ? tenant.TNT_NAME : '';
  }

  toggleSubscription() {
    // Deprecated - use toggleGlobalSubscription instead
    this.toggleGlobalSubscription();
  }

  manageSubscription(user: any) {
    this.selectedUser = user;
    this.loadUserSubscription(user.USERID);
    this.loadSubscriptionPlans();
    // Open modal using Bootstrap 5
    const modalElement = document.getElementById('subscriptionModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  loadUserSubscription(userId: string) {
    this.activeSpinner();
    this.CommonService.getCall(`InternshipJobs/GetSubscriberByUserId/${userId}`, '', false).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res?.status && res.data && res.data.length > 0) {
          this.userSubscription = res.data[0];
        } else {
          this.userSubscription = null;
        }
      },
      err => {
        this.deactivateSpinner();
        this.userSubscription = null;
        this.toastr.warning('Could not load subscription details');
      }
    );
  }

  loadSubscriptionPlans() {
    this.activeSpinner();
    this.CommonService.getCall('InternshipJobs/GetAllSubscriptionPackage', '', false).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res?.status && res.data) {
          this.subscriptionPlans = res.data;
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning('Could not load subscription plans');
      }
    );
  }

  assignSubscription() {
    if (!this.newSubscription.subscription_type_id) {
      this.toastr.warning('Please select a subscription plan');
      return;
    }

    if (!this.newSubscription.duration || this.newSubscription.duration < 1) {
      this.toastr.warning('Please enter a valid duration');
      return;
    }

    const selectedPlan = this.subscriptionPlans.find(p => p.subscription_type_id == this.newSubscription.subscription_type_id);
    if (!selectedPlan) {
      this.toastr.error('Invalid subscription plan');
      return;
    }

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(startDate.getDate() + this.newSubscription.duration);

    const payLoad = {
      user_id: this.selectedUser.USERID,
      subscription_type_id: this.newSubscription.subscription_type_id,
      start_date: this.formatDate(startDate),
      expired_date: this.formatDate(expiryDate),
      jobs_count: selectedPlan.jobs_count,
      internships_count: selectedPlan.internships_count,
      startups_count: selectedPlan.startups_count,
      assigned_by: sessionStorage.getItem('UserId')
    };

    this.activeSpinner();
    this.CommonService.postCall('InternshipJobs/InsertSubscriber', payLoad).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res?.status) {
          this.toastr.success('Subscription assigned successfully');
          this.loadUserSubscription(this.selectedUser.USERID);
          this.newSubscription = { subscription_type_id: '', duration: 30 };
        } else {
          this.toastr.error(res?.message || 'Failed to assign subscription');
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.error('Error assigning subscription');
      }
    );
  }

  extendSubscription() {
    if (!this.extendDays || this.extendDays < 1) {
      this.toastr.warning('Please enter valid number of days');
      return;
    }

    const currentExpiry = new Date(this.userSubscription.expired_date);
    const newExpiry = new Date(currentExpiry);
    newExpiry.setDate(currentExpiry.getDate() + this.extendDays);

    const payLoad = {
      subscriber_id: this.userSubscription.subscriber_id,
      expired_date: this.formatDate(newExpiry),
      extended_by: sessionStorage.getItem('UserId')
    };

    this.activeSpinner();
    this.CommonService.postCall('InternshipJobs/ExtendSubscription', payLoad).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res?.status) {
          this.toastr.success(`Subscription extended by ${this.extendDays} days`);
          this.loadUserSubscription(this.selectedUser.USERID);
          this.extendDays = 30;
        } else {
          this.toastr.error(res?.message || 'Failed to extend subscription');
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.error('Error extending subscription');
      }
    );
  }

  cancelSubscription() {
    if (!confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
      return;
    }

    const payLoad = {
      subscriber_id: this.userSubscription.subscriber_id,
      cancelled_by: sessionStorage.getItem('UserId')
    };

    this.activeSpinner();
    this.CommonService.postCall('InternshipJobs/CancelSubscription', payLoad).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res?.status) {
          this.toastr.success('Subscription cancelled successfully');
          this.loadUserSubscription(this.selectedUser.USERID);
        } else {
          this.toastr.error(res?.message || 'Failed to cancel subscription');
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.error('Error cancelling subscription');
      }
    );
  }

  closeSubscriptionModal() {
    this.selectedUser = null;
    this.userSubscription = null;
    this.newSubscription = { subscription_type_id: '', duration: 30 };
    this.extendDays = 30;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
