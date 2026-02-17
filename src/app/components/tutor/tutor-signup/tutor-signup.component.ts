import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../../app/pages/base.component';
import { CommonService } from '../../../../app/services/common.service';
import { SamvaadUserRegister } from '../../../../app/samvaad-user.component';
import { environment } from '../../../../environments/environment';
declare let $: any;
@Component({
  selector: 'app-tutor-signup',
  templateUrl: './tutor-signup.component.html',
  styleUrls: ['./tutor-signup.component.css']
})
export class TutorSignupComponent extends BaseComponent implements OnInit {

  signUpForm: UntypedFormGroup;
  submitted: boolean = false;
  RegUser = new SamvaadUserRegister();
  samvaadUserPWD: string = '';
  isStudent: Boolean = false;
  isLgnTyp: Boolean = false;
  RoleId = sessionStorage.getItem('RoleId');
  companyList: Array<any> = [];
  isCompanyDetailsSubmitted: boolean = false;
  pay_Load: any = {};
  isLoginDetailsSubmitted: boolean = false;
  isRead: boolean = false;
  constructor(private fb: UntypedFormBuilder, CommonService: CommonService,
    private route: Router,
    toastr: ToastrService) {
    super(CommonService, toastr);
    this.isLgnTyp = location.href.includes('signup?type=company');
    this.isLgnTyp ? (this.isStudent = false): (this.isStudent = true);
    this.getCompanyDetails();

  }

  ngOnInit(): void {
    this.validationInit();
    this.signUpOnInit();
    this.getCompanyList();
    setTimeout(() => this.companyDetails(), 10);
  }

  signUpOnInit() {
    this.signUpForm = this.fb.group({
      'name': ['', [Validators.required, Validators.maxLength(100)]],
      'mobile': ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      'email': ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
      'role': [true],
      'Company_Name': [''],
      'regType': ['2'],
      Company_id: [0]
    })
  }

  get f() { return this.signUpForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      this.toastr.warning('Please Enter All Mandatory Fields', 'SignUp');
      return;
    }

    let signUpData = this.signUpForm.getRawValue();
    if (!this.isStudent) {//Tutor
      if ((+signUpData.regType == 2) && (signUpData.Company_Name.trim() == "")) {
        this.toastr.warning("Please enter the company name");
        document.getElementById('Company_Name')?.focus();
        return;
      }
    }
    else {
      if ((+signUpData.regType == 2) && (signUpData.Company_id == 0)) {
        this.toastr.warning('Please select company name.');
        return;
      }
    }

