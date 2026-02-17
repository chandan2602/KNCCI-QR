import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Toast, ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-feedback-results',
  templateUrl: './feedback-results.component.html',
  styleUrls: ['./feedback-results.component.css']
})
export class FeedbackResultsComponent extends BaseComponent implements OnInit {
  users:Array<any>=[];
  userId:string=''
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  constructor(  CommonService: CommonService,toastr:ToastrService ) {
    super(CommonService,toastr);
    this.loadUsers();
   }

  ngOnInit(): void {
  }

  loadUsers(){
    let payload={
      TENANT_CODE:this.tId||this.TenantCode
    }
    this.activeSpinner();
    this.CommonService.postCall('LoadUsers',payload).subscribe((res:any)=>{
      this.users=res;
      this.deactivateSpinner()
    },err=>{this.deactivateSpinner()})
  }
   
  userChange(){
    let payload={
      "EMP_ID":this.userId,
      "TENANT_CODE":sessionStorage.getItem('TenantCode')
    }
    this.activeSpinner()
    this.CommonService.postCall('LoadGrid',payload).subscribe((res:any)=>{
      this.table=res;
      this.deactivateSpinner();
    },e=>{
      this.deactivateSpinner();
    })
    
  }
  changeTname() {
    this.loadUsers()
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
