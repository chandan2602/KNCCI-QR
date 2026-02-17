import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';


@Component({
  selector: 'app-book-allocation-view-report',
  templateUrl: './book-allocation-view-report.component.html',
  styleUrls: ['./book-allocation-view-report.component.css']
})
export class BookAllocationViewReportComponent extends BaseComponent implements OnInit {
  bookAllocation : Array<any>=[];
  titleName : string;
   titleId: string;
   bookCode : string;


  constructor(private commonService: CommonService, private fb: UntypedFormBuilder, private active: ActivatedRoute, private route: Router, toastr: ToastrService) {
    super(commonService,toastr);

    active.queryParams.subscribe((res) => {
      if (res.titleId && res.titleName) {
        this.titleName = res.titleName;
        this.titleId = res.titleId;
        this.bookCode = res.bookCode;
       
      }
    })
   }

  ngOnInit(): void {
    this.getViewReport()
    this.loadReportDtOptions();
  }

  activeSpinner() {
    this.commonService.activateSpinner();
  }

  deactivateSpinner() {
    this.commonService.deactivateSpinner()
  }

  loadReportDtOptions() {
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        {
          extend: "excel",
          filename: 'Books Allocation View Report',
        }
      ],
      order: []
    }
  }

  getViewReport(){
   
    let payLoad = {
      "BOOK_ID":this.titleId
  }
    this.commonService.postCall("LibraryManagement/BooksAllocationReport",payLoad).subscribe((res:any)=>{
    this.bookAllocation=res;
    this.deactivateSpinner();
    }, e => {
      this.deactivateSpinner();
    });
  }


  ok(){
    this.activeSpinner();
    this.route.navigate(['/home/bookAllocation']
    );
    this.deactivateSpinner();
  }
    
}
