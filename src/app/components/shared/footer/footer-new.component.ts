import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-footer-new',
  templateUrl: './footer-new.component.html',
  styleUrls: ['./footer-new.component.css']
})
export class FooterNewComponent implements OnInit {
  myForm: UntypedFormGroup;
  enquiry: any;
  isValidEmail: boolean = false;
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      CONTACT_NAME: ['', Validators.required],
      CONTACT_DESCRIPTION: ['', Validators.required],
      CONTACT_EMAILID: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]]
    });
  }
  onSubmitForm(myForm: any) {

    let payLoad = JSON.parse(JSON.stringify(this.myForm.getRawValue()));

    console.clear();
    console.log(payLoad);
    this.validateEmail(payLoad.CONTACT_EMAILID);


    if (payLoad.CONTACT_NAME == "")
      return this.toastr.warning("Please Enter Name");
    else if (payLoad.CONTACT_EMAILID == "")
      return this.toastr.warning("Please Enter Valid  Email");
    else if (payLoad.CONTACT_DESCRIPTION == "")
      return this.toastr.warning("Please Enter Description");



    this.CommonService.postCall("Courses/EnquiryDetails", payLoad).subscribe((res: any) => {
      this.enquiry = res;
      this.toastr.success("Details Submitted successfully !!");
    }, e => { });
    this.myForm.reset();
  }

  validateEmail(val: any) {
    //let val = event.target.value;

    let exp = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
    if (new RegExp(exp).test(val)) {
      this.myForm.value.CONTACT_EMAILID = val;
      this.isValidEmail = false;
    } else {
      this.isValidEmail = true;
      this.myForm.value.CONTACT_EMAILID = '';

      $('#txtemail').val('');
      this.toastr.warning('Plase Enter Valid Email');
      return;
    }
  }

}
