import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BaseComponent } from '../base.component';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-smtp',
  templateUrl: './smtp.component.html',
  styleUrls: ['./smtp.component.css']
})
export class SmtpComponent extends BaseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  constructor(private fb: UntypedFormBuilder,  CommonService: CommonService, toastr: ToastrService) {
    super(CommonService,toastr);
    this.getTennates()
    this.loadSMTP();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      SmtpName: ['', Validators.required,],
      FromEmail: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required,Validators.minLength(6)]],
      PortNo: ['', Validators.required],
      Description: [''],
      Status: [true, Validators.required]
    })
  }

 
  loadSMTP() {
    this.activeSpinner();
    let payLoad: any = {
      TENANT_CODE: this.tId||this.TenantCode
    }
    this.CommonService.postCall('LoadSMTP', payLoad).subscribe((res: any) => {
      this.table=[];
      this.table=res;
      this.renderDataTable();
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
       value.TENANT_CODE=sessionStorage.getItem('TenantCode');
       value.LASTMDFBY=sessionStorage.getItem('UserId');
       value.CREATEDBY=this.editData.CREATEDBY||sessionStorage.getItem('UserId');
       value.CREATEDDATE =  moment(new Date());
       value.LASTMDFDATE = moment(new Date())
       if(this.isEdit){
         value.SmtpID =this.editData.SMTPCONFIGID||this.editData.SmtpID;
        this.CommonService.postCall('UpdateSMTP',value).subscribe((res:any)=>{
          this.loadSMTP();
          this.toastr.success("SMTP Updated Successfully");
          document.getElementById('md_close').click();
        },err=>{
          this.toastr.error(err.error?err.error:'SMTP Not Updated')
        })
       }else{
         this.CommonService.postCall('CreateSMTP',value).subscribe((res:any)=>{
           this.loadSMTP();
           this.toastr.success("SMTP created Successfully");
           document.getElementById('md_close').click();
         },err=>{
           this.toastr.error(err.error?err.error:'SMTP not created')
         })
       }
  }

  edit(data) {
    this.isEdit=true;
    this.myForm.reset();
    let payLoad = {
      SmtpID: data.SMTPCONFIGID
    }
    this.editData=payLoad;
    this.CommonService.postCall('EditSMTP', payLoad).subscribe((res: any) => {
      if (res instanceof Array && res.length) {
        this.editData = res[0];
      }else{
        this.editData=data;
      }
      this.setData()
    }, err => { }
    )
  }

  setData() {
    let ctrls: any = this.myForm.controls;
    Object.keys(ctrls).map((key: string) => {
      let control: UntypedFormControl = ctrls[key];
      let value=this.editData[key.toUpperCase()];
      if(value!=undefined)  control.setValue(value);
    });
    ctrls['Status'].setValue(this.editData['STATUS']?1:0);
  }
  changeTname() {
    this.loadSMTP()
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
// onkeypress='return (event.charCode >= 48 && event.charCode <= 57)'