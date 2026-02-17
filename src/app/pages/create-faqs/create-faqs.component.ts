import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
@Component({
  selector: 'app-create-faqs',
  templateUrl: './create-faqs.component.html',
  styleUrls: ['./create-faqs.component.css']
})
export class CreateFAQsComponent extends BaseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  constructor(private fb: UntypedFormBuilder, CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr)
    this.loadFAQs();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      Header: ['', Validators.required,],
      ContentText: ['', Validators.required],
    })
    this.dtOptions = {
      pageLength: 25,
      
    };
  
  }

  // ngAfterViewInit(): void {this.dtTrigger.next();}

  loadFAQs() {
    
  
   
    this.activeSpinner()
    let payLoad = {
      TENANT_CODE:this.tId|| sessionStorage.getItem('TenantCode'),
      "ContentType": 100
    }
    this.CommonService.postCall("LoadDisplayFAQs", payLoad).subscribe((res: any) => {
      // table.destroy();
     
      this.table = res;
       this.renderDataTable();
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }


  close() {
    this.isEdit = false;
    this.myForm.reset();
    this.editData = {};
  }

  delete(data) {
    let r = confirm('Are you sure you want to delete this question?');
    if (!r) return;
    let payLoad = {
      ContentId: data.CONTENTID
    }
    this.CommonService.postCall('deleteDisplayFAQs', payLoad).subscribe((res) => {
      this.toastr.success("Display FAQs deleted Successfully");
      this.loadFAQs();
    }, err => { this.toastr.error(err.error ? err.error : "FAQ not Deleted") })
  }


  edit(data) {
    this.editData.ContentId = data.CONTENTID;
    this.isEdit = true;
    this.CommonService.postCall('editDisplayFAQs', this.editData).subscribe((res) => {
      this.editData = res;
      this.setData()
    })
  }

  setData() {
    let ctrls: any = this.myForm.controls;
    Object.keys(ctrls).map((key: string) => {
      let control: UntypedFormControl = ctrls[key];
      let value = this.editData[key];
      if (value != undefined) control.setValue(value);

    });
  }
  onSubmit(form: UntypedFormGroup) {
    let payload = form.value;
    payload.TENANT_CODE = sessionStorage.getItem('TenantCode');
    this.activeSpinner();
    if (this.isEdit) {
      payload.LASTMDFBY = sessionStorage.getItem('UserId');
      payload.ContentId = this.editData.ContentId
      this.CommonService.postCall('UpdateDisplayFAQs', payload).subscribe((res) => {
        this.deactivateSpinner();
        this.toastr.success(" FAQ's Updated Successfully");
        document.getElementById('md_close').click()
        this.loadFAQs();
      }, err => { this.deactivateSpinner(); this.toastr.error(err.error ? err.error : "Create Display FAQs not updated ") })
    } else {
      payload.CREATEDBY = sessionStorage.getItem('UserId');
      // ContentType=100
      this.CommonService.postCall('CreateDisplayFAQs', payload).subscribe((res) => {
        this.deactivateSpinner();
        this.toastr.success("FAQ's Created Successfully");
        document.getElementById('md_close').click()
        this.loadFAQs();
      }, err => { this.deactivateSpinner(); this.toastr.error(err.error ? err.error : "Create Display FAQs not created ") })
    }


  }
  changeTname(){
    this.loadFAQs()
  }
  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
