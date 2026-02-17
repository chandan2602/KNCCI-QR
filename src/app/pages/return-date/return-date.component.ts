import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-return-date',
  templateUrl: './return-date.component.html',
  styleUrls: ['./return-date.component.css']
})
export class ReturnDateComponent implements OnInit {

  returnDate : Array<any>=[];
 


  constructor(private commonService: CommonService, private fb: UntypedFormBuilder, private active: ActivatedRoute, private route: Router, toastr: ToastrService) {

   }

  ngOnInit(): void {
    this.loadReturnDate()
  }

  activeSpinner() {
    this.commonService.activateSpinner();
  }

  deactivateSpinner() {
    this.commonService.deactivateSpinner()
  }

  loadReturnDate(){
    this.activeSpinner();
    let payLoad = {
       "BOOK_STD_STUDENT_ID":sessionStorage.getItem("UserId"),
      //  "BOOK_STD_STUDENT_ID":25663508,
       
     
  }
    this.commonService.postCall('LibraryManagement/AdminViewReports',payLoad).subscribe((res: any) => {
      this.returnDate = res;
      console.log(this.returnDate)
      this.deactivateSpinner();
    }, err => { this.returnDate = []; this.deactivateSpinner() })
  }

  ok(){
    this.activeSpinner();
    this.route.navigate(['/home']
    );
    this.deactivateSpinner();
  }



}
