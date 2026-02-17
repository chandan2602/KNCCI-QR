import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-subscription-task',
  templateUrl: './subscription-task.component.html',
  styleUrls: ['./subscription-task.component.css']
})
export class SubscriptionTaskComponent extends BaseComponent implements OnInit {
  types:[]=[];
  table1: Array<any> = [];
  dataObj: any = {};
  SubscriptionId:string;
  constructor(CommonService: CommonService,  toastr: ToastrService) {
    super(CommonService,toastr);
    this.getSubscriptionTypes();
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
  getSubscriptionTypes(){
    this.activeSpinner();
    this.CommonService.getCall('SubscriptionTypes').subscribe(
      (res)=>{
        this.types=res;
        this.deactivateSpinner();
      },err=>{
        this.deactivateSpinner();
      }
    )
  }

  subscriptionChange(){
    let payLoad={
      SubscriptionId:this.SubscriptionId
    }
    this.CommonService.postCall('GetSubscriptionValues',payLoad).subscribe(
      (res)=>{
        this.deactivateSpinner();
        console.log(res);
        this.table=res.filter((item)=> item.TABLEVALUE==0);
        this.table1=res.filter((item)=> item.TABLEVALUE==1);

      },err=>{
        this.deactivateSpinner()
      }
    )
  }
  clearAll() {

    this.table1 = [];
    this.table = [];
    this.dataObj = {};
   
    this.SubscriptionId='';
  

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
    if (!this.SubscriptionId) {
      this.toastr.warning('Please select the Subscription');
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
      SubscriptionId: this.SubscriptionId,
      TaskIds: TaskIds,
      RoleId: this.roleId,
      SubscriptionType: this.SubscriptionId,
      CREATEDBY:this.userId,
      LASTMDFBY:this.userId,
    }
    this.CommonService.postCall('SubscriptionTasks/Post', payLoad).subscribe((res) => {
      this.toastr.success('Successfully assigned ');
      this.clearAll();
      this.deactivateSpinner();
    }, e => { this.toastr.error('error occured! Please try later') })

  }
}
