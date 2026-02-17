import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from '../base.component';
import { FileuploadService } from '../../services/fileupload.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from '../../../environments/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';

declare let $: any;
@Component({
  selector: 'app-cources',
  templateUrl: './cources.component.html',
  styleUrls: ['./cources.component.css']
})
export class CourcesComponent extends BaseComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective; subscribeDetails: any = '';
  courses: Array<any> = [];
  fileName: string = '';
  fileName1: string = '';
  document_name: string = '';
  data: any;
  is_certified: boolean = false;
  submitted = false;
  imageURL: any='';
  id: any = window.location.origin + '/#/certificate?id=' + sessionStorage.getItem('UserId');
  userData: any = {};
  showModel: boolean = false;
  serverPath: string;
  RoleId = sessionStorage.getItem('RoleId');
  showBulletOption: boolean = false;
  OptionsList: Array<string> = [];
  tooltipContent = `
					Use this section to create new internship opportunities. All created internships will be displayed in the table below. <br><br>
To add a new internship for admin approval: <br><br>
1.	Click the <strong>Add</strong> button at the top corner of the table. <br>
2.	Fill in all required fields and click <strong>Save. </strong><br>
3.	After saving, proceed to the <strong>Internship Schedule</strong> menu to continue with the next steps.

					`;

  course_id: number = 0;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(private fb: UntypedFormBuilder, CommonService: CommonService, toastr: ToastrService, private route: Router,
    private FileuploadService: FileuploadService) {
    super(CommonService, toastr);
    this.loadCourse();
    this.loadCourseCategory();
    this.serverPath = environment.fileUrl;
       if (sessionStorage.getItem('subscribeData') != null && sessionStorage.getItem('subscribeData') != 'undefined') {
      this.subscribeDetails = '',
      this.subscribeDetails = JSON.parse(<string>sessionStorage.getItem('subscribeData'));
    };
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      COURSE_NAME: ['', Validators.required],
      COURSE_CATEGORY_ID: ['', Validators.required],
      COURSE_DESCRIPTION: ['', Validators.required],
      ISCERTIFIED: [false],
      UPLOAD_CERTIFIED: [''],
      COURSE_IMAGE: [''],
      COURSE_STATUS: [true],
      COURSE_TRENDING: [false],
    });
    // this.dynamicaValidations();
  }

  PostJob() {
    // let params = this.params

    let today = new Date();
    let dateToCheck = new Date(this.subscribeDetails?.expired_date);

    // Remove time for accurate comparison
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);

    let isFutureDate: boolean = dateToCheck < today;
    if (this.subscribeDetails == '' || this.subscribeDetails == 'undefined' ) {
      this.toastr.info('Please Subscribe');
      this.route.navigate(['/HOME/subscribe']);
       $('#clss').click();
    } else if(this.subscribeDetails?.internships_remaining == 0 || isFutureDate) {
      this.toastr.info('Subscription is Expired');
      this.route.navigate(['/HOME/subscribe']);
      $('#clss').click();
    }
    //  else {
    //   // $('#myModal').click()

    // }
    // if (this.isLogin) {
    // } else 
    //   this.router.navigate(['/login'], { queryParams: {job_id: params.job_id} });
  }

  setDefault() {
    let ctrl = this.myForm.controls;
    ctrl['ISCERTIFIED'].setValue(false);
    ctrl['COURSE_STATUS'].setValue(true);
    ctrl['COURSE_TRENDING'].setValue(false);
    ctrl['UPLOAD_CERTIFIED'].setValue(null);
    ctrl['COURSE_IMAGE'].setValue(null);
  }

  loadCourse() {
    this.activeSpinner()
    let payLoad = { TENANT_CODE: this.tId || this.TenantCode, RoleId: this.RoleId, USER_ID: sessionStorage.UserId };
    this.CommonService.postCall("LoadCourse", payLoad).subscribe((res: any) => {
      this.table = [];
      this.table = res;
      this.renderDataTable()
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }

  loadCourseCategory() {

    this.activeSpinner()
    let payLoad = { TENANT_CODE: sessionStorage.TenantCode, USER_ID: sessionStorage.UserId };
    this.CommonService.getCall("GetAllCategories").subscribe((res: any) => {
      this.courses = res;
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })

  }

  Certified(check: any) {
    this.is_certified = check.target.value == 'true';
  }


  close() {
    this.isEdit = false;
    this.myForm.reset();
    this.setDefault();
    // document.getElementById('materialFile1')['value'] = '';
    // document.getElementById('materialFile2')['value'] = '';
    [this.fileName, this.fileName1, this.document_name] = ['', '', ''];
    this.imageURL = '';

  }

  add() { 
    this.PostJob();
  }

  edit(data: any) {
    let payLoad = this.editData = {
      COURSE_ID: data.COURSE_ID
    }
    this.isEdit = true;
    this.CommonService.postCall('EditCourse', payLoad).subscribe((res: any) => {
      if (res instanceof Array) {
        if (res.length) {
          this.editData = res[0];
          this.setData(res[0]);
        }
      } else {
        this.editData = res;
        this.setData(res);
      }
    }, err => { })
  }

  setData(data) {
    let ctrls: any = this.myForm.controls;
    this.fileName = data['UPLOAD_CERTIFIED'];
    this.setfileDocumentName(this.fileName);
    this.fileName1 = data['COURSE_IMAGE'];
    this.imageURL = `${this.serverPath}${data.COURSE_IMAGE}`;
    // this.onSetCoursePath(data.COURSE_CATEGORY_ID);
    try {
      Object.keys(ctrls).map((key: string) => {
        let control: UntypedFormControl = ctrls[key];
        let value = this.editData[key];
        if (value != undefined) control.setValue(value);
        
      });
    } catch (error) {

    }

  }
  onCertifiedChange(value: boolean) {
    this.is_certified = value;
    if (!value) {
      this.document_name = '';
      this.fileName = '';
    } else {
      this.setfileDocumentName(this.editData.UPLOAD_CERTIFIED);
    }
  }

  changeFile(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      // let types: Array<any> = ['doc', 'docx', 'pdf', 'gif', 'png', 'xlsx', 'xlr', 'ppt', 'pptx', 'jpeg', 'zip']
      let types: Array<any> = ['pdf'];
      let check = types.includes(filetype);
      if (check) {
        if (this.fileSizeCalculation(file.size, 2)) {
          this.toastr.warning('File size is too big');
          return;
        }
        this.file = file;
        this.upload();
        return;
      }
      else {
        this.toastr.error('Please upload valid file formats');
        event.target.value = '';
      }
    }
  }
  upload() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/Courses/Documents');
    // formData.append('Course', this.courseId);
    this.FileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.fileName = res.path;
        if (this.fileName) {
          this.setfileDocumentName(this.fileName);
          this.myForm.controls['UPLOAD_CERTIFIED'].setValue(this.fileName);

        }
      } catch (e) {
        // console.log(e)
      }

    }, err => { })
  }

  changeFile1(event: any) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = [['png', 'jpg', 'PNG', 'jpeg', 'gif', 'JPEG', 'image']];
      let check = types.includes(filetype);
      if (check == false) {
        this.file = file;
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (_event) => {
          this.imageURL = reader.result;
        }
        this.uploadImage();
        return;
      }
      else
        event.target.value = '';
    }
  }

  uploadImage() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/Courses/Image');
    this.FileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.fileName1 = res.path;
        if (this.fileName1) {
          this.myForm.controls['COURSE_IMAGE'].setValue(this.fileName1);
          console.log(this.fileName1);
        }
      } catch (e) {
        console.log(e)
      }

    }, err => { })

  }

  get f() { return this.myForm.controls; }

  onSubmit(form: UntypedFormGroup) {
    this.submitted = true;
    this.getFormValidationErrors(this.myForm);
    let payLoad = this.myForm.getRawValue();
    if (form.invalid) {
      this.toastr.warning('Please Enter All Mandatory Fields');
      return;
    }

    if (payLoad.ISCERTIFIED == true) {
      if (this.fileName == "" || this.fileName == null) {
        this.toastr.warning('Please upload Certificate');
        return;
      }
    }
    if (this.fileName1 == "" || this.fileName1 == null) {
      this.toastr.warning('Please upload COURSE IMAGE');
      return;
    }

    this.activeSpinner()
    payLoad["CREATEDBY"] = this.editData.CREATEDBY || sessionStorage.getItem('UserId');
    payLoad.TENANT_CODE = sessionStorage.getItem('TenantCode');
    payLoad.CREATEDDATE = new Date();
    payLoad.UPLOAD_CERTIFIED = this.fileName;
    payLoad.COURSE_IMAGE = this.fileName1;
    payLoad.company_id = sessionStorage.getItem('company_id');
    if (!payLoad.ISTUDYTIMEREQUIRED || payLoad.ISTUDYTIMEREQUIRED == '') {
      payLoad.ISTUDYTIMEREQUIRED = false;
    }
    console.log('payload', payLoad);

    if (this.isEdit) {
      payLoad.COURSE_ID = this.editData.COURSE_ID;
      this.CommonService.postCall('UpdateCourse', payLoad).subscribe((res: any) => {
        this.loadCourse();
        this.deactivateSpinner();
        this.toastr.success('Course  Updated Successfully')
        document.getElementById('md_close')?.click()
      }, err => {
        this.deactivateSpinner();
        this.toastr.error(err.error ? err.error : 'Course Type  not Updated')
      })
    } else {
      this.CommonService.postCall('CreateCourse', payLoad).subscribe((res: any) => {
        if (res.result == 'fail') {
          this.deactivateSpinner();
          this.toastr.error(res.message);
          return;
        }
        this.loadCourse();
        this.deactivateSpinner();
        this.toastr.success('Course  created Successfully')
        document.getElementById('md_close')?.click()

      }, err => {
        this.deactivateSpinner();
        this.toastr.error(err.error ? err.error : 'Course Type  not created ')
      })
    }
  }
  navigate(data, route) {
    this.route.navigate(['HOME/' + route], { queryParams: { id: data.COURSE_ID } })
  }
  changeTname() {
    this.loadCourse()
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  dynamicaValidations() {
    this.myForm.get('ISCERTIFIED')?.valueChanges.subscribe(val => {
      switch (+val) {
        case 1:
          // this.removeValidators(['comment', 'id']);
          this.addValidators(this.myForm, ['UPLOAD_CERTIFIED']);
          break;
        case 0:
          this.removeValidators(this.myForm, ['UPLOAD_CERTIFIED']);
          // this.addValidators(['id']);
          break;
      }

    });
  }

  addValidators(myForm: any, controls: string[]) {
    controls.forEach(c => {
      if (['desc', 'comment'].includes(c)) {
        myForm.get(c)?.setValidators([Validators.required, Validators.maxLength(250)]);
      } else {
        myForm.get(c)?.setValidators(Validators.required);
      }
      myForm.get(c)?.updateValueAndValidity();
    });
  }

  removeValidators(myForm: any, controls: string[]) {
    controls.forEach(c => {
      myForm.get(c)?.clearValidators();
      myForm.get(c)?.updateValueAndValidity();
    });
  }

  onCourseImage() {
    document.getElementById('materialFile2')?.click();
  }

  onCertificateUpload() {
    document.getElementById('materialFile1')?.click();
  }

  setfileDocumentName(filePath: string = '') {
    this.document_name = (filePath && filePath.length > 0) ? filePath.split('_')[2] : '';
  }


  public convetToPDF() {
    var data: any = document.getElementById('contentCertificate');
    html2canvas(data).then((canvas: any) => {
      /*
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf: any = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      // pdf.addImage(contentDataURL, 'PNG', 0, position, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save('new-file.pdf'); // Generated PDF

      */
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf({
        orientation: 'landscape',
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('download.pdf');

    });

  }

  displayModel() {
    setTimeout(() => (<HTMLInputElement>document.getElementById('btnShowModel')).click(), 10);
  }

  closeCertificateEvent(data: any) {
    this.showModel = false;
  }

  onSetCoursePath(id: any) {
    if (id > 0) {
      let imgURL = this.courses.find(e => e.COURSE_CATEGORY_ID == id).IMAGE_URL;
      this.imageURL = this.setServerPath(imgURL);     
    }
  }

  showBulletOptions(item: any) {
    console.table(item);
    this.OptionsList = item.moreoptions ? item.moreoptions.split(",") : [];
    this.showBulletOption = true;
    this.course_id = item?.COURSE_ID ?? 0;
  }

  optionListEvent(data: { isCancel: boolean, option: Array<string> }) {
    this.showBulletOption = false;
    if (!data.isCancel) {
      this.activeSpinner()
      let payLoad = { course_id: this.course_id, moreoptions: data.option.toString() };
      this.CommonService.postCall("UpdateMoreOptions", payLoad).subscribe((res: any) => {
        this.deactivateSpinner();
        if (res.status)
          this.loadCourse();
      }, e => { this.deactivateSpinner() });
    }
  }
}
