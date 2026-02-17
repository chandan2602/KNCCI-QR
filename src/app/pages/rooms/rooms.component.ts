import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any;
  tenantCode:string=sessionStorage.getItem('TenantCode')
  locations:Array<any>=[];
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    this.loadRooms();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      ROOM_NO1: ['', [Validators.required,Validators.minLength(3)],],
      ROOM_NO_OF_SEATS1: ['', Validators.required,],
      LOCATION_ID: ['', [Validators.required]],
      LOCATION_STATUS: ['true', Validators.required]
    })
    this.setDefault();
    this.getLocations()
  }

  setDefault() {
    let ctrl = this.myForm.controls;
    ctrl['LOCATION_STATUS'].setValue('true');
    ctrl['LOCATION_ID'].setValue('')
  }
  activeSpinner(){
    this.CommonService.activateSpinner();
  }

  deactivateSpinner(){
    this.CommonService.deactivateSpinner()
  }

  getLocations(){
    this.CommonService.postCall('GetLocations',{TENANT_CODE:this.tenantCode}).subscribe(
      (res:any)=>{
       this.locations=res;
      },err=>{}
    )
  }
 

  loadRooms(){
    this.activeSpinner();
    this.CommonService.postCall('LoadRooms',{TENANT_CODE:this.tenantCode}).subscribe(
      (res:any)=>{
        this.table = [];
        setTimeout(() => { this.table = res }, 10)
        this.deactivateSpinner()
      },err=>{
       this.deactivateSpinner();
      }
    )
  }
  
  add() {
    this.editData = {};
    this.isEdit = false;
  }
  
   edit(data){
     this.isEdit=true;
     this.editData=data;
     let controls = this.myForm.controls;
     controls['ROOM_NO1'].setValue(data.ROOM_NO);
     controls['ROOM_NO_OF_SEATS1'].setValue(data.ROOM_NO_OF_SEATS);
     controls['LOCATION_ID'].setValue(data.LOCATION_ID);
     controls['LOCATION_STATUS'].setValue(data.ROOM_STATUS ? 1 : 0);
     if(data.ROOM_STATUS== 'ACTIVE'){
      controls['LOCATION_STATUS'].setValue('true')
    }else{
      controls['LOCATION_STATUS'].setValue('false')
    }
   }
  close() {
    this.myForm.reset();
    this.setDefault()
  }
  onSubmit(form: UntypedFormGroup) {
    this.activeSpinner();
    let payLoad = form.value;
    payLoad['TENANT_CODE'] = this.tenantCode;
    if (this.isEdit) {
      payLoad['ROOM_ID1'] = this.editData['ROOM_ID'];
      payLoad['LASTMDFBY']=sessionStorage.getItem('UserId')
      this.CommonService.postCall('UpdateRooms', payLoad).subscribe(
        (res: any) => {
          this.toastr.success('Updated Successfully')
          this.loadRooms();
          this.deactivateSpinner();
          document.getElementById('md_close').click()
        }, err => { this.toastr.error(err.message?err.message:err); this.deactivateSpinner() })
    } else {
      payLoad['CREATEDBY']=sessionStorage.getItem('UserId')
      this.CommonService.postCall('CreateRooms', payLoad).subscribe(
        (res: any) => {
          this.toastr.success('Created Successfully')
          this.loadRooms();
          this.deactivateSpinner();
          document.getElementById('md_close').click()
        }, err => { this.toastr.error(err.message?err.message:err); this.deactivateSpinner();console.log(err) })
    }
  }
}
