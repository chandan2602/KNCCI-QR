import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-fees',
  templateUrl: './edit-fees.component.html',
  styleUrls: ['./edit-fees.component.css']
})
export class EditFeesComponent implements OnInit {
  table: any[];
  id:any;
  flag : any;
  myForm: UntypedFormGroup;
  editData: any;

  constructor (private fb: UntypedFormBuilder,private route: Router, private CommonService: CommonService, private toastr: ToastrService,private active: ActivatedRoute) {
    // this.load();
    active.queryParams.subscribe((res) => {
      if (res.dId && res.flag) {
        this.id = res.dId;
        this.flag=res.flag;
      }
    })
    this.onLoad()
   }

  ngOnInit(): void {
    
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  onLoad(){
    this.activeSpinner()
 
      this.CommonService.getCall(`FeeDescription/GetFeeDescriptionById/${this.id}/${sessionStorage.getItem('TenantCode')}`).subscribe((res: any) => {
        // this.CommonService.getCall(`FeeDescription/GetFeeDescriptionById/${this.id}/71258324`).subscribe((res: any) => {
        this.table = [];
        setTimeout(() => {
          this.table = res;
          //this.table.forEach(x=>x.feedescription_amount=100);
        }, 10)
        this.deactivateSpinner();
      }, e => {
      })
  }

  Update(){

    let item= this.table;
   
   
    this.CommonService.postCall('FeeDescription/SaveFeeDescription',item).subscribe((res: any) => {
      this.route.navigate(['/HOME/feesDescription/'])
      this.toastr.success("Fee Updated Succuessfully");
      document.getElementById('md_close').click();
    }, err => {
      this.toastr.error(err.error ? err.error : 'Class Not Updated')
      this.deactivateSpinner();
    })


}

cancel(){

  this.route.navigate(['/HOME/feesDescription/']);
  this.deactivateSpinner();
}
}