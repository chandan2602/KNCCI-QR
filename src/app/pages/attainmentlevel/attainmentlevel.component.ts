import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-attainmentlevel',
  templateUrl: './attainmentlevel.component.html',
  styleUrls: ['./attainmentlevel.component.css']
})
export class AttainmentlevelComponent implements OnInit {
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any;
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    this.loadAttainmentgrid();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      GRADE: ['', Validators.required,],
      ANT_MAX: ['', Validators.required,],
      ANT_MIN: ['', [Validators.required]],
      GRADE_POINT:['',[Validators.required,Validators.max(10)]],
      DESCRIPTION:['',Validators.required],
      ANT_STATUS: [1, Validators.required]

    })
    this.setDefault()
  }

  setDefault() {
    let ctrl = this.myForm.controls;
    ctrl['ANT_STATUS'].setValue(1)
  }
  activeSpinner(){
    this.CommonService.activateSpinner();
  }

  deactivateSpinner(){
    this.CommonService.deactivateSpinner()
  }
  loadAttainmentgrid() {
    this.activeSpinner();
    let payLoad: any = {
      TENANT_CODE: sessionStorage.getItem('TenantCode')
    }
    this.CommonService.postCall('Loadattainmentgrid', payLoad).subscribe((res: any) => {
      this.table=[];
      setTimeout(()=>{
        this.table = res;
      },10)
      this.deactivateSpinner();
    },e=>{this.deactivateSpinner()})
  }

  add() {
    this.editData = {};
    this.isEdit = false;
  }
  close() {
    this.myForm.reset();
    this.setDefault()
  }
  onSubmit(form: UntypedFormGroup) {
    let value:any=form.value;
       value.ANT_TNTCODE=sessionStorage.getItem('TenantCode');
       if(this.isEdit){
        value.ANT_MODIFIEDBY=sessionStorage.getItem('UserId');
        value.ANT_MODIFIEDDATE = moment(new Date());
         value.AMT_ID =this.editData.AMT_ID;
        this.CommonService.postCall('Updateattainmentgrid',value).subscribe((res:any)=>{
          this.loadAttainmentgrid();
          this.toastr.success("Attainment  Updated Successfully");
          document.getElementById('md_close').click();
        },err=>{
          this.toastr.error(err.error?err.error:'Attainment  Not Updated')
        })
       }else{
        value.ANT_CREATEDBY=this.editData.CREATEDBY||sessionStorage.getItem('UserId');
        value.ANT_CREATEDDATE = this.editData.CREATEDDATE || moment(new Date())
         this.CommonService.postCall('Createattainmentgrid',value).subscribe((res:any)=>{
           this.loadAttainmentgrid();
           this.toastr.success("Attainment  created Successfully");
           document.getElementById('md_close').click();
         },err=>{
           this.toastr.error(err.error?err.error:'Attainment  not created')
         })
       }
  }
  

  edit(data) {
    this.isEdit=true;
   
    let payLoad = this.editData= {
      AMT_ID: data.AMT_ID
    }
    this.editData=payLoad;
    this.CommonService.postCall('Editattainmentgrid', payLoad).subscribe((res: any) => {
      if (res instanceof Array && res.length) {
        this.editData = res[0];
         this.datatransform()
      }else{
        this.editData=res;
        this.datatransform()
      }
    }, err => { }
    )
  }
  datatransform(){
    let ctrls: any = this.myForm.controls;
    Object.keys(ctrls).map((key: string) => {
      let control: UntypedFormControl = ctrls[key];
      let value=this.editData[key];
      if(value!=undefined)  control.setValue(value);
    });
  }
}
