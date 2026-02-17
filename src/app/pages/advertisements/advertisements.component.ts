import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../pages/base.component";
import { CommonService } from "../../services/common.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../environments/environment";
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { FileuploadService } from "../../services/fileupload.service";
import * as moment from "moment";
declare var $: any;
@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.css']
})
export class AdvertisementsComponent extends BaseComponent implements OnInit {
  myForm: any = UntypedFormGroup;
  comments: string = "";
  selectedObj: any;
  statusId: number;
  company_id = sessionStorage.company_id;
  RoleId = sessionStorage.RoleId;
  imageURL1: string;
  fileName1: string = '';
  serverPath: string;
  AdvertisementsDetails: Array<any> = [];
  companyList: Array<any> = [];
  minToDate: string = '';
  isApproved: boolean = false;
  submitted: boolean = false;
  tooltipContent = `
					Use this section to publish and manage advertisements. All existing ads are listed in the table below.

To create a new advertisement:<br><br>

Click the <strong>Add </strong>button at the top right of the screen.<br>
Enter the <strong>Advertisement Name, Start Date, End Date, Description, </strong>and upload the relevant file or image.<br>
To include multiple visuals, use the <strong>Add Images</strong>button.<br>
Once all details are filled, click <strong>Save.</strong><br><br>

After saving, the advertisement will be sent for <strong>admin review and approval. </strong>Once approved, it will be published and visible to all registered users.
					`;

  constructor(private fileuploadService: FileuploadService, CommonService: CommonService, toastr: ToastrService, private fb: UntypedFormBuilder) {
    super(CommonService, toastr);
    this.serverPath = environment.urlFiles;
  }

  ngOnInit(): void {
    this.formInIt();
    if (this.company_id) {
      this.getCompanyList();
    }
    this.getList();
  }

  formInIt() {
    this.myForm = this.fb.group({
      adv_company_id: [this.company_id],
      advertisement_id: [0],
      adv_tnt_code: [+sessionStorage.TenantCode],
      adv_name: ['', Validators.required],
      adv_description: [''],
      adv_fromdate: ['', Validators.required],
      adv_enddate: ['', Validators.required],
      adv_created_by: [+sessionStorage.UserId],
      adv_modified_by: [+sessionStorage.UserId],
    });
  }

  get f() { return this.myForm.controls; }
  getList() {
    this.activeSpinner();
    this.table = [];
    let tntcode = this.companyList.find(e => e.COMPANY_ID == this.company_id)?.TNT_CODE || this.TenantCode;
    this.CommonService.postCall("Advertisement/GetAdvertisementList", { adv_tnt_code: tntcode, adv_company_id: this.company_id }).subscribe(
      (res: any) => {
        this.table = res.data;
        this.deactivateSpinner();
      },
      (e) => {
        this.deactivateSpinner();
      }
    );
  }

  getCompanyList() {
    this.activeSpinner();
    this.companyList = [];
    this.CommonService.getCall("Registration/GetCompanyList").subscribe(
      (res: any) => {
        this.companyList = res.data;
        this.deactivateSpinner();
      }, (e) => {
        this.deactivateSpinner();
      }
    );
  }

  approve(item: any, statusId: number) {
    if (confirm(`Are you sure you want to ${statusId == 1 ? "Approve" : "Reject"} this Advertisements?`)) {
      this.activeSpinner();
      let payload = {
        adv_approved_by: statusId == 1 ? this.userId : 0,
        adv_approval_status: statusId,
        adv_approved_comments: statusId == 1 ? this.comments : '',
        adv_rejected_by: statusId == 3 ? this.userId : 0,
        adv_rejected_comments: statusId == 3 ? this.comments : '',
        adv_tnt_code: this.companyList.find(e => e.COMPANY_ID == this.company_id)?.TNT_CODE || this.TenantCode,
        adv_modified_by: this.userId,
        advertisement_id: item.advertisement_id,
        adv_company_id: this.company_id,
      };
      this.CommonService.postCall("Advertisement/ApproveOrRejectAdvertisement", payload).subscribe((res: any) => {
        if (res.status) {
          this.toastr.success(`Advertisement ${statusId == 1 ? "Approved" : "Rejectd"} successfully`);
          document.getElementById("close1")?.click();
          this.getList();
          this.close1();
        } else {
          this.toastr.warning(res.message);
        }
        this.deactivateSpinner();
      }, (e) => {
        this.toastr.error(e.error.message);
        this.deactivateSpinner();
      });
    }
  }

  getData(item, Id: number) {
    this.selectedObj = item;
    this.statusId = Id;
  }
  add() {
    this.addImages();
  }

  close1() {
    this.comments = "";
    $('#reason').modal('hide');
  }

  close() {
    this.myForm.reset();
    this.formInIt();
    this.AdvertisementsDetails = [];
    this.isEdit = true;
    this.editData = {};
    this.isApproved = false;
    this.submitted = false;
  }


