import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-forum-topics',
  templateUrl: './forum-topics.component.html',
  styleUrls: ['./forum-topics.component.css']
})
export class ForumTopicsComponent implements OnInit {

  table: Array<any> = [];
  myForm: UntypedFormGroup;
  editData: any = {};
  isApproved: any;
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    this.loadForums()
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      MNAME: ['', Validators.required,],
      tNAME: [''],
      MDESCRIPTION: ['',],
      MSTATUS: ['', Validators.required]
    })
  }


  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  loadForums() {
    this.activeSpinner()
    let payLoad = {
      TenantCode: sessionStorage.getItem('TenantCode'),
      RoleId: sessionStorage.getItem('RoleId'),
      DictionaryCode: sessionStorage.getItem('DICTIONARYCODE')
    }
    this.CommonService.postCall("LoadFourmTopics", payLoad).subscribe((res: any) => {
      this.table = [];
      setTimeout(() => { this.table = res }, 10)
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }


  close() {
    this.myForm.reset();

  }
  // add() { }
  edit(data) {

    // let payLoad = this.editData = {
    //  ForumId=data.ForumId
    //   TENANT_CODE:sessionStorage.getItem('TenantCode')
    // }
    // this.isEdit = true;
    // this.CommonService.postCall('EditTopic', payLoad).subscribe((res: any) => {
    //   if(res.length){
    //     this.editData = res[0];
    //    }
    //   this.setData();
    // }, err => { })
    this.editData = data;
    let controls = this.myForm.controls;
    controls['MNAME'].setValue(data.COURSE_NAME);
    controls['tNAME'].setValue(data.TOPIC);
    controls['MDESCRIPTION'].setValue(data.DESCRIPTION);
    if (data.STATUS == 'Approved') {
      controls['MSTATUS'].setValue("1");
    }
    else {
      controls['MSTATUS'].setValue("0");
    }
  }
  setData() {

  }
  onSubmit(form: UntypedFormGroup) {
    let payLoad = {
      "TENANT_CODE": sessionStorage.getItem('TenantCode'),
      "ForumId": this.editData.ForumId,
      "CREATEDBY": sessionStorage.getItem('UserId'),
      "IsApproved": this.isApproved =='1'?true : false
    }
    this.activeSpinner();
    this.CommonService.postCall('UpdateTopic', payLoad).subscribe(
      (res) => {
        this.deactivateSpinner();
        this.toastr.success('Successfully updated');
        this.loadForums();
        document.getElementById('md_close').click();
      }, e => { this.deactivateSpinner(); this.toastr.warning(e.message ? e.message : 'error occured please try later') })

  }
  delete(data) {
    let c = confirm('Do you want to delete this record?')
    if (c) {
      let payLoad = {
        "TenantCode": sessionStorage.getItem('TenantCode'),
        "ForumId": data.ForumId,
        "CREATEDBY": sessionStorage.getItem('UserId'),
        "IsApproved": "false"
      }
      this.activeSpinner();
      this.CommonService.postCall('RemoveTopic', payLoad).subscribe(
        (res) => {
          this.deactivateSpinner();
          this.toastr.success('Successfully Deleted');
          this.loadForums();
        }, e => { this.deactivateSpinner(); this.toastr.warning(e.message ? e.message : 'error occured please try later') })
    }
  }
}