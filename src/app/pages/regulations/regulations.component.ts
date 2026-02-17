import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-regulations',
  templateUrl: './regulations.component.html',
  styleUrls: ['./regulations.component.css']
})
export class RegulationsComponent implements OnInit {

  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any;
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    this.loadRegulation();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      REGULATIONS_NAME: ['', Validators.required,],
      REGULATIONS_DESCRIPTION: ['', [Validators.required]],
      REGULATIONS_STATUS: [1, Validators.required]
    })
  }

  activeSpinner(){
    this.CommonService.activateSpinner();
  }

  deactivateSpinner(){
    this.CommonService.deactivateSpinner()
  }
  loadRegulation() {
    this.activeSpinner();
    let payLoad: any = {
      TENANT_CODE: sessionStorage.getItem('TenantCode')
    }
    this.CommonService.postCall('Loadregulationsgrid', payLoad).subscribe((res: any) => {
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
    this.myForm.reset();
  }
  close() {

  }
  onSubmit(form: UntypedFormGroup) {
    let value:any=form.value;
       value.REGULATIONS_TNTCODE=sessionStorage.getItem('TenantCode');
       if(this.isEdit){
        value.REGULATIONS_MODIFIED_BY=sessionStorage.getItem('UserId');
        value.LASTMDFDATE = moment(new Date());
         value.REGULATIONS_ID =this.editData.REGULATIONS_ID;
        this.CommonService.postCall('Updateregulationsgrid',value).subscribe((res:any)=>{
          this.loadRegulation();
          this.toastr.success("Regulations Updated Succuessfully");
          document.getElementById('md_close').click();
        },err=>{
          this.toastr.error(err.error?err.error:'Regulations Not Updated')
        })
       }else{
        value.REGULATIONS_CREATED_BY=this.editData.CREATEDBY||sessionStorage.getItem('UserId');
        value.REGULATIONS_CREATED_DATE = this.editData.CREATEDDATE || moment(new Date());
         this.CommonService.postCall('Createregulationsgrid',value).subscribe((res:any)=>{
           this.loadRegulation();
           this.toastr.success("Regulations Created Succuessfully");
           document.getElementById('md_close').click();
         },err=>{
           this.toastr.error(err.error?err.error:'Regulations Not created')
         })
       }
  }

  edit(data) {
    this.isEdit=true;
    this.myForm.reset();
    let payLoad = this.editData= {
      REGULATIONS_ID: data.REGULATIONS_ID
    }
    this.editData=payLoad;
    this.CommonService.postCall('Editregulationsgrid', payLoad).subscribe((res: any) => {
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
      if(key=="REGULATIONS_STATUS"){
        value=this.editData[key]?1:0
        control.setValue(value);
      }
     
    });
  }
}