  onSubmit(form: any) {
    this.activeSpinner();
    this.submitted = true;
    this.getFormValidationErrors(this.myForm);
    if (form.invalid) {
      this.toastr.info('Please Enter All Mandatory Fields');
      this.deactivateSpinner();
      return;
    }
    if (this.AdvertisementsDetails?.some(ad => !ad.add_logo || !ad.add_website)) {
      this.toastr.info('Please provide an ad image and its URL.', 'Advertisement');
      this.deactivateSpinner();
      return;
    }
    let value: any = form.value;
    value.AdvertisementsDetails = this.AdvertisementsDetails;
    this.CommonService.postCall("Advertisement/SaveOrUpdateAdvertisement", value).subscribe((res: any) => {
      if (res.status) {
        this.getList();
        this.toastr.success(res.message);
        document.getElementById("md_close")?.click();
      } else {
        this.toastr.warning(res.message);
      }
      this.deactivateSpinner();
    }, (err) => {
      this.toastr.error(err.error ? err.error.message : "Advertisements Not Updated");
      this.deactivateSpinner();
    });
  }


  edit(item: any) {
    this.activeSpinner();
    this.isEdit = true;
    this.myForm.reset();
    this.CommonService.postCall("Advertisement/GetAdvertisementList", {
      adv_tnt_code: this.companyList.find(e => e.COMPANY_ID == this.company_id)?.TNT_CODE || this.TenantCode,
      advertisement_id: item.advertisement_id,
      company_id: this.company_id,
    }).subscribe((res: any) => {
      if (res instanceof Array && res.length) {
        this.editData = res[0].data[0];
        this.dataTransForm();
        this.deactivateSpinner();
      } else {
        this.editData = res.data[0];
        this.isApproved = this.editData.adv_approval_status == 2 ? false : true;
        this.AdvertisementsDetails = this.editData.AdvertisementsDetails.map(e => ({ ...e, add_fullurl: `${this.serverPath}${e.add_logo}`, add_fileName: this.getName('HomePageImage', e.add_logo) }))
        this.dataTransForm();
        this.deactivateSpinner();
      }
      this.deactivateSpinner();
    }),
      (err) => {
        this.toastr.error(err.error);
        this.deactivateSpinner();
      };
  }

  dataTransForm() {
    let ctrls = this.myForm.controls;
    Object.keys(ctrls).map((key) => {
      let ctrl: AbstractControl = ctrls[key];
      ctrl.setValue(this.editData[key]);
    });
    ctrls['adv_fromdate'].setValue(moment(this.editData.adv_fromdate).format('yyyy-MM-DD'));
    ctrls['adv_enddate'].setValue(moment(this.editData.adv_enddate).format('yyyy-MM-DD'));
  }

  getName(folderName: string, fileName: any) {
    return fileName?.substr(fileName?.indexOf(`${folderName}_`)).replace(`${folderName}_`, '').split(/_(.*)/s)[1];
  }

  addImages() {
    if (this.AdvertisementsDetails.length == 2) {
      this.toastr.warning('You can upload only two images', 'Advertisement')
    } else {
      let imgObj: any = {
        add_advertisement_id: this.isEdit ? this.myForm.get('advertisement_id')?.value: 0,
        advertisement_detailid: 0,
        add_logo: '',
        add_website: '',
        add_fullurl: '',
        add_fileName: '',
        add_created_by: this.userId,
        add_tnt_code: this.TenantCode,
        add_modified_by: this.userId,
      }
      this.AdvertisementsDetails.push(imgObj);
    }
  }

  changeFile1(event: any, item: any) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = ['png', 'jpg', 'PNG', 'jpeg', 'gif', 'JPEG', 'JPG', 'image'];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        this.uploadImage1(item);
        return;
      }
      else
        this.toastr.warning(' Please upload png ,jpg ,PNG ,jpeg ,gif,JPG image formats only');
      event.target.value = '';
    }
  }

  uploadImage1(item: any) {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/HomePageImage');
    this.fileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        if (res.path) {
          this.fileName1 = res.path;
          this.imageURL1 = `${this.serverPath}${this.fileName1}`;
          item.add_logo = res.path;
          item.add_fullurl = `${this.serverPath}${this.fileName1}`;
        }

      } catch (e) {
      }

    }, err => { })

  }

  updateToDateMin() {
    const fromDate = this.myForm.get('adv_fromdate')?.value;
    this.minToDate = fromDate ? fromDate : ''; // Set "To Date" minimum to "From Date"
  }

  deleteImage(i: number, item: any) {
    if (confirm("Are you sure you want to delete this Image and Url?")) {
      if (item.advertisement_detailid > 0) {
        this.activeSpinner();
        this.CommonService.getCall(`Advertisement/DeleteByAdvertisementDetails/${this.TenantCode}/${item.advertisement_detailid}`).subscribe((response) => {
          if (response.status) {
            this.AdvertisementsDetails.splice(i, 1);
            this.toastr.success("Advertisement image deleted successfully!");
          } else {
            this.toastr.success(response.message);
          }
          this.deactivateSpinner();
        }, (error) => {
          this.toastr.error("Failed to delete Image a& Url. Please try again.");
          this.deactivateSpinner();
        });
      } else {
        this.AdvertisementsDetails.splice(i, 1);
        this.toastr.success("Advertisement image deleted successfully!");
      }
    }
  }
}
