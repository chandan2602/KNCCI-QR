import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';
import { DataTableDirective } from 'angular-datatables';
@Component({
  selector: 'app-createsurvey',
  templateUrl: './createsurvey.component.html',
  styleUrls: ['./createsurvey.component.css']
})
export class CreatesurveyComponent extends BaseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  constructor(private route: Router, CommonService: CommonService, toastr: ToastrService) {
    super(CommonService,toastr);
    this.getSurvey()
  }

  ngOnInit(): void {
  }
   
  add() {
    this.route.navigate(['/HOME/addSurvey'])

  }
  // surveyQuestion
  addQuestion(item) {
    let params={
      id:item.SURVEYID,
    }
    this.route.navigate(['/HOME/surveyQuestion'],{queryParams:params})
  }

  getSurvey() {
    this.activeSpinner();
    let data = {
      TENANT_CODE: this.tId||this.TenantCode,
      UserId:this.userId
    }
    this.CommonService.postCall('loadSurvey', data).subscribe(res => {
      this.table = res;
      this.renderDataTable();
      this.deactivateSpinner()
    }, err => {
      this.deactivateSpinner()
    })
  }
  edit(data) {
     let params={
       edit:data.SURVEYID,
     }
     this.route.navigate(['/HOME/addSurvey'],{queryParams:params})
  }
  delete(data){
      var c=confirm("Are you sure, you want to delete record?");
      let payLoad={
        SurveyId:data.SURVEYID,
       
      }
      if(c){
        this.CommonService.postCall('deleteSurvey',payLoad).subscribe((res:any)=>{
             this.toastr.success(" Survey deleted Successfully");
             this.getSurvey()
        },err=>{
          console.log(err)
          this.toastr.error(err.error?err.error:'failure')
        })
      }
      else{
         
      }
  }
  publish(data){
    var c=confirm("Are you sure, you want to Publish the Survey?");
    let payLoad={
      SurveyId:data.SURVEYID,
      UserId:sessionStorage.getItem('UserId')
    }
    if(c){
      this.CommonService.postCall('PublishSurvey',payLoad).subscribe((res:any)=>{
           this.toastr.success("Survey published Successfully")
           this.getSurvey()
      },err=>{
        console.log(err)
      })
    }
    else{
        
    }
  }
  changeTname(){
    this.getSurvey()
  }
  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }
}
