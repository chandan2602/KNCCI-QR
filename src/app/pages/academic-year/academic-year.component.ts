import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, AbstractControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-academic-year',
  templateUrl: './academic-year.component.html',
  styleUrls: ['./academic-year.component.css']
})
export class AcademicYearComponent implements OnInit {
  myForm: UntypedFormGroup;
  isEdit: boolean = null;
  isDisable: boolean = false;
  table: Array<any> = [];
  // startDate: Date = null;
  // minDate: any = moment().format('yyyy-MM-DD')
  startDate:any;
  endDate:any;
  editData: any;


  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    
    this.load();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      ACADEMIC_NAME: ['',Validators.required],
      ACADEMIC_STARTDATE: ['',Validators.required],
      ACADEMIC_ENDDATE: ['',Validators.required],
      STATUS: ['',Validators.required],
      ACADEMIC_DESCRIPTION: ['']
    });

  }

  load() {
    this.activiceSpinner();
    this.CommonService.getCall('Academic/GetList/'+sessionStorage.getItem('TenantCode')).subscribe((res: any) => {
      this.table = [];
      setTimeout(() => {
        this.table = res;
      }, 10)
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner(), console.log(e) })
  }
  activiceSpinner() {
    this.CommonService.activateSpinner();
  }
  deactivateSpinner() {
    this.CommonService.deactivateSpinner();
  }

  onSubmit(form: UntypedFormGroup) {
    let value: any = form.value;
    value.TNT_CODE = sessionStorage.getItem('TenantCode');
    let status: Boolean
    if (value.STATUS == 1) {
      status = true
    } else {
      status = false
    }
    let payload = {
    
      "ACADEMIC_NAME": value.ACADEMIC_NAME,
      "ACADEMIC_STARTDATE": value.ACADEMIC_STARTDATE,
      "ACADEMIC_ENDDATE":value.ACADEMIC_ENDDATE,
      "STATUS":status,
      "TENANT_CODE":sessionStorage.getItem('TenantCode'),
      "ACADEMIC_DESCRIPTION":value.ACADEMIC_DESCRIPTION,
      "CREATED_BY": sessionStorage.getItem('UserId'),
      "CREATE_DATE": moment(new Date()),
      "MODIFY_DATE":  moment(new Date()),
      "MODIFIED_BY":  sessionStorage.getItem('UserId'),
  }
  if (this.isEdit) {
    payload['CREATE_DATE']= this.editData.CREATE_DATE;
    payload['ACADEMIC_ID'] = this.editData.ACADEMIC_ID;
    this.CommonService.postCall('Academic/Update', payload).subscribe((res: any) => {
      this.load();
      this.toastr.success("Academic Updated Succuessfully");
      document.getElementById('md_close').click();
    }, err => {
      this.toastr.error(err.error ? err.error : 'Academic Not Updated')
    })
  }else {

    this.CommonService.postCall('Academic/Create', payload).subscribe((res: any) => {
      this.load();
      this.toastr.success("Academic Created Succuessfully");
      document.getElementById('md_close').click();
    }, err => {
      this.toastr.error(err.error ? err.error : 'Academic Not created')

    })
  }


  }
  edit(academicId) {
    this.editData=academicId;
    this.isEdit=true;
    this.myForm.reset();
    let payLoad={
      "CURRICULUM_ID":academicId
    }
    this.CommonService.getCall('Academic/Get/'+academicId).subscribe((res: any) => {
      if (res instanceof Array && res.length) {
        this.editData = res[0];
        this.dataTransForm()
      } else {
        this.editData = res;
        this.dataTransForm()
      }
      this.dataTransForm();
    }), err => { }
   

   }
   
   dataTransForm(){
    let ctrls=this.myForm.controls
    Object.keys(ctrls).map((key)=>{
      let ctrl: AbstractControl = ctrls[key];
      ctrl.setValue(this.editData[key])

    });
    ctrls['ACADEMIC_STARTDATE'].setValue(moment(this.editData['ACADEMIC_STARTDATE']).format('yyyy-MM-DD'));
    ctrls['ACADEMIC_ENDDATE'].setValue(moment(this.editData['ACADEMIC_ENDDATE']).format('yyyy-MM-DD'))
    ctrls['ACADEMIC_NAME'].setValue(this.editData['ACADEMIC_NAME'])
    ctrls['ACADEMIC_DESCRIPTION'].setValue(this.editData['ACADEMIC_DESCRIPTION'])
    ctrls['STATUS'].setValue(this.editData.STATUS ? 1 : 0);
      // this.startDate = ctrls.ACADEMIC_STARTDATE;
      // this.endDate = ctrls.ACADEMIC_ENDDATE;
      // let ctrl=ctrls[key];


      // if(key=='STATUS'){
      // ctrl.setValue(this.editData['STATUS']?1:0)
      // }else{
      // ctrl.setValue(this.editData[key]);
      // }
    
   
  }
  close() {
    this.isEdit=null;
    this.myForm.reset();
    this.editData={};
  }
  endDateChange(eDate) {
    let sDate = this.myForm.get('ACADEMIC_STARTDATE').value;
    if (!sDate) {
      this.toastr.warning('Please select strat Date')
      this.myForm.get('ACADEMIC_ENDDATE').setValue(null)
      return
    }
    if (!moment(eDate).isSameOrAfter(sDate)) {
      this.toastr.warning('End date should be equal or more than start Date')
      this.myForm.get('ACADEMIC_ENDDATE').setValue(null)
    }
  }

}