    if (!this.isStudent && +signUpData.regType == 2) {
      const company_name = signUpData.Company_Name.trim();
      this.CommonService.getCall(`account/IsCompanyExist/${company_name}`).subscribe((res: any) => {
        if (res.message == "Company already registed.") {
          this.toastr.error(res.message, "Company Signup");
          return;
        }
        this.CreateUser(signUpData);
      });
    }
    else
      this.CreateUser(signUpData);
  }

  CreateUser(signUpData: any) {
    let [payLoad, URL] = [{}, ''];


    if (!this.isStudent) {//Tutor Level
      URL = 'TenantRegistration/Create';
      payLoad = {
        TNT_NAME: signUpData.name,
        TNT_STATUS: true,
        TenantLogoUrl: "",
        SHOWLOGO: false,
        allow_proctoring: false,
        allow_exampad: false,
        TNT_CREATEDBY: "12345678",
        MobileNo: signUpData.mobile,
        emailid: signUpData.email,
        Company_Name: signUpData.Company_Name || '',
        RoleId: (+signUpData.regType == 1) ? 25 : 24
        // RoleId: 25//Tutor
      };
      console.log(payLoad);
    }

    else {//Student Level
      URL = 'Registration/SaveRegistration';
      payLoad = {
        title: 38,
        firstname: signUpData.name,
        lastname: " ",
        mobileno: signUpData.mobile,
        username: signUpData.email,
        password: "abc123",
        confirmPassword: "abc123",
        dob: "0001-01-01",
        Gender: 1,
        TENANT_CODE: (+signUpData.regType == 1) ? 12345678 : this.getTenantCode(+signUpData.Company_id),
        UserType: 26,//Student
        // Role: 3,//Member Or Trainee Or Student
        Role: 3,//Member Or Trainee Or Student
        Timezone: "India Standard Time",
        CREATEDBY: 12345678,
        Company_id: signUpData.Company_id,
        RoleId: 26,
      }
      console.log(payLoad);
    }
    this.pay_Load = payLoad;

    if (payLoad["RoleId"] == 24)
      this.isCompanyDetailsSubmitted = true;
    else if (payLoad["RoleId"] == 26)
      this.isLoginDetailsSubmitted = true;
    else
      this.CompanyRegistrationEvent(null);
    /*

  this.activeSpinner();
  this.CommonService.postCall(URL, payLoad).subscribe(
    (res: any) => {
      this.toastr.success('Created Successfully');

      if ([24, 25].includes(payLoad["RoleId"])) {
        this.checkSamvaadUserExists(signUpData.email, payLoad, res);
        // this.registerAsSamvaadUser(payLoad, res);
      }
      this.clear();
      this.deactivateSpinner();
      if (signUpData.Company_id) {
        this.route.navigate(['/company-registration']);
      }
      this.route.navigate(['/wellcome']);
    }, err => {
      this.toastr.error(err.error ? err.error.text || err.error : err); this.deactivateSpinner();
    });
    */
  }

  getTenantCode(Company_id: number): number {
    let tenant_code = 0;
    const result = this.companyList.find(e => e.COMPANY_ID == Company_id);
    if (result)
      tenant_code = result.TNT_CODE;
    return tenant_code
  }

  checkSamvaadUserExists(loginEmail: string, payLoad: any, Data: any, isNewUser: boolean = false) {
    this.activeSpinner();
    this.CommonService.getCall(`nojwt/login/getUserDeatilsBy/${loginEmail}`, '', true).subscribe(
      (res: any) => {
        if (isNewUser) {
          if (res.data.length > 0) {
            const { password } = res.data[0];
            this.samvaadUserPWD = password;
            this.SaveSamvaadUser(loginEmail, this.samvaadUserPWD, Data.TNT_CODE);
          }
        }
        else {
          if (res.data.length > 0) {
            const { password } = res.data[0];
            this.samvaadUserPWD = password;
            this.registerAsSamvaadUser(payLoad, Data, true, password);
          }
          else
            this.registerAsSamvaadUser(payLoad, Data);
        }

        this.clear();
        this.deactivateSpinner();
        // this.route.navigate(['/login']);
        this.route.navigate(['wellcome']);
      }, err => {
        this.toastr.error(err.error ? err.error.text || err.error : err); this.deactivateSpinner()
      })
  }

  registerAsSamvaadUser(item: any, data: any, isExistingSamvaadUser = false, pwd: string = '') {

    if (isExistingSamvaadUser == false) {
      //Register as samvaad user
      let payLoad = {
        ...this.RegUser,
        name: item['TNT_NAME'],
        mobileNO: item['MobileNo'],
        email: item['emailid'],
        password: data.PWD
      }
      this.CommonService.postCall("nojwt/login/saveOrUpdate", payLoad, true).subscribe((res: any) => {
        console.log(res);
        this.checkSamvaadUserExists(item.emailid, null, data, true);
        // this.SaveSamvaadUser(item.emailid, this.samvaadUserPWD, data.TNT_CODE);
      }, e => { });
    }
    else
      this.SaveSamvaadUser(item.emailid, this.samvaadUserPWD, data.TNT_CODE);

    /*
        let insertPayload = {
          USERNME: item['emailid'],
          // PASSWORD: isExistingSamvaadUser ?pwd: item.PWD,
          PASSWORD: this.samvaadUserPWD,
          TNT_CODE: data.TNT_CODE
        }
        //Insert as samvaad user
        this.CommonService.postCall("Registration/InsertSamvaadUser", insertPayload).subscribe((res: any) => {
          console.log(res);
        }, e => { });
        */
  }

  SaveSamvaadUser(USERNME: string, PASSWORD: string, TNT_CODE: string) {

    let insertPayload = {
      USERNME, PASSWORD, TNT_CODE
      //USERNME: item['emailid'],
      // PASSWORD: isExistingSamvaadUser ?pwd: item.PWD,
      //PASSWORD: this.samvaadUserPWD,
      //TNT_CODE: data.TNT_CODE
    }
    //Insert as samvaad user
    this.CommonService.postCall("Registration/InsertSamvaadUser", insertPayload).subscribe((res: any) => {
      console.log(res);
    }, e => { });
  }
  cancel() {

  }

  clear() {
    this.signUpOnInit();
    this.submitted = false;
  }

  validationInit() {
    let self = this;
    $('.input100').each(function () {
      $(this).on('blur', function () {
        if ($(this).val().trim() != "") {
          $(this).addClass('has-val');
        }
        else {
          $(this).removeClass('has-val');
        }
      })
    })

    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function () {
      var check = true;

      for (var i = 0; i < input.length; i++) {
        if (validate(input[i]) == false) {
          showValidate(input[i]);
          check = false;
        }
      }
      // if (check) {
      //   self.registerUser()
      // }
      return check;
    });


    $('.validate-form .input100').each(function () {
      $(this).focus(function () {
        hideValidate(this);
      });
    });

    function validate(input) {
      // return true
      if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
        return true
        if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
          return false;
        }
      }
      else {
        if ($(input).val().trim() == '') {
          return false;
        }
      }
    }

    function showValidate(input) {
      var thisAlert = $(input).parent();
      $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
      var thisAlert = $(input).parent();
      $(thisAlert).removeClass('alert-validate');
    }

    var showPass = 0;
    $('.btn-show-pass').on('click', function () {
      if (showPass == 0) {
        $(this).next('input').attr('type', 'text');
        $(this).find('i').removeClass('zmdi-eye');
        $(this).find('i').addClass('zmdi-eye-off');
        showPass = 1;
      }
      else {
        $(this).next('input').attr('type', 'password');
        $(this).find('i').addClass('zmdi-eye');
        $(this).find('i').removeClass('zmdi-eye-off');
        showPass = 0;
      }

    });

  }

  numberValidate(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]*/g, '');
  }
  nameValidate(event: any) {
    event.target.value = event.target.value.replace(/[^A-Za-z. ]*/g, '');
  }

  onChangerole(role: any) {
    if (role == 'student') {
      this.signUpForm.patchValue({ regType: 0, Company_id: 0, Company_Name: '' });
    } else {
      this.signUpForm.patchValue({ regType: "2", Company_id: 0, Company_Name: '' });
    }
    this.isStudent = (role == 'student') ? true : false;
  }


  getCompanyList() {
    this.CommonService.getCall(`Registration/GetCompanyList`).subscribe((res: any) => {
      this.companyList = res.data;
      console.log(this.companyList);
    })
  }


  companyDetails() {
    const { fileUrl } = environment;
    if (sessionStorage.homepageimage_path) {
      document.getElementById("homepageimage_path")?.setAttribute("src", `${fileUrl}${sessionStorage.homepageimage_path} `);

    }
  }


  CompanyRegistrationEvent(data: any) {
    const roleId: number = +this.pay_Load["RoleId"];
    console.log("Address Details:=", data);
    if (roleId == 24)
      this.isCompanyDetailsSubmitted = false;
    if (data == false)
      return;

    if (data && roleId == 24) {
      this.pay_Load.registration_no = data.registration_no;
      this.pay_Load.address = data.address;
      this.pay_Load.subdomainname = data.subdomainname;
      this.pay_Load.cmp_county_id = (+data.cmp_county_id);
      this.pay_Load.cmp_country_id = (+data.cmp_country_id);
      this.pay_Load.cmp_subcounty_id = (+data.cmp_subcounty_id);
      this.pay_Load.cmp_logo = data.cmp_logo;
    }
    let URL = [24, 25].includes(this.pay_Load["RoleId"]) ? "TenantRegistration/Create" : 'Registration/SaveRegistration';
    let signUpData = this.signUpForm.getRawValue();

    this.pay_Load.origin = location.origin;
    this.activeSpinner();
    this.CommonService.postCall(URL, this.pay_Load).subscribe(
      (res: any) => {
        //Update the Address Details
        this.deactivateSpinner();
        if (+this.pay_Load.UserType == 26 && res.message == "Registration Successful") {
          data.TENANTCODE = res.TENANT_CODE;
          data.USERID = res.userID;
           this.deactivateSpinner();
          this.CommonService.postCall('Account/UpdateAddress', data).subscribe(res => {
            this.toastr.success('Created Successfully');
            this.deactivateSpinner();
          });
        }
        else {
          this.toastr.success('Created Successfully');
        // if ([24, 25].includes(this.pay_Load["RoleId"])) {
        //   this.checkSamvaadUserExists(signUpData.email, this.pay_Load, res);
        //   // this.registerAsSamvaadUser(payLoad, res);
        // }
        this.clear();
        this.deactivateSpinner();
        this.route.navigate(['wellcome']);

        }
      }, err => {
        this.toastr.error(err.error ? err.error.text || err.error : err); this.deactivateSpinner();
      });
  }

  getAddressDetails(data: any) {
    console.log("Address Details:=", data);
    this.isLoginDetailsSubmitted = false;
    if (data)
      this.CompanyRegistrationEvent(data);
    /*
        let URL = 'Registration/SaveRegistration';
        let signUpData = this.signUpForm.getRawValue();
    
        this.activeSpinner();
        this.CommonService.postCall(URL, this.pay_Load).subscribe(
          (res: any) => {
            console.log(res);
            //Update the Address Details
            if (+this.pay_Load.UserType == 26 && res.message == "Registration Successful") {
              data.TENANTCODE = res.TENANT_CODE;
              data.USERID = res.userID;
              this.CommonService.postCall('Account/UpdateAddress', data).subscribe(res => {
                this.toastr.success('Created Successfully');
              });
            }
            // this.toastr.success('Created Successfully');
            if (this.pay_Load['RoleId'] == 25) {
              this.checkSamvaadUserExists(signUpData.email, this.pay_Load, res);
              // this.registerAsSamvaadUser(payLoad, res);
            }
            this.clear();
            this.deactivateSpinner();
            this.route.navigate(['/login']);
            // this.route.navigate(['/student-address']);
    
          }, err => {
            this.toastr.error(err.error ? err.error.text || err.error : err); this.deactivateSpinner()
          })
    */
  }

  getCompanyDetails() {
    const len: number = sessionStorage.length;
    if (len == 0)
      sessionStorage.isDomain = false;
    const { fileUrl } = environment;
    let { hostname } = location;
    if (["localhost", "shiksion.com"].includes(hostname))
      return;
    if (len == 0) {
      this.CommonService.getCall(`account/IsSubDomainExists/${hostname}`).subscribe((res: any) => {
        if (res.data == true) {
          this.CommonService.getCall(`account/GetCompanyDetails/${hostname}`).subscribe((res: any) => {
            if (res.data.length > 0) {
              sessionStorage.isDomain = true;
              sessionStorage.company_id = res.data[0].company_id;
              if (res.data[0].cerficateimage_path)
                sessionStorage.cerficateimage_path = res.data[0].cerficateimage_path;
              if (res.data[0].favicon_path)
                sessionStorage.favicon_path = res.data[0].favicon_path;
              if (res.data[0].homepageimage_path)
                sessionStorage.homepageimage_path = res.data[0].homepageimage_path;
              if (res.data[0].landingpageimage_path)
                sessionStorage.landingpageimage_path = res.data[0].landingpageimage_path;
              if (sessionStorage.favicon_path) {
                document.getElementById("appFavcon")?.setAttribute("href", `${fileUrl}${res.data[0].favicon_path}`);
              }
              if (sessionStorage.homepageimage_path) {
                document.getElementById("homepageimage_path")?.setAttribute("src", `${fileUrl}${sessionStorage.homepageimage_path} `);
              }
              // document.getElementById("homepageimage_path")
              console.log("AppComponent");

            }
          });
        }

      });
    }
  }

}
