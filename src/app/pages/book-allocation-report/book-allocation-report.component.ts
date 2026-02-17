import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-allocation-report',
  templateUrl: './book-allocation-report.component.html',
  styleUrls: ['./book-allocation-report.component.css']
})
export class BookAllocationReportComponent implements OnInit {
  myForm: UntypedFormGroup;
  titleOption: Array<any> = [];



  constructor(private commonService: CommonService, private fb: UntypedFormBuilder, private active: ActivatedRoute, private route: Router, toastr: ToastrService) {

  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      title : ['', Validators.required],
      })
    this.getTitles()
  }

  activeSpinner() {
    this.commonService.activateSpinner();
  }

  deactivateSpinner() {
    this.commonService.deactivateSpinner()
  }

  getTitles() {
   
    this.activeSpinner();
    let payLoad = {
      // "BOOK_TNT_CODE":60268037,
      "BOOK_TNT_CODE":sessionStorage.getItem('TenantCode')

  }
    this.commonService.postCall("LibraryManagement/BooksDropDown",payLoad).subscribe((res:any)=>{
    this.titleOption=res;

    this.deactivateSpinner();
    }, e => {
      this.deactivateSpinner();
    });

  }

 


  onSubmit(form) {
    
    let titleObj = this.titleOption.filter(x => x.BOOK_ID == form.value['title']);
    // let isbnObj = this.isbnOption.filter(x => x.CURRICULUM_ID == form.value['isbn']);

    
    this.route.navigate(['/HOME/viewReport'],{ queryParams: { titleId:titleObj[0]['BOOK_ID'],titleName:titleObj[0]['BOOK_NAME'],bookCode:titleObj[0]['BOOK_CODE']
    }})

  }
}
