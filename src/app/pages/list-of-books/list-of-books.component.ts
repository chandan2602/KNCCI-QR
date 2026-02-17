import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, AbstractControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-list-of-books',
  templateUrl: './list-of-books.component.html',
  styleUrls: ['./list-of-books.component.css']
})
export class ListOfBooksComponent implements OnInit {
  [x: string]: any;
  myForm: UntypedFormGroup;
  table: Array<any> = [];
  isEdit: boolean = null;
  studentId: string;
  departmentId: string;
  checked:Boolean = true;
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, active: ActivatedRoute, private toastr: ToastrService) {
    active.queryParams.subscribe((res) => {
      if (res.studentId && res.departmentId) {
        this.studentId = res.studentId;
        this.departmentId = res.departmentId;
      }
    })
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      BOOK_STD_STUDENT_ID: ['', Validators.required],
      BOOK_STD_BOOK_ID: ['', Validators.required],
      BOOK_STD_DATE_OF_ISSUE: [''],
      BOOK_STD_RETURN_DATE: [''],
      BOOK_STD_BRANCH_ID: ['', Validators.required],
      BOOK_STD_AMOUNT: [''],
      BOOK_STD_REMARKS: [''],
      BOOK_STD_ASSIGN: [''],
      BOOK_STD_BARCODE: [''],
      BOOK_STD_QRCODE: [''],

    })
    this.load();
  }
  load() {
    this.activiceSpinner();
    let payLoad = {
      "BOOK_STD_STUDENT_ID": this.studentId,
      "BOOK_DEPARTMENT_ID": this.departmentId
    }
    this.CommonService.postCall('LibraryManagement/GetBooksAllocation', payLoad).subscribe((res: any) => {
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
  onSubmit(isChecked) {
    let payLoad = this.table
    this.activiceSpinner();
    this.deactivateSpinner();
    this.CommonService.postCall('LibraryManagement/CreateBooksAllocation', payLoad).subscribe((res: any) => {
      this.toastr.success(" Assigned Succuessfully");
      this.load();
      this.deactivateSpinner();
    }, err => {
      this.toastr.error(err.error ? err.error : 'Not Assigned')
    })

  }
  isChecked(event, item:any) {
    if (event.target.checked){
      item.BOOK_STD_ASSIGN=true;
      item.BOOK_STD_STUDENT_ID=this.studentId;
      item.BOOK_STD_TNT_CODE=+sessionStorage.getItem('TenantCode');
      item.BOOK_STD_BOOK_ID=item.BOOK_ID;
      item.BOOK_STD_BRANCH_ID=item.DEPARTMENT_ID;
    
    }

       if (event.target.checked) {
            this.checked= false;
        }
        else {
            this.checked= true;
        }
  }
}
