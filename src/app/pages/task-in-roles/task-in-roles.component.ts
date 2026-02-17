import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';
@Component({
  selector: 'app-task-in-roles',
  templateUrl: './task-in-roles.component.html',
  styleUrls: ['./task-in-roles.component.css']
})
export class TaskInRolesComponent extends BaseComponent implements OnInit {
  roleId: string = ''
  table: Array<any> = [];
  table1: Array<any> = [];
  dataObj: any = {};
  roles: Array<any> = [];
  subscription: any = {};
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  constructor( CommonService: CommonService,  toastr: ToastrService) {
    super(CommonService,toastr);
    // this.getCourses();
   if(!this.isSuperAdmin) this.getRoles()
  }

  ngOnInit(): void {
  }

  get enableRight() {
    let filter = this.table.filter((item) => { return item.class });
    let check = filter.length || false;
    return !check
  }
  get enableLeft() {
    let filter = this.table1.filter((item) => { return item.class });
    let check = filter.length || false;
    return !check
  }

  getRoles() {
    this.activeSpinner();
    let payLoad = {
      TENANT_CODE: this.tId||this.TenantCode,
      "RoleName": "Admin",
    }
    this.CommonService.postCall('GetRolesByTenant', payLoad).subscribe(
      (res: any) => {
        this.roles = res.TenantBasdRoles;
        this.subscription = res.Subscription && res.Subscription[0]
        this.deactivateSpinner();
      }, err => {
        this.deactivateSpinner();
      }
    )
  }
  roleChange() {
    let payLoad = { "TENANT_CODE": this.TenantCode, "RoleId":this.roleId, "SubscriptionId": this.subscription.SUBSCRIPTIONID };
    this.activeSpinner();
    this.CommonService.postCall('GetAvaliableAndAssignedTask', payLoad).subscribe(
      (res: any) => {
        this.deactivateSpinner()
        this.table = res.AvaliableTasks;
        this.table1 = res.AssignedTasks;
      },e=>{
        this.deactivateSpinner();
      })

  }


  clearAll() {

    this.table1 = [];
    this.table = [];
    this.dataObj = {};
    // this.subscription={};
    this.roleId='';
    // this.courses=[];

  }

  clear() {

    this.table1 = [];
    this.table = [];
    this.dataObj = {}
  }

  checkRight(event: any, item: any, array: Array<any>) {
    if (event.ctrlKey) {
      item.class = item.class ? '' : 'item_checked'
    }
    else {
      array.map(item => {
        item.class = ''
      });
      item.class = 'item_checked'
    }
  }
  shiftLeft() {
    let filter = this.table1.filter((item) => { return item.class });
    this.table = this.table.concat(filter);
    filter.map(item => {
      let index = this.table1.findIndex(x => x.TASKID == item.TASKID);
      this.table1.splice(index, 1)
    })

    this.table.map(item => {
      item.class = ''
    });
  }
  shiftRight() {
    let filter = this.table.filter((item) => { return item.class });
    this.table1 = this.table1.concat(filter);
    filter.map(item => {
      let index = this.table.findIndex(x => x.TASKID == item.TASKID);
      this.table.splice(index, 1)
    })

    this.table1.map(item => {
      item.class = ''
    });
  }
  shiftAllLeft() {
    this.table = this.table.concat(this.table1);
    this.table1 = []
  }
  shiftAllRight() {
    this.table1 = this.table1.concat(this.table);
    this.table = []
  }

  submit() {
    if (!this.roleId) {
      this.toastr.warning('Please select the Role');
      return
    }
    if (!this.table1.length) {
      this.toastr.warning('Please add at least one assign item');
      return
    }
    let TaskIds = ''
    this.table1.map((item) => {
      if (!TaskIds) {
        TaskIds = item.TASKID;
      } else {
        TaskIds = TaskIds + ',' + item.TASKID
      }
    })
    this.activeSpinner()
    let payLoad = {
      TENANT_CODE: this.TenantCode,
      SubscriptionId: this.subscription.SUBSCRIPTIONID,
      TaskIds: TaskIds,
      RoleId: this.roleId,
      SubscriptionType: this.subscription.SUBSCRIPTIONTYPENAME,
      CREATEDBY:this.userId,
      LASTMDFBY:this.userId,
    }
    this.CommonService.postCall('SaveAssignTasks', payLoad).subscribe((res) => {
      this.toastr.success('Successfully assigned ');
      this.clearAll();
      this.deactivateSpinner();
    }, e => { this.toastr.error('error occured! Please try later') })

  }


  changeTname() {
    this.getRoles()
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
