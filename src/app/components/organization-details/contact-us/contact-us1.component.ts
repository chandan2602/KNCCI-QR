import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-contact-us1',
  templateUrl: './contact-us1.component.html',
  styleUrls: ['./contact-us1.component.css']
})
export class ContactUs1Component implements OnInit {
  contactUsForm: UntypedFormGroup;
  isValidEmail: boolean = false;
  cantact: any;
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0 });
    this.contactUsForm = this.fb.group({
      CONTACT_NAME: ['', Validators.required],
      CONTACT_DESCRIPTION: ['', Validators.required],
      MobileNo: [''],
      CONTACT_EMAILID: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]]
    });
  }

  onSubmitForm(contactUsForm: any) {

    let payLoad = JSON.parse(JSON.stringify(this.contactUsForm.getRawValue()));

    this.validateEmail(payLoad.CONTACT_EMAILID);


      if (payLoad.CONTACT_NAME == "")
      return this.toastr.warning("Please Enter Name");
    else if (payLoad.CONTACT_EMAILID == "")
      return this.toastr.warning("Please Enter Valid  Email");
    else if (payLoad.CONTACT_DESCRIPTION == "")
      return this.toastr.warning("Please Enter Description");



    this.CommonService.postCall("Courses/EnquiryDetails", payLoad).subscribe((res: any) => {
      this.cantact = res;
      this.toastr.success("Contact Details Submitted successfully !!");
    }, e => { });
    this.contactUsForm.reset();
  }
    validateEmail(val: any) {
      //let val = event.target.value;

      let exp = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
      if (new RegExp(exp).test(val)) {
        this.contactUsForm.value.CONTACT_EMAILID = val;
        this.isValidEmail = false;
      } else {
        this.isValidEmail = true;
        this.contactUsForm.value.CONTACT_EMAILID = '';

        $('#emailAddress').val('');
        this.toastr.warning('Plase Enter Valid Email');
  return;
      }
    }



}
