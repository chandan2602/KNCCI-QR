import { Component, OnInit } from '@angular/core';
import { CommonService } from './../../services/common.service'
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as moment from 'moment'
import { ToastrService } from 'ngx-toastr';
declare var $: any

@Component({
  selector: 'app-fee-description',
  templateUrl: './fee-description.component.html',
  styleUrls: ['./fee-description.component.css']
})
export class FeeDescriptionComponent implements OnInit {
  table : []=[];
  yearId : string | number = '';
  academicYear:[] = [];
  data: any = {};
  TenantCode: any;
  isParam:boolean=false;

  


  constructor(private CommonService: CommonService, active: ActivatedRoute, private sanitizer: DomSanitizer, private toastr: ToastrService,private route: Router) {

   this.getAcademicYear()
  }

  ngOnInit(): void {
  } 

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  getAcademicYear(){
    this.activeSpinner();
      this.CommonService.getCall('Academic/GetAcademicDropDownList/'+sessionStorage.getItem('TenantCode')).subscribe((res: any) => {
       //this.CommonService.getCall('Academic/GetAcademicDropDownList/71258324').subscribe((res: any) => { 
    this.deactivateSpinner();
    this.table = res
  },e=>{      this.deactivateSpinner();})
    
  }


  yearChange(event){
    this.activeSpinner();
    let payLoad = {
      ACADEMIC_ID : this.yearId,
      tnt_code: 71258324,
    }
    this.CommonService.getCall('FeeDescription/GetFeeDescriptionList/'+event.target.value).subscribe((res: any) => {
          this.deactivateSpinner();
      this.academicYear = res;
      
      // this.init()
    }, (e) => { this.deactivateSpinner(); })

  }

  selectYear(id, index){

  }

  onEdit(feedescription_curriculum_id , flag){
    
    this.route.navigate(['/HOME/editFees/'],{ queryParams: { dId: feedescription_curriculum_id , flag:flag} })

  }

 

}
