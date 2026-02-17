import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-createpol',
  templateUrl: './createpol.component.html',
  styleUrls: ['./createpol.component.css']
})
export class CreatepolComponent extends BaseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  constructor(private route: Router,  CommonService: CommonService, toastr: ToastrService) {
   super(CommonService,toastr)
    this.getPolls();
  }

  ngOnInit(): void {
  }
  

  add() {
    this.route.navigate(['/HOME/addPoll'])
  }
  edit(item) {
    let params = {
      edit: item.PollID,
    }
    this.route.navigate(['/HOME/addPoll'], { queryParams: params });
  }
 
  delete(data){
    let params={
        "PollId":data.PollID 
    }
    var c=confirm("Are you sure, you want to delete record?")
    if(c){
       this.CommonService.postCall('deletepoll',params).subscribe((res)=>{
         this.toastr.success("poll deleted Successfully");
         this.getPolls()
       },err=>{})
    }else{

    }
  }

  getPolls() {
    this.activeSpinner();
    let data = {
      TENANT_CODE:this.tId|| this.TenantCode,
      IsTrainer: false,
      UserId: sessionStorage.getItem('UserId'),
    }
    this.CommonService.postCall('loadpoll', data).subscribe(res => {
      this.table = res;
      this.renderDataTable();
      this.deactivateSpinner()
    }, err => {
     this.deactivateSpinner();
    })
  }
  changeTname(){
    this.getPolls()
  }
  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }
}
