import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-master-assessment',
  templateUrl: './master-assessment.component.html',
  styleUrls: ['./master-assessment.component.css']
})
export class MasterAssessmentComponent extends BaseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  constructor(  CommonService: CommonService, private route:Router,toastr:ToastrService) {
    super(CommonService,toastr)
    this.load()
  }

  ngOnInit(): void {
    // this.getCourses();
   
  }
 
 
  activeSpinner(){
    this.CommonService.activateSpinner();
  }

  deactivateSpinner(){
    this.CommonService.deactivateSpinner()
  }
  load() {
    this.activeSpinner();
    let payLoad: any = {
      TENANT_CODE: sessionStorage.getItem('TenantCode'),
      RoleID:sessionStorage.getItem('RoleId'),
      "COURSETRAINERID":sessionStorage.getItem('UserId'),
      "ASSESSMENT_MODE":"1"

    }
    this.CommonService.postCall('LoadMasterAssessment', payLoad).subscribe((res: any) => {
      this.table=[];
      this.table=res;
      this.renderDataTable();
      this.deactivateSpinner();
    },e=>{this.deactivateSpinner()})
  }

  add() {
   this.route.navigate(['HOME/masterAssessment/add'])
  }
  
   edit(id){
    this.route.navigate(['HOME/masterAssessment/edit'],{queryParams:{mId:id}})
   }
   changeTname() {
    this.load()
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}
