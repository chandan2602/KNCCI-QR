import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LoginService } from '../../../app/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
declare var $: any
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  DEFAULT_PWD = 'ABC123';
  data: any = {};
  loginForm: UntypedFormGroup;
  submitted = false;
  fieldTextType: boolean | undefined;
  showAdPopup: boolean = false; jobId: any = '';

  tooltipContent = `
  <strong>1. Job Seeker</strong><br>
  Create your profile to explore job and internship opportunities tailored to your skills and interests.<br><br>
  <strong>2. Company</strong><br>
  Register your company to post job openings, manage applications, and connect with top talent.<br><br>
  <strong>3. Founder</strong><br>
  Sign up to showcase your startup, seek visibility, and connect with investors or incubators.<br><br>
  <strong>4. Incubator</strong><br>
  Register as an incubator to discover and support promising startups with mentorship and resources.<br><br>
  <strong>5. Investor</strong><br>
  Sign up to explore investment-ready startups and access detailed business insights.
`;

  isJobPerson: boolean = location.href.includes('/login?job_id');
  constructor(private userService: LoginService, private route: Router, private toastr: ToastrService, private commonService: CommonService,
    private fb: UntypedFormBuilder, private router: ActivatedRoute) {
    this.getCompanyDetails();
    if (this.isJobPerson) {
      this.router.queryParams.subscribe((res) => {
        if (Object.keys(res).length) {
          this.jobId = res.job_id;
        }
      });

    }
  }

  ngOnInit(): void {

    // this.init()
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
    // ["userName", "password"].forEach(e => {
    //   const element = (document.getElementById('userName') as HTMLInputElement);
    //   element.setAttribute("autocapitalize", "off");
    //   element.setAttribute("autocomplete", "off");
    //   element.setAttribute("autocorrect", "off");
    //   element.setAttribute("spellcheck", "off");
    // });

    this.router.queryParams.subscribe(params => {
      if (params['data']) {
        try {
          const decodedData: any = JSON.parse(atob(params['data']));
          this.loginForm.patchValue({
            userName: decodedData.UserName,
            password: decodedData.password
          });
          this.registerUser(this.loginForm.getRawValue())
        } catch (error) {
          console.error("Error decoding login data", error);
        }
      }
    });
    setTimeout(() => this.companyDetails(), 10);
  }

  get f() { return this.loginForm.controls; }

  registerUser(form: UntypedFormGroup) {
    this.submitted = true;
    let user = this.loginForm.getRawValue();
    if (user.userName.trim().length == 0) {
      //this.toastr.error("Please enter userName");
      (document.getElementById('userName') as HTMLInputElement).focus();
    }
    if (user.password.trim().length == 0) {
      //this.toastr.error("Please enter password");
      (document.getElementById('password') as HTMLInputElement).focus();
    }

    if (this.loginForm.invalid) {
      this.toastr.error("Please enter username or password");
      return;
    }
    // user.company_id = sessionStorage.company_id || 0;
    this.commonService.activateSpinner();
    this.userService.login(user).subscribe((succ) => {
      this.commonService.deactivateSpinner();
      let userData: any = succ ?? {};
      this.commonService.userId = userData.USERID
      sessionStorage.isLoggedIn = true;
      sessionStorage.adsShown = false;

      sessionStorage.setItem('userDetails', JSON.stringify(userData));
      sessionStorage.setItem('UserId', userData.USERID);
      sessionStorage.setItem('Username', userData.FIRSTNAME);
      sessionStorage.setItem('TenantCode', userData.TENANTCODE)
      sessionStorage.setItem('RoleId', userData.ROLEID)
      sessionStorage.setItem('DICTIONARYCODE', userData.DICTIONARYCODE)
      sessionStorage.setItem('SU', userData.samvaad_user);
      sessionStorage.setItem('SP', userData.samvaad_password);
      sessionStorage.setItem('Proctoring', userData.allow_proctoring);
      sessionStorage.setItem('USERTYPE', userData.USERTYPE);
      sessionStorage.setItem('USERTYPE', userData.USERTYPE);
      sessionStorage.setItem('company_id', userData.company_id);
      sessionStorage.MobileNo = userData.MobileNo;
      sessionStorage.USERNAME = userData.USERNAME;
      sessionStorage.PASSWORD = userData.PASSWORD;
      sessionStorage.is_company = userData.is_company;
      sessionStorage.FullName = `${userData.FIRSTNAME} ${userData.LASTNAME}`.toUpperCase();
      // sessionStorage.setItem('exampad',userData.allow_exampad);
      sessionStorage.profileImage = (userData.USERIMAGE || 'data:,').replace('data:,', "https://i.pinimg.com/736x/89/90/48/899048ab0cc455154006fdb9676964b3.jpg");
      this.commonService.userImage.next(sessionStorage.profileImage);
      // if (userData.PASSWORD.toUpperCase() == this.DEFAULT_PWD)
      //   this.route.navigate(['home/change-password']);

      if (this.isJobPerson && this.jobId != '' && this.jobId != 0) {
        this.route.navigate(['HOME/applyJob'], { queryParams: { jobId: this.jobId } });
      } else {
        if (sessionStorage.courseDetails) {
          const course = JSON.parse(sessionStorage.courseDetails);
          this.route.navigate(['view-course-details'], { state: course });
        }
        else if (userData.USERTYPE == 24)
          this.route.navigate(['HOME/usersRegistrationList']);
        else if (userData.USERTYPE == 25)
          this.route.navigate(['HOME/trainer-dashboard']);
        else if (userData.USERTYPE == 27)
          this.route.navigate(['HOME/founder-dshbrd'])
        else if (userData.USERTYPE == 28)
          this.route.navigate(['HOME/incubator-dshbrd'])
        else if (userData.USERTYPE == 29)
          this.route.navigate(['HOME/investor-dshbrd'])
        else
          this.route.navigate(['HOME/my-courses']);
      }
      // this.route.navigate(['HOME/dashboard']);

    }, (err) => {
      console.log(err)
      this.commonService.deactivateSpinner();
      let e = err.error;

      this.toastr.error(e?.text || 'Please try again later')
    })
  }

  // init() {
  //   let self = this;
  //   $('.input100').each(function () {
  //     $(this).on('blur', function () {
  //       if ($(this).val().trim() != "") {
  //         $(this).addClass('has-val');
  //       }
  //       else {
  //         $(this).removeClass('has-val');
  //       }
  //     })
  //   })

  //   var input = $('.validate-input .input100');

  //   $('.validate-form').on('submit', function () {
  //     var check = true;

  //     for (var i = 0; i < input.length; i++) {
  //       if (validate(input[i]) == false) {
  //         showValidate(input[i]);
  //         check = false;
  //       }
  //     }
  //     if (check) {
  //       self.registerUser()
  //     }
  //     return check;
  //   });


  //   $('.validate-form .input100').each(function () {
  //     $(this).focus(function () {
  //       hideValidate(this);
  //     });
  //   });

  //   function validate(input) {
  //     // return true
  //     if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
  //       return true
  //       if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
  //         return false;
  //       }
  //     }
  //     else {
  //       if ($(input).val().trim() == '') {
  //         return false;
  //       }
  //     }
  //   }

  //   function showValidate(input) {
  //     var thisAlert = $(input).parent();

  //     $(thisAlert).addClass('alert-validate');
  //   }

  //   function hideValidate(input) {
  //     var thisAlert = $(input).parent();

  //     $(thisAlert).removeClass('alert-validate');
  //   }

  //   var showPass = 0;
  //   $('.btn-show-pass').on('click', function () {
  //     if (showPass == 0) {
  //       $(this).next('input').attr('type', 'text');
  //       $(this).find('i').removeClass('zmdi-eye');
  //       $(this).find('i').addClass('zmdi-eye-off');
  //       showPass = 1;
  //     }
  //     else {
  //       $(this).next('input').attr('type', 'password');
  //       $(this).find('i').addClass('zmdi-eye');
  //       $(this).find('i').removeClass('zmdi-eye-off');
  //       showPass = 0;
  //     }

  //   });

  // }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType
  }

  onForgotPasswordClick() {
    let user = this.loginForm.getRawValue();
    if (user.userName.trim().length > 0) {
      // if (this.data.userName?.trim().length > 0) {
      // this.route.navigate(['/forgot-password']);
      const { company_id = 0 } = sessionStorage;
      const payload: string = `Account/ForgotPassword/${user.userName.trim()}`;
      this.commonService.activateSpinner();
      this.userService.forgotPassword(payload).subscribe((res: any) => {
        const message: string = "Your Password has been sent to your registered email.";
        this.commonService.deactivateSpinner();
        if (res.message == message)
          this.toastr.success(message, "Login Page"),
            this.commonService.deactivateSpinner();
        else {
          this.commonService.deactivateSpinner();
          this.toastr.warning(res.message, "Login Page");
        }
      }, (err) => {
        console.log(err)
        let e = err.error;
        this.toastr.error(e?.text || 'Please try again later'),
          this.commonService.deactivateSpinner();
      });
    }
    else {
      this.toastr.error("Please enter valid email", "Login Page");
      (document.getElementById("userName") as HTMLInputElement).focus();
    }
  }

  companyDetails() {
    const { fileUrl } = environment;
    if (sessionStorage.homepageimage_path) {
      document.getElementById("homepageimage_path")?.setAttribute("src", `${fileUrl}${sessionStorage.homepageimage_path} `);

    }
  }

  gotoSignUp() {
    // const URL = (/true/).test(sessionStorage.isDomain) ? "/student-signup" : "/signup";
    const URL = "";
    this.route.navigate([URL]);
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
      this.commonService.getCall(`account/IsSubDomainExists/${hostname}`).subscribe((res: any) => {
        if (res.data == true) {
          this.commonService.getCall(`account/GetCompanyDetails/${hostname}`).subscribe((res: any) => {
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

  signUPLogin(evnt: any) {
    if (evnt == 3) {
      this.route.navigate(['startsUpReg']);
      $('#cls').click();
    } else if (evnt == 4) {
      this.route.navigate(['incubatorReg']);
      $('#cls').click();
    } else if (evnt == 5) {
      this.route.navigate(['investorReg']);
      $('#cls').click();
    } else {
      // if(evnt == 1 || evnt == 2) {
      this.route.navigate(['/signup'], { queryParams: { type: evnt == 1 ? 'company' : 'jobSeeker' } });

      $('#cls').click();
      // } else 
    }
  }
}